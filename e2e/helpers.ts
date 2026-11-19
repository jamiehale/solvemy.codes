import type { Locator, Page } from '@playwright/test';

export interface Puzzle {
  cipher: string;
  clues: Record<string, string>;
}

export const defaultPuzzle: Puzzle = { cipher: 'qjnra iw . ljpaq', clues: { q: 's' } };

export const seed = async (page: Page, saved: Puzzle | string | null) => {
  const value = saved === null || typeof saved === 'string' ? saved : JSON.stringify(saved);
  await page.addInitScript((v) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.clear();
    if (v !== null) localStorage.setItem('puzzle', v);
  }, value);
};

export const open = async (page: Page, saved: Puzzle | string | null = null) => {
  await seed(page, saved);
  await page.goto('/');
};

export const field = {
  cipher: (page: Page) => page.getByLabel('Cipher:'),
  clueLetter: (page: Page) => page.getByLabel('Clue Letter:'),
  clueValue: (page: Page) => page.getByLabel('Clue Value:'),
};

export const done = (page: Page) => page.getByRole('button', { name: 'Done' }).click();

export const solve = async (page: Page, saved: Puzzle | string | null = null) => {
  await open(page, saved);
  await done(page);
};

const blur = (page: Page) =>
  page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());

// Typing goes to window; blurring first keeps a focused button from also taking Space or Enter
export const type = async (page: Page, keys: string) => {
  await blur(page);
  await page.keyboard.type(keys);
};

export const press = async (page: Page, key: string) => {
  await blur(page);
  await page.keyboard.press(key);
};

export const savedPuzzle = (page: Page) => page.evaluate(() => localStorage.getItem('puzzle'));

const text = async (locator: Locator) =>
  ((await locator.textContent()) ?? '').replace(/\u00a0/g, '').trim();

export const pairs = (page: Page) => page.locator('[data-pair]');

export const readPairs = async (page: Page) => {
  const result: [string, string][] = [];
  for (const pair of await pairs(page).all()) {
    result.push([
      await text(pair.getByTestId('cipher')),
      await text(pair.getByTestId('guess')),
    ]);
  }
  return result;
};

export const words = (page: Page) => page.getByTestId('board').locator(':scope > div');

export const keyEntry = (page: Page, letter: string) => page.locator(`[data-key="${letter}"]`);

export const keyText = (page: Page, letter: string) => text(keyEntry(page, letter));

export const guessOf = async (page: Page, letter: string) => {
  const entry = await keyText(page, letter);
  return entry.slice(entry.indexOf('=') + 1);
};

const style = (locator: Locator, property: 'backgroundColor' | 'borderColor' | 'textTransform') =>
  locator.evaluate((el, p) => getComputedStyle(el)[p], property);

export const background = (locator: Locator) => style(locator, 'backgroundColor');

export const borderColor = (locator: Locator) => style(locator, 'borderColor');

export const textTransform = (locator: Locator) => style(locator, 'textTransform');

export const keyBackground = (page: Page, letter: string) =>
  background(keyEntry(page, letter).locator(':scope > div'));

export const keyBorder = (page: Page, letter: string) =>
  borderColor(keyEntry(page, letter).locator(':scope > div'));

export const transparent = 'rgba(0, 0, 0, 0)';

export const themeColor = (page: Page, name: 'gray-200' | 'red-200' | 'red-400') =>
  page.evaluate((n) => {
    const probe = document.createElement('div');
    probe.style.backgroundColor = `var(--color-${n})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return color;
  }, name);
