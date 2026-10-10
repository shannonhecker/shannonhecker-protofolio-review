import {test,expect} from '@playwright/test';
for(const route of ['/fx','/fusion','/winking-star','/uoaui']){
 test(`${route} heading stays inside the viewport with motion enabled`,async({page})=>{
  await page.goto(route);
  await page.locator('h1').evaluate(async el=>{await Promise.all(el.getAnimations().map(a=>a.finished.catch(()=>{})));});
  for(const width of [320,390,768,1024,1280,1440,1920]){
   await page.setViewportSize({width,height:900});
   const bounds=await page.locator('h1').boundingBox();
   expect(bounds!.x).toBeGreaterThanOrEqual(0);
   expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
 });
}
