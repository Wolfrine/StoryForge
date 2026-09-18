import { applicationDefault } from 'firebase-admin/app';

const projectId = process.env.FIREBASE_PROJECT_ID || 'lumio-forge';
const location = process.env.STORYFORGE_STORAGE_LOCATION || 'ASIA-SOUTH1';

async function configuredBucketName() {
  if (process.env.STORYFORGE_STORAGE_BUCKET) {
    return process.env.STORYFORGE_STORAGE_BUCKET;
  }

  try {
    const response = await fetch(
      'https://lumio-forge.web.app/__/firebase/init.json',
      { cache: 'no-store' }
    );
    if (response.ok) {
      const config = await response.json();
      if (config.storageBucket) return config.storageBucket;
    }
  } catch {
    // Fall through.
  }

  return `${projectId}-storyforge-media`;
}

const bucketName = await configuredBucketName();
const credential = applicationDefault();
const token = await credential.getAccessToken();
const headers = {
  Authorization: `Bearer ${token.access_token}`,
  'Content-Type': 'application/json'
};

const getUrl =
  `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucketName)}`;

let response = await fetch(getUrl, { headers });

if (response.ok) {
  console.log(`StoryForge media backend available: firebase-storage (${bucketName})`);
  process.exit(0);
}

if (response.status !== 404) {
  const details = await response.text();
  console.log(
    `Firebase Storage unavailable (${response.status}); StoryForge will use github media backend. ${details.slice(0, 400)}`
  );
  process.exit(0);
}

const createUrl =
  `https://storage.googleapis.com/storage/v1/b?project=${encodeURIComponent(projectId)}`;

response = await fetch(createUrl, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    name: bucketName,
    location,
    storageClass: 'STANDARD',
    versioning: { enabled: true },
    lifecycle: {
      rule: [
        {
          action: { type: 'Delete' },
          condition: {
            age: 30,
            matchesPrefix: [`storyworlds/novasaga/drafts/`]
          }
        }
      ]
    }
  })
});

if (!response.ok) {
  const details = await response.text();

  if (
    response.status === 403 &&
    /billing account|billing/i.test(details)
  ) {
    console.log(
      'Firebase Storage requires project billing; StoryForge will use github media backend until billing is enabled.'
    );
    process.exit(0);
  }

  throw new Error(
    `Unable to create Storage bucket (${response.status}): ${details}`
  );
}

console.log(`Created StoryForge media bucket: ${bucketName} in ${location}`);
