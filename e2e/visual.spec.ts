import { expect, test } from '@playwright/test';
import { open, solve, type } from './helpers';

test('setup form', async ({ page }) => {
  await open(page);
  await expect(page).toHaveScreenshot('setup.png', { fullPage: true });
});

test('game with guesses', async ({ page }) => {
  await solve(page);
  await type(page, 'jonlrvaeimwylcpd');
  await expect(page).toHaveScreenshot('game.png', { fullPage: true });
});

test('selected letter', async ({ page }) => {
  await solve(page);
  await type(page, 'jo');
  await type(page, 'p');
  await expect(page).toHaveScreenshot('selected.png', { fullPage: true });
});

test('duplicate guesses', async ({ page }) => {
  await solve(page);
  await type(page, 'jonsaz');
  await expect(page).toHaveScreenshot('duplicates.png', { fullPage: true });
});

test('narrow game', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await solve(page);
  await type(page, 'jonlrvae');
  await expect(page).toHaveScreenshot('narrow.png', { fullPage: true });
});
