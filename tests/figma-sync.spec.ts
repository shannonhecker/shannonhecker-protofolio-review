import { test, expect } from '@playwright/test';

test('all fifteen personas share portrait framing and one card surface',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const [route,count] of [['/fx',3],['/fusion',3],['/uoaui',2],['/winking-star',3],['/deal-model',4]] as const){
    await page.goto(route);
    await expect(page.locator('.persona-card')).toHaveCount(count);
    await expect(page.locator('.persona-card .persona-art img')).toHaveCount(count);
    for(const width of [390,1440]){
      await page.setViewportSize({width,height:900});
      const frames=await page.locator('.persona-art').evaluateAll(nodes=>nodes.map(n=>({w:n.clientWidth,h:n.clientHeight})));
      for(const f of frames){expect(f.w).toBeGreaterThanOrEqual(100);expect(f.w).toBeLessThanOrEqual(240);expect(Math.abs(f.h/f.w-4/3)).toBeLessThan(.02);}
      await expect(page.locator('.persona-card').first()).toHaveCSS('background-color',route==='/uoaui'?'rgb(239, 240, 227)':route==='/winking-star'?'rgb(255, 248, 226)':'rgb(245, 228, 220)');
    }
  }
});

test('FX data layers preserve the four authored branches at every width',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/fx');
  await page.getByRole('button',{name:'No thanks'}).click();
  const diagram=page.locator('.fx-source-layers img');
  await expect(diagram).toBeVisible();
  await expect(diagram).toHaveAttribute('src','/art/fx-data-layers.svg');
  await expect(page.locator('.fx-source-layers details')).toHaveCount(0);
  for(const width of [320,390,820,1440]){
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(diagram).toBeVisible();
  }
});

test('FX comparisons use the authored charts and stay readable on phones', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/fx');
  const charts=page.locator('#fx-decision-map .authored-image-link img');
  await expect(charts).toHaveCount(6);
  for (const width of [390,1440,1920]) {
    await page.setViewportSize({width,height:900});
    await charts.evaluateAll(async images=>{await Promise.all(images.map(async el=>{const im=el as HTMLImageElement;im.loading='eager';await im.decode();}));});
    await expect.poll(()=>charts.evaluateAll(images=>images.every(el=>el.getBoundingClientRect().width>=300&&(el as HTMLImageElement).naturalWidth>0))).toBe(true);
    const sizes=await charts.evaluateAll(images=>images.map(el=>({width:el.getBoundingClientRect().width})));
    if(width>=1440){
      expect(sizes.every(s=>s.width<width*.36)).toBe(true);
      const chart=(await page.locator('#fx-decision-map .authored-choice-pair .authored-image-link').first().boundingBox())!;
      const explanation=(await page.locator('#fx-decision-map .authored-decision-reason').first().boundingBox())!;
      expect(Math.abs(chart.x-explanation.x)).toBeLessThan(1);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await expect(page.locator('#fx-decision-map .authored-decision-list>li')).toHaveCount(3);
  await expect(page.locator('#fx-decisions .dec')).toHaveCount(0);
  await page.goto('/winking-star');
  await expect(page.locator('.authored-choice-pair .authored-image-link').first()).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  await expect(page.locator('.authored-choice-pair .authored-image-link').first()).toHaveCSS('padding','0px');
});

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
        await testInfo.attach(`${route.slice(1)}-persona-${width}`, { body:await page.screenshot({path:testInfo.outputPath(`${route.slice(1)}-persona-${width}.png`)}),contentType:'image/png' });
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
