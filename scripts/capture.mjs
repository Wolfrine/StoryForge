import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';
const tmp = 'qa-tmp';
const out = 'qa-output';
await fs.rm(tmp, { recursive: true, force: true });
await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(tmp, { recursive: true });
await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch({ headless: true });

const targets = [
  ['01 Opening', base, { width: 1280, height: 800 }],
  ['02 Sunset Moonland', `${base}/?qa=1&entity=sunset-moonland&mode=world`, { width: 1280, height: 800 }],
  ['03 The Cessation', `${base}/?qa=1&entity=cessation&mode=world`, { width: 1280, height: 800 }],
  ['04 Lucas', `${base}/?qa=1&entity=lucas-menezes&mode=world`, { width: 1280, height: 800 }],
  ['05 Silent Proving', `${base}/?qa=1&entity=silent-proving&mode=world`, { width: 1280, height: 800 }],
  ['06 Obscured Canvas', `${base}/?qa=1&entity=obscured-canvas&mode=world`, { width: 1280, height: 800 }],
  ['07 Atlas', `${base}/?qa=1&entity=sunset-moonland&mode=atlas`, { width: 1280, height: 800 }],
  ['08 Mobile / Sunset', `${base}/?qa=1&entity=sunset-moonland&mode=world`, { width: 390, height: 844 }]
];

const shots = [];
for (const [label, url, viewport] of targets) {
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(250);
  const filename = label.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.jpg';
  const target = path.join(tmp, filename);
  await page.screenshot({
    path: target,
    type: 'jpeg',
    quality: 62,
    fullPage: false
  });
  shots.push({ label, target, viewport });
  await page.close();
}

const figures = [];
for (const shot of shots) {
  const bytes = await fs.readFile(shot.target);
  const src = `data:image/jpeg;base64,${bytes.toString('base64')}`;
  const mobile = shot.viewport.width < 600;
  figures.push(`
    <figure class="${mobile ? 'mobile' : 'desktop'}">
      <figcaption>${shot.label}</figcaption>
      <img src="${src}" alt="${shot.label}">
    </figure>
  `);
}

const sheet = await browser.newPage({ viewport: { width: 1500, height: 1800 } });
await sheet.setContent(`
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #ece8df; color: #24333d; font-family: Arial, sans-serif; }
  body { padding: 34px; }
  header { display:flex; justify-content:space-between; align-items:end; margin-bottom:24px; }
  h1 { margin:0; font-family: Georgia, serif; font-weight:400; font-size:34px; }
  header p { margin:0; color:#6d767b; font-size:12px; }
  main { display:grid; grid-template-columns: repeat(3, 1fr); gap: 18px; align-items:start; }
  figure { margin:0; background:#fff; padding:10px; border-radius:12px; box-shadow:0 8px 24px rgba(35,45,50,.08); }
  figure.mobile { grid-column: span 1; max-width: 250px; justify-self:center; }
  figcaption { padding:4px 4px 9px; font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:#58666e; }
  img { width:100%; display:block; border-radius:7px; object-fit:cover; object-position:top; }
  figure.desktop img { aspect-ratio:16/10; }
  figure.mobile img { aspect-ratio:390/844; }
</style>
</head>
<body>
  <header>
    <div>
      <h1>StoryForge visual QA</h1>
      <p>Single-sheet internal review · ${process.env.GITHUB_SHA?.slice(0, 8) ?? 'local'}</p>
    </div>
    <p>Desktop + mobile representative states</p>
  </header>
  <main>${figures.join('')}</main>
</body>
</html>
`, { waitUntil: 'load' });

await sheet.screenshot({
  path: path.join(out, 'storyforge-qa-contact-sheet.jpg'),
  type: 'jpeg',
  quality: 76,
  fullPage: true
});

await sheet.close();
await browser.close();

const stat = await fs.stat(path.join(out, 'storyforge-qa-contact-sheet.jpg'));
console.log(`QA contact sheet: ${Math.round(stat.size / 1024)} KB`);
