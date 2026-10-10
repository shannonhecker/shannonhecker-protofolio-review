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

test('avatar follows the pointer gently without movement buttons or keyboard capture',async({page})=>{
  await page.goto('/panel');
  const avatar=page.locator('[data-avatar]');
  const stage=page.locator('.companion-stage');
  await expect(page.locator('[data-move]')).toHaveCount(0);
  const bounds=(await stage.boundingBox())!;
  await page.mouse.move(bounds.x+bounds.width-10,bounds.y+bounds.height/2);
  await expect.poll(async()=>parseFloat(await avatar.evaluate(el=>el.style.getPropertyValue('--avatar-x')))).toBeGreaterThan(2);
  const position=(await avatar.boundingBox())!;
  expect(position.x+position.width).toBeLessThanOrEqual(bounds.x+bounds.width);
  await page.getByRole('button',{name:'Pause motion',exact:true}).click();
  await page.keyboard.press('ArrowDown');
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0);
  expect(await avatar.evaluate(el=>el.style.getPropertyValue('--avatar-x'))).toBe('0.00px');
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await page.locator('.avatar-rig').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});

test('project icons, numbers and reading links share one centre line',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/panel');
  for(const row of await page.locator('#work .row').all()){
    const number=(await row.locator('.n').boundingBox())!;
    const icon=(await row.locator('.n .pixel-object').boundingBox())!;
    const read=(await row.locator('.arrow').boundingBox())!;
    expect(Math.abs(number.y+number.height/2-read.y-read.height/2)).toBeLessThan(1);
    expect(Math.abs(icon.y+icon.height/2-read.y-read.height/2)).toBeLessThan(1);
  }
});

test('optional game follows the introduction on both landing URLs',async({page})=>{
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});
    for(const route of ['/','/panel']){
      await page.goto(route);
      const story=await page.locator('.hero-story').boundingBox();
      const avatar=await page.locator('.landing-companion').boundingBox();
      const game=await page.locator('.hero-bonus').boundingBox();
      expect(game!.y).toBeGreaterThan(story!.y+story!.height);
      expect(game!.y).toBeGreaterThan(avatar!.y+avatar!.height);
    }
  }
});
