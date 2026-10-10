import type { ThemeId } from './art';

// Detailed plates are original Higgsfield artwork. Load only after Play and
// only for a visited stage. The procedural scene remains a network fallback.
const plates = new Map<ThemeId, HTMLImageElement>();
export function scenery(id: ThemeId) {
  let image = plates.get(id);
  if (!image) {
    image = new Image();
    image.decoding = 'async';
    image.src = `/game/scene-${id}.webp`;
    plates.set(id, image);
  }
  return image.complete && image.naturalWidth ? image : null;
}

// A quiet, clearly bounded collision surface, in the same daylight palette
// as the cover. Pixel details are drawn at world resolution, not enlarged.
export function ground(ctx: CanvasRenderingContext2D, x: number, y: number, top: boolean, id: ThemeId) {
  const wood = id === 'ai' || id === 'bedtime';
  ctx.fillStyle = wood ? '#cfb99f' : '#c5c8bd';
  ctx.fillRect(x, y, 32, 32);
  ctx.fillStyle = wood ? '#b5a085' : '#a3aea9';
  ctx.fillRect(x, y + 15, 32, 1);
  ctx.fillRect(x + 15, y, 1, 15);
  ctx.fillRect(x + 5, y + 16, 1, 16);
  ctx.fillStyle = wood ? '#dfcfb7' : '#e0e1d5';
  ctx.fillRect(x + 1, y + 1, 30, 1);
  ctx.fillRect(x + 1, y + 17, 30, 1);
  if (top) {
    ctx.fillStyle = '#5e716b'; ctx.fillRect(x, y, 32, 2);
    ctx.fillStyle = '#f2e8d5'; ctx.fillRect(x, y + 2, 32, 4);
    ctx.fillStyle = '#b5bba9'; ctx.fillRect(x, y + 6, 32, 2);
  }
}
