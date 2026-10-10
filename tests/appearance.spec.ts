import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [390, 1440]) {
  for (const route of ['/panel','/fusion','/uoaui','/winking-star']) {
    test(`dark theme remains readable at ${width}px on ${route}`, async ({page}) => {
      await page.setViewportSize({width,height:900});
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.goto(route);
      await page.getByRole('combobox',{name:'Colour theme'}).selectOption('dark');
      const {violations}=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(violations.map(v=>`${v.id}: ${v.nodes.map(n=>n.target.join(' ')).slice(0,4).join(' | ')}`)).toEqual([]);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      const logo=await page.locator('.nav .brand').boundingBox();
      const contact=await page.locator('.nav .cta').boundingBox();
      expect(Math.abs((logo!.y+logo!.height/2)-(contact!.y+contact!.height/2))).toBeLessThan(2);
    });
  }
}

test('theme preference persists across projects and system follows the device',async({page})=>{
  await page.goto('/fx');
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.getByRole('combobox',{name:'Colour theme'}).selectOption('light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.goto('/fusion');
  await expect(page.getByRole('combobox',{name:'Colour theme'})).toHaveValue('light');
  await page.getByRole('combobox',{name:'Colour theme'}).selectOption('system');
  await page.emulateMedia({colorScheme:'dark'});
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.emulateMedia({colorScheme:'light'});
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});

test('avatar controls are bounded and do not capture page arrow keys',async({page})=>{
  await page.goto('/panel');
  const avatar=page.locator('[data-avatar]');
  const stage=page.locator('.companion-stage');
  const before=await avatar.boundingBox();
  await page.getByRole('button',{name:'Move avatar right',exact:true}).click();
  await expect.poll(async()=> (await avatar.boundingBox())!.x).toBeGreaterThan(before!.x);
  for(let i=0;i<25;i++)await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(350);
  const position=await avatar.boundingBox(),bounds=await stage.boundingBox();
  expect(position!.x+position!.width).toBeLessThanOrEqual(bounds!.x+bounds!.width);
  await page.locator('h1').click();
  const x=await avatar.evaluate(el=>el.style.getPropertyValue('--avatar-x'));
  await page.keyboard.press('ArrowLeft');
  expect(await avatar.evaluate(el=>el.style.getPropertyValue('--avatar-x'))).toBe(x);
});
