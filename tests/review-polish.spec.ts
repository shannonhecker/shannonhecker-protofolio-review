import {test,expect} from '@playwright/test';

test('game title does not obscure the world label or start prompt',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,760,820,1280,1440,1920]){
  await page.setViewportSize({width,height:900});await page.goto('/panel');await page.evaluate(()=>document.fonts.ready);
  const hud=(await page.locator('.title-hud').boundingBox())!,plaque=(await page.locator('.title-plaque').boundingBox())!,prompt=(await page.locator('.game-title-start>span').boundingBox())!;
  expect(hud.y+hud.height,`${width}px HUD`).toBeLessThanOrEqual(plaque.y);
  expect(plaque.y+plaque.height,`${width}px start prompt`).toBeLessThanOrEqual(prompt.y);
 }
});

test('home artwork covers its frame and follows the hero alignment',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [390,1280,1512]){
  await page.setViewportSize({width,height:900});await page.goto('/panel');await page.evaluate(()=>document.fonts.ready);
  const geometry=await page.locator('#work .home-artwork').evaluateAll(tiles=>tiles.map(tile=>{
   const image=Array.from(tile.querySelectorAll('img')).find(img=>img.getBoundingClientRect().width>0)!;
   const a=tile.getBoundingClientRect(),b=image.getBoundingClientRect();return {top:b.top-a.top,left:b.left-a.left,right:b.right-a.right,bottom:b.bottom-a.bottom};
  }));
  const alignment=await page.evaluate(()=>{
   const hero=document.querySelector('.hero-story')!.getBoundingClientRect();
   const heading=document.querySelector('#work .work-title')!.getBoundingClientRect();
   return Math.abs(hero.left-heading.left);
  });
  expect(alignment,`${width}px shared content alignment`).toBeLessThan(1);
  for(const edges of geometry){expect(edges.top).toBeLessThanOrEqual(.1);expect(edges.left).toBeLessThanOrEqual(.1);expect(edges.right).toBeGreaterThanOrEqual(-.1);expect(edges.bottom).toBeGreaterThanOrEqual(-.1);}
 }
});

test('FX detail panels retain Retina sources inside the overlapping hero',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [390,1440,1920]){
  await page.setViewportSize({width,height:1000});await page.goto('/fx');
  const overview=(await page.locator('.fx-hero-overview').boundingBox())!;
  const composition=(await page.locator('.fx-hero-composition').boundingBox())!;
  const comparison=(await page.locator('.fx-hero-compare').boundingBox())!;
  expect(comparison.y).toBeLessThan(overview.y+overview.height);
  for(const selector of ['.fx-hero-ticket','.fx-hero-compare']){
   const panel=page.locator(selector);const rect=(await panel.boundingBox())!;
   expect(rect.x).toBeGreaterThanOrEqual(composition.x);
   expect(rect.x+rect.width).toBeLessThanOrEqual(composition.x+composition.width+1);
   expect(rect.y+rect.height).toBeLessThanOrEqual(composition.y+composition.height+1);
   const largest=await panel.locator('source').first().evaluate(el=>Math.max(...(el.getAttribute('srcset')||'').split(',').map(item=>Number(item.trim().split(' ').at(-1)?.replace('w','')))));
   expect(largest).toBeGreaterThanOrEqual(rect.width*2);
  }
 }
});
