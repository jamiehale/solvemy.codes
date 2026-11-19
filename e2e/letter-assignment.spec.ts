import { expect, test } from '@playwright/test';
import { done, guessOf, keyEntry, keyText, press, solve, type } from './helpers';

const puzzle = { cipher: 'abc', clues: { a: 'x' } };

const selected = async (page: Parameters<typeof keyText>[0]) => {
  const found: string[] = [];
  for (const l of 'abcdefghijklmnopqrstuvwxyz') {
    if ((await keyText(page, l)).endsWith('=?')) found.push(l);
  }
  return found;
};

test.describe('typing a letter selects it', () => {
  test('select by keyboard', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'b');
    expect(await selected(page)).toEqual(['b']);
  });

  test('shifted letter ignored', async ({ page }) => {
    await solve(page, puzzle);
    await press(page, 'Shift+B');
    expect(await selected(page)).toEqual([]);
  });
});

test.describe('typing a second letter sets the guess', () => {
  test('set a guess', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'by');
    expect(await guessOf(page, 'b')).toBe('y');
    expect(await selected(page)).toEqual([]);
  });

  test('replace a guess', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'by');
    await type(page, 'bz');
    expect(await guessOf(page, 'b')).toBe('z');
  });

  test('replace a clue', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'aw');
    expect(await guessOf(page, 'a')).toBe('w');
  });

  test('a letter may be its own guess or repeat another guess', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'bb');
    await type(page, 'cx');
    expect(await guessOf(page, 'b')).toBe('b');
    expect(await guessOf(page, 'c')).toBe('x');
  });
});

test.describe('space or escape clears the guess', () => {
  test('clear with space', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'by');
    await type(page, 'b');
    await press(page, 'Space');
    expect(await guessOf(page, 'b')).toBe('');
    expect(await selected(page)).toEqual([]);
  });

  test('space does not scroll the page', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 300 });
    await solve(page, puzzle);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeGreaterThan(300);
    await type(page, 'b');
    await press(page, 'Space');
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('clear with escape', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'b');
    await press(page, 'Escape');
    expect(await guessOf(page, 'b')).toBe('');
    expect(await selected(page)).toEqual([]);
  });
});

test('other keys keep the selection', async ({ page }) => {
  await solve(page, puzzle);
  await type(page, 'by');
  await type(page, 'b5');
  expect(await selected(page)).toEqual(['b']);
  await press(page, 'Escape');
  await type(page, 'by');
  await type(page, 'b');
  await press(page, 'Enter');
  expect(await selected(page)).toEqual(['b']);
  await type(page, 'y');
  expect(await guessOf(page, 'b')).toBe('y');
});

test.describe('clicking a key entry selects it', () => {
  test('click with nothing selected', async ({ page }) => {
    await solve(page, puzzle);
    await keyEntry(page, 'c').click();
    expect(await selected(page)).toEqual(['c']);
  });

  test('click while another letter is selected', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'by');
    await type(page, 'b');
    await keyEntry(page, 'c').click();
    expect(await guessOf(page, 'b')).toBe('');
    expect(await selected(page)).toEqual(['c']);
  });

  test('click the selected letter', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'by');
    await type(page, 'b');
    await keyEntry(page, 'b').click();
    expect(await selected(page)).toEqual(['b']);
    await press(page, 'Escape');
    expect(await guessOf(page, 'b')).toBe('');
  });

  test('typing after a click sets the guess', async ({ page }) => {
    await solve(page, puzzle);
    await keyEntry(page, 'c').click();
    await type(page, 'z');
    expect(await guessOf(page, 'c')).toBe('z');
  });
});

test.describe('reset restores the clues', () => {
  test('reset after guesses', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'by');
    await type(page, 'aw');
    await page.getByRole('button', { name: 'Reset' }).click();
    expect(await guessOf(page, 'a')).toBe('x');
    expect(await guessOf(page, 'b')).toBe('');
  });

  test('reset keeps the selection', async ({ page }) => {
    await solve(page, puzzle);
    await type(page, 'b');
    await page.getByRole('button', { name: 'Reset' }).click();
    expect(await selected(page)).toEqual(['b']);
  });
});

test('guesses are not saved', async ({ page }) => {
  await solve(page, puzzle);
  await type(page, 'by');
  await page.reload();
  await done(page);
  expect(await guessOf(page, 'b')).toBe('');
  expect(await guessOf(page, 'a')).toBe('x');
});
