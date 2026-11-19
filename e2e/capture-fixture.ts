import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const [url = 'http://localhost:5173', out = 'e2e/fixtures/saved-puzzle.json'] = process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url);
await page.evaluate(() => localStorage.clear());
await page.reload();

await page.getByLabel('Cipher:').fill('Xli uymgo, fvsar jsb!');
await page.getByLabel('Clue Letter:').fill('x');
await page.getByLabel('Clue Value:').fill('t');
await page.getByRole('button', { name: 'Done' }).click();

const saved = await page.evaluate(() => localStorage.getItem('puzzle'));
if (!saved) throw new Error('nothing saved under "puzzle"');
writeFileSync(out, JSON.stringify(JSON.parse(saved), null, 2) + '\n');
console.log(`wrote ${out}: ${saved}`);

await browser.close();
