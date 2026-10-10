import { test, expect, type Page } from '@playwright/test';
import { LEVEL } from '../src/game/level';

const state = (page: Page) => page.evaluate(() => (window as unknown as { __game: () => any }).__game());

async function boot(page: Page) {
  await page.goto('/#play');
  await page.getByRole('button', { name: 'Press to play' }).click();
  await page.waitForFunction(() => (window as unknown as { __game?: () => unknown }).__game?.());
}

test('nothing runs until Play is pressed', async ({ page }) => {
  const chunks: string[] = [];
  page.on('request', (r) => { if (/\/_astro\/main\.[^/]+\.js$/.test(r.url())) chunks.push(r.url()); });
  await page.goto('/#play');
  await page.waitForTimeout(800);
  expect(chunks).toEqual([]);
  await expect(page.locator('.play .game')).toHaveAttribute('data-state', 'poster');
});

test('the game boots on click and the player can jump', async ({ page }) => {
  await boot(page);
  await expect(page.locator('#game')).toBeFocused();
  const before = await state(page);
  expect(before.grounded).toBe(true);
  const scrollBefore = await page.evaluate(() => scrollY);
  await page.keyboard.down('Space');
  await expect.poll(async () => (await state(page)).y, { timeout: 2000 }).toBeLessThan(before.y - 40);
  await page.keyboard.up('Space');
  // Space and arrows belong to the game while it has focus, not to the page.
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
});

test('Escape pauses, and Tab still leaves the game (no keyboard trap)', async ({ page }) => {
  await boot(page);
  await page.keyboard.press('Escape');
  expect((await state(page)).paused).toBe(true);
  await page.keyboard.press('Tab');
  await expect(page.locator('#game')).not.toBeFocused();
});

test('the level can be finished', async ({ page }) => {
  test.setTimeout(60000);
  await boot(page);
  const T = 32;
  const solid = (tx: number, ty: number) => LEVEL[ty]?.[tx] === '#';
  await page.keyboard.down('ArrowRight');
  let lastX = 0, stuck = 0;
  for (let i = 0; i < 500; i++) {
    const s = await state(page);
    if (s.finished) break;
    const tx = Math.floor((s.x + 10) / T), row = Math.floor((s.y + 44) / T);
    const gap = !solid(tx + 1, row) && !solid(tx + 2, row);
    const wall = solid(tx + 1, row - 1);
    const hazard = LEVEL[row - 1]?.[tx + 1] === '^' || LEVEL[row - 1]?.[tx + 2] === '^';
    stuck = Math.abs(s.x - lastX) < 1 ? stuck + 1 : 0; lastX = s.x;
    if (s.grounded && (gap || wall || hazard || stuck > 3)) {
      await page.keyboard.down('Space'); await page.waitForTimeout(260); await page.keyboard.up('Space');
    } else await page.waitForTimeout(40);
  }
  expect((await state(page)).finished).toBe(true);
  await expect(page.getByRole('button', { name: 'Play again' })).toBeFocused();
});

test('the site still works if the game chunk fails to load', async ({ page }) => {
  await page.route(/\/_astro\/main\.[^/]+\.js$/, (r) => r.abort());
  await page.goto('/#play');
  await page.getByRole('button', { name: 'Press to play' }).click();
  await expect(page.locator('.play .game')).toHaveAttribute('data-state', 'poster');
  await expect(page.getByRole('button', { name: 'Press to play' })).toBeEnabled();
  await expect(page.locator('#links h2')).toBeVisible();
});

test.describe('JavaScript off', () => {
  test.use({ javaScriptEnabled: false });
  test('the game shows a static poster and no dead Play button', async ({ page }) => {
    await page.goto('/#play');
    await expect(page.locator('.game-poster img')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Press to play' })).toBeHidden();
  });
});
