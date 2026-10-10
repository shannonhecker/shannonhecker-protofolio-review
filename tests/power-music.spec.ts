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
