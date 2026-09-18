import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';
const output = 'qa-output';
await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const targets = [
  ['Phone 390x844', { width: 390, height: 844 }],
  ['Phone 430x932', { width: 430, height: 932 }],
  ['Landscape 844x390', { width: 844, height: 390 }]
];

const images = [];

for (const [label, viewport] of targets) {
  const page = await browser.newPage({ viewport });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(350);

  const file = path.join(
    output,
    label.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.jpg'
  );

  await page.screenshot({
    path: file,
    type: 'jpeg',
    quality: 66,
    fullPage: false
  });

  const bytes = await fs.readFile(file);
  images.push({
    label,
    viewport,
    data: `data:image/jpeg;base64,${bytes.toString('base64')}`
  });

  await page.close();
}

const manifestResponse = await fetch(`${base}/manifest.webmanifest`);
if (!manifestResponse.ok) {
  throw new Error('PWA manifest not served');
}

const manifest = await manifestResponse.json();
if (manifest.display !== 'standalone') {
  throw new Error('PWA manifest display must be standalone');
}

const swResponse = await fetch(`${base}/sw.js`);
if (!swResponse.ok) {
  throw new Error('Service worker not served');
}

const sheet = await browser.newPage({ viewport: { width: 1420, height: 980 } });
await sheet.setContent(`
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  *{box-sizing:border-box}
  html,body{margin:0;background:#ebe7df;color:#263a47;font-family:Arial,sans-serif}
  body{padding:28px}
  header{display:flex;justify-content:space-between;align-items:end;margin-bottom:22px}
  h1{margin:0;font:400 34px Georgia,serif}
  p{margin:0;color:#71808a;font-size:12px}
  main{display:flex;gap:18px;align-items:flex-start;justify-content:center}
  figure{margin:0;padding:9px;background:#fff;border-radius:14px;box-shadow:0 8px 24px rgba(38,58,71,.09)}
  figure.phone{width:330px}
  figure.landscape{width:650px}
  figcaption{padding:4px 4px 9px;font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:#687a85}
  img{display:block;width:100%;border-radius:8px}
</style>
</head>
<body>
<header>
  <div><h1>StoryForge mobile / PWA QA</h1><p>Manifest + service worker validated</p></div>
  <p>${manifest.name}</p>
</header>
<main>
${images
  .map(
    (image) => `
  <figure class="${image.viewport.width > image.viewport.height ? 'landscape' : 'phone'}">
    <figcaption>${image.label}</figcaption>
    <img src="${image.data}">
  </figure>`
  )
  .join('')}
</main>
</body>
</html>
`);

await sheet.screenshot({
  path: path.join(output, 'storyforge-pwa-mobile-qa.jpg'),
  type: 'jpeg',
  quality: 76,
  fullPage: true
});

await sheet.close();
await browser.close();

const stat = await fs.stat(path.join(output, 'storyforge-pwa-mobile-qa.jpg'));
console.log(`PWA/mobile QA passed; contact sheet ${Math.round(stat.size / 1024)} KB`);
