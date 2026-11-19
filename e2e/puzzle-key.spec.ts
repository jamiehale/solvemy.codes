import { expect, test } from '@playwright/test';
import { keyBackground, keyBorder, keyText, solve, themeColor, transparent, type } from './helpers';

const letters = 'abcdefghijklmnopqrstuvwxyz';

test('the key lists all 26 letters in four columns', async ({ page }) => {
  await solve(page, { cipher: 'abc', clues: {} });
  await type(page, 'by');
  const entries = page.getByTestId('key').locator('[data-key]');
  await expect(entries).toHaveCount(26);
  for (const l of letters) {
    expect(await keyText(page, l)).toBe(l === 'b' ? 'b=y' : `${l}=`);
  }
  const lefts = await entries.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().left));
  expect(new Set(lefts).size).toBe(4);
  const reset = (await page.getByRole('button', { name: 'Reset' }).boundingBox())!;
  const grid = (await page.getByTestId('key').boundingBox())!;
  expect(reset.y).toBeGreaterThanOrEqual(grid.y + grid.height);
});

test('guessed entries are shaded', async ({ page }) => {
  await solve(page, { cipher: 'abc', clues: {} });
  await type(page, 'by');
  expect(await keyBackground(page, 'b')).toBe(await themeColor(page, 'gray-200'));
  expect(await keyBackground(page, 'c')).toBe(transparent);
});

test('the selected entry is marked', async ({ page }) => {
  await solve(page, { cipher: 'abc', clues: {} });
  await type(page, 'by');
  await type(page, 'b');
  expect(await keyText(page, 'b')).toBe('b=?');
  expect(await keyBorder(page, 'b')).toBe(await themeColor(page, 'red-400'));
  expect(await keyBorder(page, 'c')).toBe(transparent);
});

test.describe('duplicate guesses are flagged', () => {
  test('two letters with one guess', async ({ page }) => {
    await solve(page, { cipher: 'abc', clues: { a: 'x' } });
    await type(page, 'cz');
    await type(page, 'bx');
    const red = await themeColor(page, 'red-200');
    expect(await keyBackground(page, 'a')).toBe(red);
    expect(await keyBackground(page, 'b')).toBe(red);
    expect(await keyBackground(page, 'c')).toBe(await themeColor(page, 'gray-200'));
  });

  test('clash resolved', async ({ page }) => {
    await solve(page, { cipher: 'abc', clues: { a: 'x' } });
    await type(page, 'bx');
    await type(page, 'by');
    const gray = await themeColor(page, 'gray-200');
    expect(await keyBackground(page, 'a')).toBe(gray);
    expect(await keyBackground(page, 'b')).toBe(gray);
  });
});
