import { test, expect, type Page } from '@playwright/test';

const state = (page: Page) => page.evaluate(() => (window as unknown as { __game: () => any }).__game());
const ready = (page: Page) => page.waitForFunction(() => (window as unknown as { __game?: () => unknown }).__game?.());

test('choosing a world in the dropdown before pressing Play starts that world', async ({ page }) => {
  await page.goto('/');
  await page.locator('#game-world').selectOption('2');
  await ready(page);
  await expect.poll(async () => (await state(page)).mode).toBe('level');
  expect((await state(page)).level).toBe(2);
});

test('clicking a world on the map keeps the dropdown in step', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Press to play' }).click();
  await ready(page);
  // world 5 sits at (226, 214) on the 480×270 map
  const box = (await page.locator('#game').boundingBox())!;
  await page.mouse.click(box.x + (226 / 480) * box.width, box.y + (214 / 270) * box.height);
  await expect.poll(async () => (await state(page)).level).toBe(4);
  await expect(page.locator('#game-world')).toHaveValue('4');
});

test("the game's own controls don't pause it", async ({ page }) => {
  await page.goto('/?level=1#top');
  await page.getByRole('button', { name: 'Press to play' }).click();
  await ready(page);
  await expect.poll(async () => (await state(page)).mode).toBe('level');
  await page.getByRole('button', { name: 'Sound' }).click();
  await page.waitForTimeout(200);
  expect((await state(page)).paused).toBe(false);
  await page.locator('#game-world').focus();
  await page.waitForTimeout(200);
  expect((await state(page)).paused).toBe(false);
});

test('any game key carries on after a pause', async ({ page }) => {
  await page.goto('/?level=1#top');
  await page.getByRole('button', { name: 'Press to play' }).click();
  await ready(page);
  await expect.poll(async () => (await state(page)).mode).toBe('level');
  await page.keyboard.press('Escape');
  expect((await state(page)).paused).toBe(true);
  await page.keyboard.press('ArrowRight');
  await expect.poll(async () => (await state(page)).paused).toBe(false);
});

test('touch buttons move without pausing', async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto('/?level=1#top');
  await page.getByRole('button', { name: 'Press to play' }).click();
  await ready(page);
  await expect.poll(async () => (await state(page)).mode).toBe('level');
  const right = page.locator('.game-touch [data-k="right"]');
  await expect(right).toBeVisible();
  const x0 = (await state(page)).x;
  // hold the button like a thumb would, then let go
  await right.dispatchEvent('pointerdown', { pointerType: 'touch' });
  await page.waitForTimeout(400);
  await right.dispatchEvent('pointerup', { pointerType: 'touch' });
  await page.waitForTimeout(200);
  const s = await state(page);
  expect(s.paused).toBe(false);
  expect(s.x).toBeGreaterThan(x0);
  await ctx.close();
});
