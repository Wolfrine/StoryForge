import fs from 'node:fs';
import { applicationDefault } from 'firebase-admin/app';

const projectId = process.env.FIREBASE_PROJECT_ID || 'lumio-forge';
const rulesFile = process.env.FIRESTORE_RULES_FILE || 'firestore.rules';

const credential = applicationDefault();
const token = await credential.getAccessToken();
const authHeaders = {
  Authorization: `Bearer ${token.access_token}`,
  'Content-Type': 'application/json'
};

const rulesContent = fs.readFileSync(rulesFile, 'utf8');

const rulesetResponse = await fetch(
  `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
  {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      source: {
        files: [
          {
            name: 'firestore.rules',
            content: rulesContent
          }
        ]
      }
    })
  }
);

if (!rulesetResponse.ok) {
  const details = await rulesetResponse.text();
  throw new Error(
    `Unable to create Firestore ruleset (${rulesetResponse.status}): ${details}`
  );
}

const ruleset = await rulesetResponse.json();
if (!ruleset.name) {
  throw new Error('Firebase Rules API returned no ruleset name.');
}

const releaseName = `projects/${projectId}/releases/cloud.firestore`;
const releaseUrl =
  `https://firebaserules.googleapis.com/v1/${releaseName}?updateMask=rulesetName`;

let releaseResponse = await fetch(releaseUrl, {
  method: 'PATCH',
  headers: authHeaders,
  body: JSON.stringify({
    name: releaseName,
    rulesetName: ruleset.name
  })
});

if (releaseResponse.status === 404) {
  releaseResponse = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`,
    {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: releaseName,
        rulesetName: ruleset.name
      })
    }
  );
}

if (!releaseResponse.ok) {
  const details = await releaseResponse.text();
  throw new Error(
    `Unable to release Firestore rules (${releaseResponse.status}): ${details}`
  );
}

console.log(`Firestore rules deployed from ${rulesFile}: ${ruleset.name}`);
