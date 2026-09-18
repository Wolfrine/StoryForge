const projectId = 'lumio-forge';
const worldId = 'novasaga';
const packageId = 'ninety-five-five-principle';

function decode(value) {
  if (!value || typeof value !== 'object') return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('nullValue' in value) return null;

  if ('arrayValue' in value) {
    return (value.arrayValue.values ?? []).map(decode);
  }

  if ('mapValue' in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields ?? {}).map(
        ([key, nested]) => [key, decode(nested)]
      )
    );
  }

  return null;
}

const docUrl =
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/storyworlds/${worldId}/packages/${packageId}`;

const response = await fetch(docUrl);

if (!response.ok) {
  throw new Error(
    `Published package is not publicly readable: ${response.status} ${await response.text()}`
  );
}

const document = await response.json();
const pkg = Object.fromEntries(
  Object.entries(document.fields ?? {}).map(
    ([key, value]) => [key, decode(value)]
  )
);

if (pkg.title !== 'The 95/5 Principle') {
  throw new Error(
    `Unexpected published title: ${JSON.stringify(pkg.title)}`
  );
}

if (!Array.isArray(pkg.media) || pkg.media.length !== 1) {
  throw new Error(
    `Expected one published media asset; got ${JSON.stringify(pkg.media)}`
  );
}

const mediaUrl = pkg.media[0]?.src;

if (
  typeof mediaUrl !== 'string' ||
  !mediaUrl.includes(
    'raw.githubusercontent.com/Wolfrine/StoryForge/published-media/'
  )
) {
  throw new Error(
    `Published media URL is not on the stable media branch: ${mediaUrl}`
  );
}

const mediaResponse = await fetch(mediaUrl);

if (!mediaResponse.ok) {
  throw new Error(
    `Published media is not readable: ${mediaResponse.status}`
  );
}

const mediaText = await mediaResponse.text();

if (!mediaText.includes('<title id="title">The 95/5 Principle</title>')) {
  throw new Error('Published media bytes do not match the creator asset.');
}

console.log(
  `Creator publish verified: ${packageId}, media=${mediaUrl}`
);
