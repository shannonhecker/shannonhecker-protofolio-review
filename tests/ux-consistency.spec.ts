import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes=['/','/panel','/fx','/fusion','/winking-star','/deal-model','/uoaui','/privacy','/build','/404'];
test('every page shares usable navigation, theme controls and an overflow-free shell',async({page})=>{
 test.setTimeout(90000);
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,820,1440]){
  await page.setViewportSize({width,height:1000});
  for(const route of routes){
   await page.goto(route);
   await expect(page.locator('h1')).toHaveCount(1);
   await expect(page.locator('#main')).toHaveCount(1);
   for(const theme of ['light','dark']){
    await page.getByRole('switch',{name:'Dark mode'}).setChecked(theme==='dark');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
   }
   if(width<=1100){
    await page.getByRole('button',{name:'Menu',exact:true}).click();
    await expect(page.locator('.nav ul')).toBeVisible();
    for(const link of await page.locator('.nav ul a').all())await expect(link).toBeInViewport();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Menu',exact:true})).toBeFocused();
   }else await expect(page.getByRole('button',{name:'Menu',exact:true})).toBeHidden();
  }
 }
});

test('section navigation follows each case’s actual reading order',async({page})=>{
 for(const route of ['/fx','/fusion','/winking-star','/deal-model','/uoaui']){
  await page.goto(route);
  expect(await page.locator('.chapter-stops a').evaluateAll(links=>{
   const targets=links.map(a=>document.getElementById((a as HTMLAnchorElement).hash.slice(1)));
   return targets.every((target,i)=>target&&(!i||!!(targets[i-1]!.compareDocumentPosition(target)&Node.DOCUMENT_POSITION_FOLLOWING)));
  })).toBe(true);
 }
});

test('supporting pages remain accessible in both themes',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const route of ['/privacy','/build','/404']){
  await page.goto(route);
  for(const theme of ['light','dark']){
   await page.getByRole('switch',{name:'Dark mode'}).setChecked(theme==='dark');
   expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  }
 }
});

test('mobile navigation works without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto('http://localhost:4329/privacy');
 await expect(page.locator('.nav ul')).toBeVisible();
 await expect(page.getByRole('button',{name:'Menu',exact:true})).toBeHidden();
 await page.locator('.nav').getByRole('link',{name:'Winking Star',exact:true}).click();
 await expect(page).toHaveURL(/winking-star/);await context.close();
});

test('current project and analytics notice follow both themes',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/fx');
 const active=page.locator('.nav a[aria-current="page"]');
 for(const theme of ['light','dark']){
  await page.getByRole('switch',{name:'Dark mode'}).setChecked(theme==='dark');
  await expect(active).toHaveText('FX');
  expect(await active.evaluate(e=>getComputedStyle(e).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  const notice=page.locator('#analytics-choice');await expect(notice).toBeVisible();
  expect(await notice.evaluate(e=>getComputedStyle(e).backgroundColor)).toBe(theme==='dark'?'rgb(23, 27, 34)':'rgb(255, 255, 255)');
  expect((await new AxeBuilder({page}).include('#analytics-choice').withTags(['wcag2aa']).analyze()).violations).toEqual([]);
 }
});

test('mobile menu links navigate and dismiss the disclosure',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const [label,path] of [['FX','/fx'],['Fusion','/fusion'],['Winking Star','/winking-star'],['Deal Model','/deal-model'],['uoaui.ai','/uoaui']]){
  await page.goto('/privacy');await page.getByRole('button',{name:'Menu',exact:true}).click();
  await page.locator('.nav').getByRole('link',{name:label,exact:true}).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.getByRole('button',{name:'Menu',exact:true})).toHaveAttribute('aria-expanded','false');
 }
});
