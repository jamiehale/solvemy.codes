import { expect, test } from '@playwright/test';
import { background, pairs, readPairs, solve, open, textTransform, themeColor, transparent, type, words } from './helpers';

test('the cipher is split into words', async ({ page }) => {
  await solve(page, { cipher: 'ab cd', clues: {} });
  await expect(words(page)).toHaveCount(2);
  await expect(words(page).nth(0).getByTestId('cipher')).toHaveText(['a', 'b']);
  await expect(words(page).nth(1).getByTestId('cipher')).toHaveText(['c', 'd']);
});

test('a word keeps its characters on one line', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await solve(page, { cipher: 'abcdefg hijklmn opqrstu', clues: {} });
  for (const word of await words(page).all()) {
    const tops = await word.getByTestId('cipher').evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().top),
    );
    expect(new Set(tops).size).toBe(1);
  }
  const wordTops = await words(page).evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
  expect(new Set(wordTops).size).toBeGreaterThan(1);
});

test.describe('each character is a pair', () => {
  test('letter with a guess', async ({ page }) => {
    await solve(page, { cipher: 'abc', clues: {} });
    await type(page, 'by');
    expect(await readPairs(page)).toEqual([['a', ''], ['b', 'y'], ['c', '']]);
  });

  test('repeated letter', async ({ page }) => {
    await solve(page, { cipher: 'aba', clues: { a: 'x' } });
    expect(await readPairs(page)).toEqual([['a', 'x'], ['b', ''], ['a', 'x']]);
  });

  test('letters display in uppercase, the cipher outlined', async ({ page }) => {
    await solve(page, { cipher: 'ab', clues: { a: 'x' } });
    const pair = pairs(page).first();
    expect(await textTransform(pair.getByTestId('cipher'))).toBe('uppercase');
    expect(await textTransform(pair.getByTestId('guess'))).toBe('uppercase');
    expect(await pair.getByTestId('cipher').evaluate((el) => getComputedStyle(el).borderTopColor)).toBe('rgb(0, 0, 0)');
  });
});

test('non-letters pass through', async ({ page }) => {
  await solve(page, { cipher: 'ab.', clues: {} });
  expect((await readPairs(page))[2]).toEqual(['.', '.']);
  await type(page, '.x');
  expect(await readPairs(page)).toEqual([['a', ''], ['b', ''], ['.', '.']]);
});

test('filled pairs are shaded', async ({ page }) => {
  await solve(page, { cipher: 'ab.', clues: { a: 'x' } });
  const gray = await themeColor(page, 'gray-200');
  const cipherBoxes = page.getByTestId('cipher');
  expect(await background(cipherBoxes.nth(0))).toBe(gray);
  expect(await background(cipherBoxes.nth(1))).toBe(transparent);
  expect(await background(cipherBoxes.nth(2))).toBe(gray);
});

test.describe('page layout', () => {
  const box = async (page: Parameters<typeof words>[0], testId: string) =>
    (await page.getByTestId(testId).boundingBox())!;

  test('wide screen', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await solve(page);
    const board = await box(page, 'board');
    const panel = await box(page, 'puzzle-key-panel');
    expect(panel.x).toBeGreaterThanOrEqual(board.x + board.width);
  });

  test('narrow screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await solve(page);
    const board = await box(page, 'board');
    const panel = await box(page, 'puzzle-key-panel');
    expect(panel.y).toBeGreaterThanOrEqual(board.y + board.height);
  });

  test('heading and source link on the setup form', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('heading', { name: 'solve my . codes' })).toBeVisible();
    const link = page.getByRole('link', { name: 'View source on GitHub' });
    await expect(link).toHaveAttribute('href', 'https://github.com/jamiehale/solvemy.codes');
    await expect(link).toHaveAttribute('target', '_new');
    await expect(link.locator('svg')).toBeVisible();
  });

  test('heading and source link while solving', async ({ page }) => {
    await solve(page);
    await expect(page.getByRole('heading', { name: 'solve my . codes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View source on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/jamiehale/solvemy.codes',
    );
    await expect(page.locator('.github-corner svg')).toBeVisible();
  });
});
