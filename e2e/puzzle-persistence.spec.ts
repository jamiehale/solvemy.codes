import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { defaultPuzzle, done, field, open, readPairs, savedPuzzle } from './helpers';

const fixture = readFileSync(new URL('./fixtures/saved-puzzle-882117f.json', import.meta.url), 'utf8');

test.describe('done saves the puzzle', () => {
  test('saved on done', async ({ page }) => {
    await open(page);
    await field.cipher(page).fill('abc');
    await field.clueLetter(page).fill('a');
    await field.clueValue(page).fill('x');
    await done(page);
    expect(await savedPuzzle(page)).toBe('{"cipher":"abc","clues":{"a":"x"}}');
  });

  test('not saved before done', async ({ page }) => {
    await open(page, { cipher: 'abc', clues: {} });
    await field.cipher(page).fill('xyz');
    await page.reload();
    await expect(field.cipher(page)).toHaveValue('abc');
  });
});

test.describe('the default puzzle', () => {
  test('first visit', async ({ page }) => {
    await open(page);
    await expect(field.cipher(page)).toHaveValue(defaultPuzzle.cipher);
    await expect(field.clueLetter(page)).toHaveValue('q');
    await expect(field.clueValue(page)).toHaveValue('s');
    expect(await savedPuzzle(page)).toBeNull();
  });

  test('corrupt saved value', async ({ page }) => {
    await open(page, 'not json');
    await expect(field.cipher(page)).toHaveValue(defaultPuzzle.cipher);
    expect(await savedPuzzle(page)).toBe('not json');
  });
});

test('a puzzle saved before this change still loads', async ({ page }) => {
  const saved = JSON.parse(fixture);
  await open(page, JSON.stringify(saved));
  await expect(field.cipher(page)).toHaveValue(saved.cipher);
  await done(page);
  const shown = await readPairs(page);
  expect(shown.map(([cipher]) => cipher).join('')).toBe(saved.cipher.replace(/ /g, ''));
  for (const [cipher, guess] of shown) {
    if (cipher in saved.clues) expect(guess).toBe(saved.clues[cipher]);
  }
  expect(shown.some(([cipher]) => cipher in saved.clues)).toBe(true);
});
