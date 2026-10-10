import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

test('hero renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/I design tools\s*where mistakes\s*cost money\./);
  await expect(page.locator('.hero-art img')).toBeVisible();
});

for (const [label, id] of [
  ['Work', 'work'], ['FX', 'fx'], ['Fusion', 'fusion'], ['Winking Star', 'winking'], ['uoaui.ai', 'ai'], ['How I work', 'how'],
]) {
  test(`nav link "${label}" scrolls to #${id}`, async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav').getByRole('link', { name: label, exact: true }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 5000 });
  });
}

test('Winking Star tick demo reaches 6 of 6', async ({ page }) => {
  await page.goto('/#ws-loops');
  const group = page.getByRole('group', { name: 'Tick a routine' });
  for (const b of await group.getByRole('button').all()) await b.click();
  await expect(page.locator('#demo-stars')).toHaveText('6 of 6 stars');
  await expect(group.getByRole('button', { pressed: true })).toHaveCount(6);
});

test('/revolut carries the panel line and stays out of the index', async ({ page }) => {
  await page.goto('/revolut');
  await expect(page.getByText('Portfolio for the Revolut design panel')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://shannonhecker.com/');
});

test('footer carries the build line and links to the log', async ({ page }) => {
  await page.goto('/');
  const line = page.getByRole('link', { name: 'Built in code with Claude Code, art directed by me.' });
  await expect(line).toHaveAttribute('href', '/build');
  await line.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Build log' })).toBeVisible();
});

test('every external link opens in a new tab safely', async ({ page }) => {
  await page.goto('/');
  const ext = page.locator('a[href^="http"]');
  expect(await ext.count()).toBeGreaterThan(0);
  for (const a of await ext.all()) {
    await expect(a).toHaveAttribute('target', '_blank');
    await expect(a).toHaveAttribute('rel', /noopener/);
  }
});

for (const width of [320, 390, 820, 1440]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(over).toBeLessThanOrEqual(0);
  });
}

for (const width of [390, 820, 1440]) {
  test(`axe: zero violations at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); // scan the settled page, not mid-reveal
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
  });
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('page is complete and still', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/\bjs\b/);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('.rv, .split .wd, .hero h1 .ln span')].filter((el) => getComputedStyle(el).opacity !== '1').length,
    );
    expect(hidden).toBe(0);
    const anims = await page.evaluate(() =>
      ['.ticker-track', '.themes-track'].map((s) => getComputedStyle(document.querySelector(s)!).animationName),
    );
    expect(anims).toEqual(['none', 'none']);
  });
});

test.describe('JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });
  test('all content is readable', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    for (const id of ['work', 'fx', 'fusion', 'winking', 'ai', 'how', 'links']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id} h2`).first()).toBeVisible();
    }
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('.rv, .split .wd')].filter((el) => getComputedStyle(el).opacity !== '1').length,
    );
    expect(hidden).toBe(0);
    // The phone strip scrolls natively
    expect(await page.locator('.strip-wrap').evaluate((el) => getComputedStyle(el).overflowX)).toBe('auto');
  });
});

test.describe('mobile nav', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('signals overflow and keeps the current section in view', async ({ page }) => {
    await page.goto('/');
    const list = page.locator('.nav ul');
    await expect(list).toHaveClass(/more-end/);
    await page.locator('#how').scrollIntoViewIfNeeded();
    const link = page.locator('.nav a.l', { hasText: 'How I work' });
    await expect(link).toHaveAttribute('aria-current', 'true');
    await expect.poll(async () => {
      const [l, a] = await Promise.all([list.boundingBox(), link.boundingBox()]);
      return !!l && !!a && a.x >= l.x - 1 && a.x + a.width <= l.x + l.width + 1;
    }, { timeout: 3000 }).toBe(true);
  });
});
