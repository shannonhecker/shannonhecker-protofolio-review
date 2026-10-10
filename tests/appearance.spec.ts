import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function chooseTheme(page:Page,label:string){
  const toggle=page.getByRole('switch',{name:'Dark mode'});
  if(await toggle.getAttribute('aria-checked')!==String(label==='Dark'))await toggle.click();
}

for (const width of [390, 1440]) {
  for (const route of ['/panel','/fusion','/uoaui','/winking-star']) {
    test(`dark theme remains readable at ${width}px on ${route}`, async ({page}) => {
      await page.setViewportSize({width,height:900});
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.goto(route);
      await chooseTheme(page,'Dark');
      const {violations}=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(violations.map(v=>`${v.id}: ${v.nodes.map(n=>n.target.join(' ')).slice(0,4).join(' | ')}`)).toEqual([]);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      const logo=await page.locator('.nav .brand').boundingBox();
      const contact=await page.locator('.nav .cta').boundingBox();
      expect(Math.abs((logo!.y+logo!.height/2)-(contact!.y+contact!.height/2))).toBeLessThan(2);
    });
  }
}

test('light and dark preferences persist across projects',async({page})=>{
  await page.goto('/fx');
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await chooseTheme(page,'Light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.goto('/fusion');
  await expect(page.getByRole('switch',{name:'Dark mode'})).toHaveAttribute('aria-checked','false');
  await chooseTheme(page,'Dark');
  await page.goto('/panel');
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await chooseTheme(page,'Light');
  await page.goto('/fx');
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

for(const width of [390,1440]){
  test(`theme switch is immediate, keyboard accessible and has no menu at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto('/fx');
    const toggle=page.getByRole('switch',{name:'Dark mode'});
    await expect(toggle).toHaveAttribute('aria-checked','true');
    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(page.locator('html')).toHaveAttribute('data-theme','light');
    await expect(toggle).toHaveAttribute('aria-checked','false');
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-checked','true');
    await expect(page.locator('.theme-picker select, .theme-picker [role="menu"]')).toHaveCount(0);
    const bounds=(await toggle.boundingBox())!;
    expect(bounds.height).toBeGreaterThanOrEqual(44);
    expect(bounds.x+bounds.width).toBeLessThanOrEqual(width);
    const {violations}=await new AxeBuilder({page}).include('.theme-picker').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(violations).toEqual([]);
    await page.keyboard.press('Tab');
    await expect(page.locator('.nav .cta')).toBeFocused();
  });
}

test('game preview spans the content as a shallow banner and opens at its original ratio',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/panel');
  const banner=page.locator('.hero-bonus');
  const game=page.locator('.play .game');
  const outer=(await banner.boundingBox())!;
  const preview=(await game.boundingBox())!;
  expect(Math.abs(preview.width-outer.width)).toBeLessThan(2);
  expect(preview.width/preview.height).toBeCloseTo(4,1);
  await page.locator('#game-play').click();
  await expect(page.locator('.play')).toHaveClass(/is-full/);
  await expect.poll(async()=>{const expanded=(await game.boundingBox())!;return expanded.width/expanded.height;}).toBeCloseTo(16/9,1);
  await page.locator('#game-exit').click();
  await expect(page.locator('.play')).not.toHaveClass(/is-full/);
});
