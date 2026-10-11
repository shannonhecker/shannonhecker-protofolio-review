import { test, expect } from '@playwright/test';

test('Deal Model is reachable from selected work and retains its evidence on mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/panel');
  await page.getByRole('button', { name: 'No thanks' }).click();
  await page.locator('#work a[href="/deal-model"]').click();
  await expect(page.getByRole('heading', { name: 'Deal Model', exact: true })).toBeVisible();
  await expect(page.locator('.deal-screen-gallery figure')).toHaveCount(13);
  await expect(page.locator('#deal-outcome')).toContainText('not a measured study');
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.locator('.section-open').click();
    await page.getByRole('navigation', { name: 'Case study sections' }).getByRole('link', { name: 'Product screens', exact: true }).click();
    await expect(page.locator('#deal-screens')).toBeInViewport();
  }
});

test('updated authored evidence loads without clipping and mobile identities stay readable', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['/fx', '/fusion', '/uoaui', '/winking-star', '/deal-model']) {
    await page.goto(route);
    const consent=page.getByRole('button', { name: 'No thanks' });
    if(await consent.isVisible()) await consent.click();
    const images = page.locator('.authored-image-link img, .persona-art img, .fx-persona-portrait img');
    expect(await images.count()).toBeGreaterThan(0);
    await images.evaluateAll(async elements => {
      await Promise.all(elements.map(async el => { const image=el as HTMLImageElement; image.loading='eager'; await image.decode(); }));
    });
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const clipped = await page.locator('.persona-copy, .authored-persona-needs, .authored-decision-reason, .experience-steps>li').evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth+1).map(el => el.textContent?.slice(0,80)));
      expect(clipped).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if (width===390 || width===1440) {
        const persona=page.locator('.authored-persona, .fx-persona').first();
        await persona.evaluate(el=>el.scrollIntoView({block:"start"}));
        await testInfo.attach(`${route.slice(1)}-persona-${width}`, { body:await page.screenshot({path:`/private/tmp/portfolio-review/${route.slice(1)}-persona-${width}.png`}),contentType:'image/png' });
      }
    }
  }
});


test('animated chapter jumps clear the sticky header', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/deal-model');
  await page.getByRole('button',{name:'No thanks'}).click();
  await page.locator('.section-open').click();
  await page.getByRole('navigation',{name:'Case study sections'}).getByRole('link',{name:'Decision map',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Decision map',exact:true})).toBeInViewport();
  await page.locator('#deal-decisions').evaluate(async el=>{await Promise.all(el.getAnimations().map(a=>a.finished.catch(()=>{})));});
  const heading=(await page.getByRole('heading',{name:'Decision map',exact:true}).boundingBox())!;
  const nav=(await page.locator('.nav').boundingBox())!;
  expect(heading.y).toBeGreaterThanOrEqual(nav.y+nav.height);
  await expect(page.locator('.deal-flow-vector')).toBeVisible();
});
