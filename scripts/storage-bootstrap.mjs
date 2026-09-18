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
    // Fall through to deterministic StoryForge bucket name.
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
  console.log(`StoryForge media bucket exists: ${bucketName}`);
  process.exit(0);
}

if (response.status !== 404) {
  const details = await response.text();
  throw new Error(
    `Unable to inspect Storage bucket (${response.status}): ${details}`
  );
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
    versioning: {
      enabled: true
    },
    lifecycle: {
      rule: [
        {
          action: { type: 'Delete' },
          condition: {
            age: 30,
            matchesPrefix: [
              `storyworlds/novasaga/drafts/`
            ]
          }
        }
      ]
    }
  })
});

if (!response.ok) {
  const details = await response.text();
  throw new Error(
    `Unable to create Storage bucket (${response.status}): ${details}`
  );
}

console.log(`Created StoryForge media bucket: ${bucketName} in ${location}`);
