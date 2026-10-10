import { test, expect } from '@playwright/test';
test('playtest', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#play'); await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Press to play' }).click();
  await page.waitForFunction(() => (window as any).__game?.());
  const st = () => page.evaluate(() => (window as any).__game());
  await page.waitForTimeout(400);
  const s0 = await st(); console.log('start', JSON.stringify(s0));
  await page.keyboard.down('Space'); await page.waitForTimeout(120);
  const s1 = await st(); console.log('jumping', JSON.stringify(s1));
  await page.keyboard.up('Space'); await page.waitForTimeout(900);
  await page.keyboard.down('ArrowRight'); await page.waitForTimeout(700);
  await page.locator('#game').screenshot({ path: process.env.S + '/game1.png' });
  await page.keyboard.up('ArrowRight');
  console.log('after', JSON.stringify(await st()));
  // scroll window should not have moved from Space/arrows
  console.log('scrollY stable', await page.evaluate(() => scrollY));
  console.log('errors', errors);
});
