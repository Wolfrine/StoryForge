import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

await fs.mkdir('qa-screenshots', { recursive: true });
const browser = await chromium.launch();

async function shot(name, url, viewport) {
  const page = await browser.newPage({ viewportSize: viewport, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `qa-screenshots/${name}.png`, fullPage: true });
  await page.close();
}

const base = 'http://127.0.0.1:4173';
await shot('01-prelude-desktop', base, { width: 1440, height: 960 });
await shot('02-sunset-desktop', `${base}/?skipPrelude=1&entity=sunset-moonland`, { width: 1440, height: 960 });
await shot('03-cessation-desktop', `${base}/?skipPrelude=1&entity=cessation`, { width: 1440, height: 960 });
await shot('04-lucas-desktop', `${base}/?skipPrelude=1&entity=lucas-menezes`, { width: 1440, height: 960 });
await shot('05-canvas-desktop', `${base}/?skipPrelude=1&entity=obscured-canvas`, { width: 1440, height: 960 });
await shot('06-atlas-desktop', `${base}/?skipPrelude=1&mode=atlas&entity=sunset-moonland`, { width: 1440, height: 960 });
await shot('07-prelude-mobile', base, { width: 390, height: 844 });
await shot('08-sunset-mobile', `${base}/?skipPrelude=1&entity=sunset-moonland`, { width: 390, height: 844 });

await browser.close();
