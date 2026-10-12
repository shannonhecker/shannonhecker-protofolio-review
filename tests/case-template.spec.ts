import { test, expect } from '@playwright/test';

test('case content keeps one column and screenshots stay within it', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const route of ['/fx','/fusion','/winking-star','/deal-model','/uoaui']) {
    await page.goto(route);
    for (const width of [390,1440,2560]) {
      await page.setViewportSize({width,height:1000});
      const layout=await page.locator('.beat .body').evaluateAll(bodies=>bodies.map(body=>{
        const rect=body.getBoundingClientRect();
        return {width:rect.width, children:[...body.children].filter(child=>child.getClientRects().length>0).map(child=>{
          const r=child.getBoundingClientRect();return {left:r.left-rect.left,right:r.right-rect.right};
        })};
      }));
      for(const body of layout) {
        expect(body.width).toBeLessThanOrEqual(1041);
        for(const child of body.children){expect(child.left).toBeGreaterThanOrEqual(-1);expect(child.right).toBeLessThanOrEqual(1);}
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await expect(page.getByText('View full size',{exact:true})).toHaveCount(0);
    await expect(page.getByText('Open live product',{exact:true})).toHaveCount(0);
  }
  await page.goto('/fx');
  await page.setViewportSize({width:1440,height:1000});
  const alignment=await page.locator('#fx-problem').evaluate(el=>({
    row:el.querySelector('.rows p')!.getBoundingClientRect().left,
    status:el.querySelector('.project-status p')!.getBoundingClientRect().left,
    rowWidth:el.querySelector('.rows')!.getBoundingClientRect().width,
    statusWidth:el.querySelector('.project-status')!.getBoundingClientRect().width,
  }));
  expect(Math.abs(alignment.row-alignment.status)).toBeLessThan(1);
  expect(Math.abs(alignment.rowWidth-alignment.statusWidth)).toBeLessThan(1);
});
