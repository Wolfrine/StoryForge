const worldUrl =
  'https://firestore.googleapis.com/v1/projects/lumio-forge/databases/(default)/documents/storyworlds/novasaga';

const worldResponse = await fetch(worldUrl, {
  headers: { Accept: 'application/json' }
});

if (!worldResponse.ok) {
  const details = await worldResponse.text();
  throw new Error(
    `Public Firestore world read failed (${worldResponse.status}): ${details}`
  );
}

const packagesUrl =
  'https://firestore.googleapis.com/v1/projects/lumio-forge/databases/(default)/documents/storyworlds/novasaga/packages?pageSize=100';

const packagesResponse = await fetch(packagesUrl, {
  headers: { Accept: 'application/json' }
});

if (!packagesResponse.ok) {
  const details = await packagesResponse.text();
  throw new Error(
    `Public Firestore package read failed (${packagesResponse.status}): ${details}`
  );
}

const packages = await packagesResponse.json();
const count = Array.isArray(packages.documents) ? packages.documents.length : 0;

if (count < 6) {
  throw new Error(`Expected at least 6 published packages; found ${count}.`);
}

console.log(`Public Firestore runtime verified: ${count} packages readable.`);
