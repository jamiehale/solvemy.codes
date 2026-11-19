import { expect, test } from '@playwright/test';
import { defaultPuzzle, done, field, open, readPairs, savedPuzzle, solve, textTransform, type } from './helpers';

test.describe('the app opens on the setup form', () => {
  test('load with a saved puzzle', async ({ page }) => {
    await open(page, { cipher: 'abc', clues: { a: 'x' } });
    await expect(field.cipher(page)).toHaveValue('abc');
    await expect(field.clueLetter(page)).toHaveValue('a');
    await expect(field.clueValue(page)).toHaveValue('x');
    await expect(page.getByRole('button', { name: 'Done' })).toBeVisible();
  });

  test('load with no saved puzzle', async ({ page }) => {
    await open(page);
    await expect(field.cipher(page)).toHaveValue(defaultPuzzle.cipher);
    await expect(field.clueLetter(page)).toHaveValue('q');
    await expect(field.clueValue(page)).toHaveValue('s');
  });
});

test.describe('the cipher field lowercases its input', () => {
  test('typed capitals are stored lowercase', async ({ page }) => {
    await open(page);
    await field.cipher(page).click();
    await page.keyboard.press('Backspace');
    await page.keyboard.type('Hello, World');
    await done(page);
    expect(JSON.parse((await savedPuzzle(page))!).cipher).toBe('hello, world');
  });

  test('cipher shown in uppercase', async ({ page }) => {
    await open(page, { cipher: 'abc', clues: {} });
    expect(await textTransform(field.cipher(page))).toBe('uppercase');
  });
});

test.describe('clue fields take one letter each', () => {
  test('digit is ignored', async ({ page }) => {
    await open(page, { cipher: 'abc', clues: {} });
    await field.clueLetter(page).click();
    await page.keyboard.type('5');
    await expect(field.clueLetter(page)).toHaveValue('');
  });

  test('second letter is refused', async ({ page }) => {
    await open(page, { cipher: 'abc', clues: {} });
    await field.clueLetter(page).click();
    await page.keyboard.type('q');
    await page.keyboard.type('r');
    await expect(field.clueLetter(page)).toHaveValue('q');
  });

  test('clue fields shown in uppercase', async ({ page }) => {
    await open(page);
    expect(await textTransform(field.clueLetter(page))).toBe('uppercase');
    expect(await textTransform(field.clueValue(page))).toBe('uppercase');
  });
});

test('focusing a field selects its text, so typing replaces it', async ({ page }) => {
  await open(page, { cipher: 'abc', clues: { q: 's' } });
  await field.clueLetter(page).click();
  await page.keyboard.type('r');
  await expect(field.clueLetter(page)).toHaveValue('r');
});

test.describe('done saves the puzzle and starts solving', () => {
  test('done with a clue', async ({ page }) => {
    await solve(page, { cipher: 'abc', clues: { a: 'x' } });
    expect(await readPairs(page)).toEqual([['a', 'x'], ['b', ''], ['c', '']]);
  });

  test('done with half a clue', async ({ page }) => {
    await open(page, { cipher: 'abc', clues: { a: 'x' } });
    await field.clueValue(page).click();
    await page.keyboard.press('Backspace');
    await done(page);
    expect(await readPairs(page)).toEqual([['a', ''], ['b', ''], ['c', '']]);
    expect(JSON.parse((await savedPuzzle(page))!).clues).toEqual({});
  });

  test('enter submits', async ({ page }) => {
    await open(page, { cipher: 'abc', clues: {} });
    await field.cipher(page).click();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('board')).toBeVisible();
    expect(await savedPuzzle(page)).toBe('{"cipher":"abc","clues":{}}');
  });
});

test('edit puzzle returns to the setup form and drops guesses', async ({ page }) => {
  await solve(page, { cipher: 'abc', clues: { a: 'x' } });
  await type(page, 'by');
  expect(await readPairs(page)).toEqual([['a', 'x'], ['b', 'y'], ['c', '']]);
  await page.getByRole('button', { name: 'Edit Puzzle' }).click();
  await expect(field.cipher(page)).toHaveValue('abc');
  await done(page);
  expect(await readPairs(page)).toEqual([['a', 'x'], ['b', ''], ['c', '']]);
});

test('only the first clue is editable', async ({ page }) => {
  await open(page, { cipher: 'abc', clues: { a: 'x', b: 'y' } });
  await expect(field.clueLetter(page)).toHaveValue('a');
  await expect(field.clueValue(page)).toHaveValue('x');
  await done(page);
  expect(JSON.parse((await savedPuzzle(page))!).clues).toEqual({ a: 'x' });
});
