import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { artworkKey, backdrops, themeArtwork } from '../src/lib/adaptive-art';
import sharp from 'sharp';
import { themedNames, explicitThemeArtwork } from '../src/lib/themed-art';

test('project heroes use the available phone width without overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 430, 820]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/fx', '/fusion', '/uoaui', '/winking-star', '/deal-model']) {
      await page.goto(route);
      const widths = await page.locator('.chapter-head').evaluate(el => ({
        available: el.clientWidth,
        hero: el.querySelector('.project-hero')!.getBoundingClientRect().width,
      }));
      expect(widths.hero, `${route} at ${width}`).toBeGreaterThanOrEqual(widths.available - 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  }
});

test('transparent images preserve every original byte apart from audited backdrop fills', () => {
  for (const name of themedNames) {
    const original=readFileSync(`public/art/${name}.svg`,'utf8');
    for (const theme of ['light','dark'] as const) {
      const svg=explicitThemeArtwork(original,name,theme);
      expect(svg.replace(/<style>[\s\S]*?<\/style>/,'')).toBe(original);
    }
  }
  for (const directory of ['', 'case-responsive/', 'fusion-responsive/', 'home-responsive/']) {
    for (const file of readdirSync(`public/art/${directory}`)) {
      if (!file.endsWith('.svg') || !backdrops[artworkKey(directory + file)]) continue;
      const original = readFileSync(`public/art/${directory}${file}`, 'utf8');
      const themed = themeArtwork(original, artworkKey(directory + file));
      expect(themed).not.toContain('prefers-color-scheme');
      expect(themed.replace(/data-presentation-backdrop="([^"]+)" fill="none"/g, 'fill="$1"')).toBe(original);
    }
  }
});

test('image surround follows site theme even when the SVG receives a light colour scheme', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.emulateMedia({ reducedMotion:'reduce', colorScheme:'light' });
  await page.goto('/winking-star');
  const consent = page.getByRole('button', { name:'No thanks' });
  if (await consent.isVisible()) await consent.click();
  const toggle = page.getByRole('switch', { name:'Dark mode' });
  await toggle.check();
  // Reproduce an embedded browser that does not propagate the document theme to SVG images.
  await page.addStyleTag({ content: '.ws-product-hero{color-scheme:light!important}' });
  const img = page.locator('.ws-product-hero img');
  await img.evaluate(el => (el as HTMLImageElement).decode());
  const dark = await sharp(await img.screenshot()).removeAlpha().raw().toBuffer({resolveWithObject:true});
  await toggle.uncheck();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  const light = await sharp(await img.screenshot()).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const pixel = (r:typeof dark, x:number,y:number) => [...r.data.subarray((y*r.info.width+x)*3,(y*r.info.width+x)*3+3)];
  expect(pixel(dark,1,1)).toEqual([23,27,34]);
  expect(pixel(light,1,1)).toEqual([255,255,255]);
  // Interior of first phone: the screenshot is not recoloured by the site theme.
  const x=Math.round(dark.info.width*.18), y=Math.round(dark.info.height*.3);
  expect(pixel(dark,x,y)).toEqual(pixel(light,x,y));
});


test('every project selects explicit diagram colours from the site theme', async ({page,request}) => {
  await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});
  for (const route of ['/fx','/fusion','/winking-star','/deal-model','/uoaui']) {
    await page.goto(route);
    await page.addStyleTag({content:'.theme-artwork{color-scheme:light!important}'});
    const toggle=page.getByRole('switch',{name:'Dark mode'});
    const count=route==='/fx'?5:2;
    for (const theme of ['dark','light']) {
      await toggle.setChecked(theme==='dark');
      await expect(page.locator(`[data-artwork-theme="${theme}"]:visible`)).toHaveCount(count);
      await expect(page.locator(`[data-artwork-theme="${theme==='dark'?'light':'dark'}"]:visible`)).toHaveCount(0);
      for (const src of await page.locator(`[data-artwork-theme="${theme}"]`).evaluateAll(els=>els.map(el=>(el as HTMLImageElement).src))) {
        const response=await request.get(src);
        expect(response.ok()).toBeTruthy();
        const svg=await response.text();
        expect(svg).not.toContain('@media');
        expect(svg).not.toContain('prefers-color-scheme');
      }
    }
    // All audited product compositions throughout the case use the transparent route.
    const compositions=await page.locator('img').evaluateAll(els=>els.map(el=>el.getAttribute('src')??'').filter(src=>src.includes('-composition')));
    for (const src of compositions) expect(src).toContain('/art/transparent/');
  }
});
