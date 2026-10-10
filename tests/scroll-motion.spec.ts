import {test,expect} from '@playwright/test';

test('word masks follow scroll in both directions and clear for reduced motion',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/fx');
 const heading=page.locator('#fx-problem .h-sub');
 const position=async(fraction:number)=>heading.evaluate((el,f)=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY-innerHeight*f),fraction);
 await position(.94);
 await expect(heading).toHaveAttribute('data-scroll-motion','true');
 const word=heading.locator('.wd').first();
 await page.waitForTimeout(900);
 const entrance=await word.evaluate(el=>getComputedStyle(el).clipPath);
 await position(.45);await page.waitForTimeout(900);
 const settled=await word.evaluate(el=>getComputedStyle(el).clipPath);
 expect(settled).toBe('inset(0%)');expect(entrance).not.toBe(settled);
 await position(.94);await page.waitForTimeout(900);
 expect(await word.evaluate(el=>getComputedStyle(el).clipPath)).not.toBe(settled);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect.poll(()=>word.evaluate(el=>getComputedStyle(el).clipPath)).toBe('none');
 expect(await word.evaluate(el=>getComputedStyle(el).transform)).toBe('none');
});

test('touch scroll settles every heading without horizontal overflow',async({browser})=>{
 const context=await browser.newContext({baseURL:'http://localhost:4329',viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage();await page.goto('/fx');
 const heading=page.locator('#fx-problem .h-sub');
 await heading.scrollIntoViewIfNeeded();
 await expect(heading).toHaveAttribute('data-scroll-motion','true');
 await heading.evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY-180));
 await page.waitForTimeout(500);
 expect(await heading.locator('.wd').first().evaluate(el=>getComputedStyle(el).clipPath)).toBe('inset(0%)');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await context.close();
});
