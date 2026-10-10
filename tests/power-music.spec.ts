import { test, expect, type Page } from '@playwright/test';
const state=(page:Page)=>page.evaluate(()=>(window as unknown as {__game:()=>any}).__game());
async function start(page:Page){await page.goto('/panel?level=3');await page.getByRole('button',{name:'Start adventure'}).click();await page.waitForFunction(()=>(window as unknown as {__game?:()=>any}).__game?.()?.grounded);}
test('a power star must be collected, protects against an enemy, then expires',async({page})=>{
 await start(page);expect((await state(page)).powerSeconds).toBe(0);expect((await state(page)).powerItems).toHaveLength(1);
 await page.keyboard.down('ArrowRight');await expect.poll(async()=>(await state(page)).powerStars,{intervals:[30],timeout:4000}).toBe(1);await page.keyboard.up('ArrowRight');
 expect((await state(page)).powerSeconds).toBeGreaterThan(6);expect((await state(page)).powerItems).toHaveLength(0);
 await page.keyboard.down('ArrowRight');
 await expect.poll(async()=>(await state(page)).stomped,{timeout:7500}).toBeGreaterThan(0);await page.keyboard.up('ArrowRight');expect((await state(page)).hits).toBe(0);
 await expect.poll(async()=>(await state(page)).powerSeconds,{timeout:9500}).toBe(0);expect((await state(page)).audio.power).toBe(false);
});
test('background music follows the sound toggle and stops on leaving both level and map',async({page})=>{
 await start(page);expect((await state(page)).audio.playing).toBe(false);
 await page.getByRole('button',{name:'Sound'}).click();await expect.poll(async()=>(await state(page)).audio.playing).toBe(true);
 await page.getByRole('button',{name:'Exit full screen'}).click();expect((await state(page)).audio.playing).toBe(false);
 await page.locator('#game-world').click();await expect.poll(async()=>(await state(page)).mode).toBe('map');expect((await state(page)).audio.playing).toBe(true);
 await page.getByRole('button',{name:'Exit full screen'}).click();expect((await state(page)).audio.playing).toBe(false);
 await page.locator('#game-world').click();await page.getByRole('button',{name:'Sound'}).click();await expect.poll(async()=>(await state(page)).audio.playing).toBe(false);
});

test('each stage has a different soundtrack and the map has its own theme',async({page})=>{
 await start(page);await page.getByRole('button',{name:'Sound',exact:true}).click();
 const tunes=new Set<string>();
 for(let stage=0;stage<8;stage++){
  await page.locator('#game-world').click();
  await page.locator(`.game-stages [data-stage="${stage}"]`).click();
  await expect.poll(async()=>(await state(page)).audio.stage).toBe(stage);
  expect((await state(page)).audio.playing).toBe(true);tunes.add((await state(page)).audio.track);
 }
 expect(tunes.size).toBe(8);await page.locator('#game-world').click();
 await expect.poll(async()=>(await state(page)).audio.stage).toBe(null);
 expect(tunes.has((await state(page)).audio.track)).toBe(false);
});

test('falling plays the death cue and muting clears all voices',async({page})=>{
 await page.goto('/panel?level=1');await page.getByRole('button',{name:'Start adventure'}).click();
 await page.waitForFunction(()=>(window as any).__game?.()?.grounded);
 await page.getByRole('button',{name:'Sound',exact:true}).click();
 await expect(page.locator('#game')).toBeFocused();await expect.poll(async()=>(await state(page)).audio.enabled).toBe(true);
 await page.keyboard.down('ArrowRight');
 await expect.poll(async()=>(await state(page)).audio.deaths,{timeout:12000,intervals:[30]}).toBeGreaterThan(0);
 await page.keyboard.up('ArrowRight');
 expect((await state(page)).audio.effects).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Sound',exact:true}).click();
 await expect.poll(async()=>(await state(page)).audio.effects).toBe(0);await expect.poll(async()=>(await state(page)).audio.voices).toBe(0);
});

test('timeline contains family and world milestones and pauses play until closed',async({page})=>{
 await start(page);await page.getByRole('button',{name:'Sound',exact:true}).click();
 await page.getByRole('button',{name:'Timeline',exact:true}).click();
 const journal=page.getByRole('dialog',{name:'Life along the way'});
 await expect(journal).toBeVisible();expect((await state(page)).paused).toBe(true);expect((await state(page)).audio.playing).toBe(false);
 await expect(journal.locator('[data-kind="Life"]').filter({hasText:'I had a baby'})).toHaveCount(2);
 await expect(journal.locator('[data-kind="Life"]').filter({hasText:'I had a baby'})).toContainText(['2011','2018']);
 await expect(journal.getByRole('heading',{name:'COVID-19',exact:true})).toBeVisible();
 await expect(journal).toContainText('art, craft and digital media');await expect(journal).toContainText('game and UX design');
 await page.keyboard.press('Escape');await expect(journal).not.toBeVisible();
 await expect.poll(async()=>(await state(page)).paused).toBe(false);await expect.poll(async()=>(await state(page)).audio.playing).toBe(true);
 await expect(page.locator('.play')).toHaveClass(/is-full/);
});
