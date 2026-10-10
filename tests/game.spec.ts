import { test, expect, type Page } from '@playwright/test';
import { LEVELS } from '../src/game/levels';

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

async function runLevel(page: Page, n: number) {
  const L = LEVELS[n].rows;
  const solid = (x: number, y: number) => L[y]?.[x] === '#';
  const standable = (x: number, y: number) => solid(x, y) || L[y]?.[x] === '=' || L[y]?.[x] === 'M';
  await page.keyboard.down('ArrowRight');
  let lastX = 0, stuck = 0;
  // generous budget: like a person, the bot may need a retry or two on the moving rate line
  for (let i = 0; i < 2000; i++) {
    const s = await state(page);
    if (s.finished) break;
    const tx = Math.floor((s.x + 10) / 32), row = Math.floor((s.y + 44) / 32);
    const gap = !standable(tx + 1, row) && !standable(tx + 2, row);
    const wall = solid(tx + 1, row - 1) || solid(tx + 1, row - 2);
    const step = [1, 2, 3].some((d) => L[row - d]?.[tx + 2] === '=');
    const hazard = L[row - 1]?.[tx + 1] === '^' || L[row - 1]?.[tx + 2] === '^';
    stuck = Math.abs(s.x - lastX) < 1 ? stuck + 1 : 0; lastX = s.x;
    if (s.grounded && (gap || wall || hazard || step || stuck > 3)) {
      await page.keyboard.down('Space'); await page.waitForTimeout(300); await page.keyboard.up('Space');
    } else await page.waitForTimeout(30);
  }
  await page.keyboard.up('ArrowRight');
  return state(page);
}

for (const n of [0, 1, 2]) {
  test(`level ${n + 1} can be finished`, async ({ page }) => {
    test.setTimeout(180000);
    await page.addInitScript(() => { (window as unknown as { __gameAssist: object }).__gameAssist = { invuln: true }; });
    await page.goto(`/?level=${n + 1}#play`);
    await page.getByRole('button', { name: 'Press to play' }).click();
    await page.waitForFunction(() => (window as unknown as { __game?: () => unknown }).__game?.());
    const s = await runLevel(page, n);
    expect(s.finished, `stopped at tile ${Math.floor(s.x / 32)}, row ${Math.floor((s.y + 44) / 32)}`).toBe(true);
    expect(s.level).toBe(n);
    // the case card hands the reader back to the work
    const card = page.locator(`.game-end[data-end="${n}"]`);
    await expect(card).toBeVisible({ timeout: 5000 });
    await expect(card.getByRole('link', { name: 'Read the case →' })).toHaveAttribute('href', ['/fx', '/fusion', '/winking-star'][n]);
  });
}

test('hazards hurt (three hits restart the level)', async ({ page }) => {
  await page.goto('/?level=2#play');
  await page.getByRole('button', { name: 'Press to play' }).click();
  await page.waitForFunction(() => (window as unknown as { __game?: () => unknown }).__game?.());
  // walk into the Board Room's first sliding template
  await page.keyboard.down('ArrowRight');
  await expect.poll(async () => (await state(page)).hits, { timeout: 8000 }).toBeGreaterThan(0);
  await page.keyboard.up('ArrowRight');
});

test('a case page links to its level without starting it', async ({ page }) => {
  await page.goto('/fusion');
  const link = page.getByRole('link', { name: /Play this case as a level/ });
  await expect(link).toHaveAttribute('href', '/?level=2#play');
  await link.click();
  await expect(page.locator('.game-level[data-level="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.play .game')).toHaveAttribute('data-state', 'poster');
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

test('sound is off by default and has one toggle', async ({ page }) => {
  await page.goto('/#play');
  const btn = page.getByRole('button', { name: 'Sound' });
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
  await btn.click();
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Press to play' }).click();
  await page.waitForFunction(() => (window as unknown as { __game?: () => unknown }).__game?.());
});
