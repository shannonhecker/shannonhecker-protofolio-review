import { test, expect } from '@playwright/test';

for (const path of ['/fx', '/fusion', '/winking-star', '/uoaui']) {
  test(`${path}: every case navigation target exists and evidence remains readable`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const nav = page.getByRole('navigation', { name: 'Case study sections' });
    for (const link of await nav.locator('a[href^="#"]').all()) {
      const href = (await link.getAttribute('href'))!;
      await expect(page.locator(href)).toHaveCount(1);
    }
    await nav.getByRole('link', { name: 'Decision map', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Decision map', exact: true })).toBeInViewport();
    for (const width of [320, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.locator('.decision-map li, .process-journey li, .persona-roles article').evaluateAll((els) =>
        els.filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent?.slice(0, 50)),
      );
      expect(overflow).toEqual([]);
    }
  });
}

test('the game cover stays static and makes no video request under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requests: string[] = [];
  page.on('request', (r) => { if (r.url().includes('working-order-cover.mp4')) requests.push(r.url()); });
  await page.goto('/panel');
  await page.locator('.game-poster').hover();
  await page.getByRole('button', { name: 'Press to play' }).focus();
  await expect(page.locator('.game-poster img')).toBeVisible();
  await expect(page.locator('.game-cover-motion')).toHaveCount(0);
  expect(requests).toEqual([]);
});

test('case evidence keeps its full image proportions after loading', async ({ page }) => {
  for (const path of ['/fx', '/fusion', '/uoaui', '/winking-star']) {
    await page.goto(path);
    await page.locator('.evidence img, .phone img, .ws-hero img, .fx-original-flow img').evaluateAll(async (imgs) => {
      await Promise.all(imgs.map(async (el) => { const img = el as HTMLImageElement; img.loading = 'eager'; await img.decode(); }));
    });
    const cropped = await page.locator('.evidence img, .phone img, .ws-hero img, .fx-original-flow img').evaluateAll((imgs) => imgs.filter((el) => {
      const img = el as HTMLImageElement, box = img.getBoundingClientRect();
      return Math.abs(box.width / box.height - img.naturalWidth / img.naturalHeight) > 0.02;
    }).map((el) => el.getAttribute('alt')));
    expect(cropped).toEqual([]);
  }
});


test('current product recordings stay paused until requested and use their full frame', async ({ page }) => {
  for (const path of ['/fx', '/fusion', '/uoaui']) {
    await page.goto(path);
    const video = page.locator('.demo video');
    await video.scrollIntoViewIfNeeded();
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video.locator('source')).toHaveAttribute('src', /-current\.(webm|mp4)$/);
    await video.evaluate(async (v: HTMLVideoElement) => { await v.play(); v.pause(); });
    const dimensions = await video.evaluate((v: HTMLVideoElement) => ({ natural: v.videoWidth / v.videoHeight, rendered: v.clientWidth / v.clientHeight }));
    expect(Math.abs(dimensions.natural - dimensions.rendered)).toBeLessThan(0.02);
    for (const link of await page.getByRole('link', { name: /^View full size/ }).all()) {
      const response = await page.request.get((await link.getAttribute('href'))!);
      expect(response.ok()).toBe(true);
    }
  }
});
