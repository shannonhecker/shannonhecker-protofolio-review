// Hand-authored pixel art. Every sprite is either a character grid or a few
// lines of deliberate pixel placement; nothing is generated or traced.
// Style: Mario-era 16-bit platformer (chunky outlines, bright pickups, tiled
// ground) with every noun from Shannon's three cases. No pipes, no ? blocks,
// no mushrooms, no flagpole.
import { sprite, canvas, flip, tint, type Palette } from './pixel';

// ---------------------------------------------------------------- player
// DECISION: a neutral designer character until Shannon's reference photo
// (assets/shannon-ref.jpg) arrives. Only the hair, top and trouser colours
// below need changing to match her; frames stay the same.
const P: Palette = {
  k: '#161616', h: '#3a2a22', s: '#e9b892', e: '#161616',
  w: '#f4f1ea', a: '#f3a414', b: '#2b3654', m: '#161616', c: '#d98c78',
};
const HEAD_TORSO = [
  '....kkkkkk......',
  '...khhhhhhkk....',
  '..khhhhhhhhhk...',
  '..khhhhhhhhhk...',
  '..khhssssshhk...',
  '..khsseesseshk..',
  '..khsssssssshk..',
  '..khhsscssshk...',
  '...khssssssk....',
  '....kkssskk.....',
  '....kwwwwwwk....',
  '...kwwwwwawwk...',
  '..kswwwwwwwwsk..',
  '..kswwwwwwwwsk..',
  '...kwwwwwwwwk...',
  '...kbbbbbbbbk...',
  '...kbbbbbbbbk...',
];

type Pose = 'idle' | 'run' | 'jump' | 'fall' | 'hurt' | 'cheer';

function body(pose: Pose, f: number) {
  const rows = HEAD_TORSO.map((r) => r.padEnd(16, '.'));
  const { c, g, px } = canvas(16, 24);
  g.drawImage(sprite(rows, P), 0, f === 1 && pose === 'idle' ? 1 : 0); // idle breathes
  const leg = (x: number, lift: number, len = 5) => {
    px(x, 17, P.k, 4, 1);
    px(x, 17, P.k, 1, len); px(x + 3, 17, P.k, 1, len);
    px(x + 1, 17, P.b, 2, len);
    px(x - 1, 17 + len - lift, P.k, 5, 2); // shoe
  };
  if (pose === 'idle') { leg(4, 0); leg(8, 0); }
  else if (pose === 'run') {
    const ph = (f / 6) * Math.PI * 2;
    const d = Math.round(Math.sin(ph) * 2);
    leg(5 + d, Math.max(0, Math.round(Math.cos(ph) * 2)));
    leg(7 - d, Math.max(0, Math.round(-Math.cos(ph) * 2)));
    // arms swing opposite the legs
    px(2, 12 - Math.max(0, -d), P.s, 1, 2); px(13, 12 - Math.max(0, d), P.s, 1, 2);
  } else if (pose === 'jump') { leg(3, 2, 4); leg(9, 0, 5); }
  else if (pose === 'fall') { leg(3, 0, 5); leg(9, 0, 5); px(1, 9, P.s, 1, 3); px(14, 9, P.s, 1, 3); }
  else if (pose === 'hurt') { leg(4, 0); leg(8, 0); px(6, 5, P.k, 1, 1); px(9, 5, P.k, 1, 1); }
  else if (pose === 'cheer') {
    leg(4, f ? 1 : 0); leg(8, f ? 0 : 1);
    // both arms up, a little star in hand on the second frame (Winking Star nod)
    px(1, 7 - f, P.s, 2, 4); px(13, 7 - f, P.s, 2, 4);
    if (f) { px(1, 4, P.a, 1, 1); px(0, 5, P.a, 3, 1); px(1, 6, P.a, 1, 1); }
  }
  return c;
}

export function playerFrames() {
  const make = (pose: Pose, n: number) => Array.from({ length: n }, (_, f) => body(pose, f));
  const right = {
    idle: make('idle', 2), run: make('run', 6), jump: make('jump', 1),
    fall: make('fall', 1), hurt: make('hurt', 1), cheer: make('cheer', 2),
  };
  const left = Object.fromEntries(Object.entries(right).map(([k, v]) => [k, v.map(flip)])) as typeof right;
  return { right, left, flash: tint(right.idle[0], '#ffffff') };
}

// ---------------------------------------------------------------- themes
export type ThemeId = 'desk' | 'board' | 'bedtime';
export type Theme = {
  id: ThemeId;
  sky: string;
  ground: HTMLCanvasElement; // top-surface tile
  fill: HTMLCanvasElement; // tile below the surface
  platform: HTMLCanvasElement; // one-way platform tile
  pickup: HTMLCanvasElement[]; // 2-frame bob
  hazard: HTMLCanvasElement; // the level's own hazard
  finish: HTMLCanvasElement;
  check: HTMLCanvasElement;
  spike: HTMLCanvasElement;
  far: HTMLCanvasElement; // parallax layer, 480 wide
  near: HTMLCanvasElement; // parallax layer, 480 wide
  ink: string;
  hud: string;
};

function tile(draw: (px: ReturnType<typeof canvas>['px']) => void) { const t = canvas(16, 16); draw(t.px); return t.c; }

// L1 · The Desk (FX): a night trading floor.
function desk(): Theme {
  const sky = '#0e1530';
  const ground = tile((px) => { px(0, 0, '#4a90d9', 16, 2); px(0, 2, '#23305a', 16, 14); for (let x = 1; x < 16; x += 4) px(x, 6, '#2e3c6e', 2, 1); });
  const fill = tile((px) => { px(0, 0, '#1b2547', 16, 16); px(0, 7, '#23305a', 16, 1); px(7, 0, '#23305a', 1, 7); px(3, 8, '#23305a', 1, 8); });
  // Platforms are candlestick bars: alternating green and red bodies with wicks.
  const platform = tile((px) => { px(0, 2, '#161616', 16, 6); px(1, 3, '#2fbf71', 6, 4); px(9, 3, '#e5484d', 6, 4); px(4, 0, '#9aa7c7', 1, 2); px(12, 0, '#9aa7c7', 1, 2); px(4, 8, '#9aa7c7', 1, 2); px(11, 8, '#9aa7c7', 1, 2); });
  // Pickup: a price dot, the marker a fill leaves on the FX chart.
  const dot = sprite([
    '....kk....',
    '...kbbk...',
    '..kbwwbk..',
    '.kbwwbbbk.',
    'kbbwbbbbbk',
    'kbbbbbbbbk',
    '.kbbbbbbk.',
    '..kbbbbk..',
    '...kbbk...',
    '....kk....',
  ], { k: '#0b1a33', b: '#4a90d9', w: '#cfe3fb' });
  const sheet = sprite([
    'kkkkkkkkkkkk',
    'kwwwwwwwwwwk',
    'kgggggggggwk',
    'kwkwwkwwkwwk',
    'kgggggggggwk',
    'kwkwwkwwkwwk',
    'kgggggggggwk',
    'kwkwwkwwkwwk',
    'kgggggggggwk',
    'kwkwwkwwkwwk',
    'kwwwwwwwwwwk',
    'kkkkkkkkkkkk',
  ], { k: '#161616', w: '#f4f1ea', g: '#2fbf71' });
  // Finish: a trading terminal with the order ticket filled.
  const finish = sprite([
    '..kkkkkkkkkkkk..',
    '..kddddddddddk..',
    '..kdgdddddrddk..',
    '..kdggddrrdddk..',
    '..kddgggrddddk..',
    '..kddddddddddk..',
    '..kkkkkkkkkkkk..',
    '.......kk.......',
    '.....kkkkkk.....',
    'kkkkkkkkkkkkkkkk',
    'kwwwwwwwwwwwwwwk',
    'kwkkkwkkkwakkkwk',
    'kwwwwwwwwwwwwwwk',
    'kkkkkkkkkkkkkkkk',
  ], { k: '#161616', d: '#0b1a33', g: '#2fbf71', r: '#e5484d', w: '#c9d2e6', a: '#f3a414' });
  const far = canvas(480, 270);
  // flat skyline, lit windows in the house orange
  for (let x = 0, i = 0; x < 480; i++) {
    const w = 18 + ((i * 37) % 26), h = 60 + ((i * 53) % 110);
    far.px(x, 270 - h, '#16204a', w, h);
    for (let wy = 270 - h + 6; wy < 262; wy += 8) for (let wx = x + 3; wx < x + w - 3; wx += 5) if ((wx * 7 + wy * 13 + i) % 9 === 0) far.px(wx, wy, '#f3a414', 2, 2);
    x += w + 2;
  }
  const near = canvas(480, 270);
  // a ticker line along the floor of the trading room
  for (let x = 0; x < 480; x += 2) near.px(x, 214 + Math.round(Math.sin(x / 23) * 6 + Math.sin(x / 7) * 2), '#2e3c6e', 2, 1);
  return { id: 'desk', sky, ground, fill, platform, pickup: [dot, dot], hazard: sheet, finish, check: post('#4a90d9'), spike: spike('#9aa7c7', '#161616'), far: far.c, near: near.c, ink: '#f4f1ea', hud: '#cfe3fb' };
}

// L2 · The Board Room (Fusion): white and grey, the site's own type.
function board(): Theme {
  const sky = '#f5f5f4';
  const ground = tile((px) => { px(0, 0, '#161616', 16, 2); px(0, 2, '#e6e6e4', 16, 14); px(0, 9, '#d4d4d1', 16, 1); });
  const fill = tile((px) => { px(0, 0, '#e6e6e4', 16, 16); px(0, 9, '#d4d4d1', 16, 1); px(8, 0, '#d4d4d1', 1, 9); });
  // Platforms are data-table rows: white cells, hairline grid, one value bar.
  const platform = tile((px) => { px(0, 0, '#161616', 16, 1); px(0, 1, '#ffffff', 16, 7); px(0, 8, '#c8c8c6', 16, 1); px(5, 1, '#e6e6e4', 1, 7); px(10, 1, '#e6e6e4', 1, 7); px(1, 3, '#4a90d9', 3, 3); px(11, 4, '#6b6b6b', 4, 1); });
  const check = () => sprite(['..........kk', '.........kgk', '........kggk', 'kk.....kggk.', 'kgk...kggk..', 'kggk.kggk...', '.kggkggk....', '..kgggk.....', '...kkk......'].map((r) => r), { k: '#0f3d24', g: '#2fbf71' });
  // Hazard: a "fixed template" block. A rigid page layout that slides at you.
  const template = sprite([
    'kkkkkkkkkkkkkkkk',
    'kggggggggggggggk',
    'kgkkkkkkkkkkkkgk',
    'kgkwwwwwwwwwwkgk',
    'kgkkkkkkkkkkkkgk',
    'kgkwwwwkkwwwwkgk',
    'kgkwwwwkkwwwwkgk',
    'kgkwwwwkkwwwwkgk',
    'kgkkkkkkkkkkkkgk',
    'kgkwwwwwwwwwwkgk',
    'kgkwwwwwwwwwwkgk',
    'kgkkkkkkkkkkkkgk',
    'kggggggggggggggk',
    'kgggkgggkggkgggk',
    'kggggggggggggggk',
    'kkkkkkkkkkkkkkkk',
  ], { k: '#161616', g: '#9a9a96', w: '#e6e6e4' });
  // Finish: a board-ready report on a stand.
  const finish = sprite([
    'kkkkkkkkkkkkkkkk',
    'kwwwwwwwwwwwwwwk',
    'kwkkkkkkwwwwwwwk',
    'kwwwwwwwwwwwbwwk',
    'kwwwwwwwwwbwbwwk',
    'kwwwwwwwbwbwbwwk',
    'kwwwwwbwbwbwbwwk',
    'kwwwbwbwbwbwbwwk',
    'kwwwwwwwwwwwwwwk',
    'kkkkkkkkkkkkkkkk',
    '.......kk.......',
    '.......kk.......',
    '.......kk.......',
    '....kkkkkkkk....',
  ], { k: '#161616', w: '#ffffff', b: '#4a90d9' });
  const far = canvas(480, 270);
  // big pale type in the background, the way the site sets its headings
  far.g.fillStyle = '#e9e9e7';
  far.g.font = '800 64px "Inter Tight", Inter, system-ui, sans-serif';
  far.g.fillText('Performance', 6, 110);
  far.g.fillText('Risk', 300, 196);
  const near = canvas(480, 270);
  for (let x = 0; x < 480; x += 60) near.px(x, 120, '#e6e6e4', 1, 150);
  return { id: 'board', sky, ground, fill, platform, pickup: [check(), check()], hazard: template, finish, check: post('#2fbf71'), spike: spike('#6b6b6b', '#161616'), far: far.c, near: near.c, ink: '#161616', hud: '#6b6b6b' };
}

// L3 · Bedtime (Winking Star): cream, botanical doodles, the app's palette.
function bedtime(): Theme {
  const sky = '#f7f5ef';
  const ground = tile((px) => { px(0, 0, '#12351f', 16, 2); px(0, 2, '#a9d5b2', 16, 3); px(0, 5, '#eef3dd', 16, 11); px(3, 9, '#ded6c8', 2, 1); px(10, 12, '#ded6c8', 2, 1); });
  const fill = tile((px) => { px(0, 0, '#eef3dd', 16, 16); px(5, 4, '#ded6c8', 2, 1); px(12, 11, '#ded6c8', 2, 1); });
  // Platforms are the app's activity cards: cream card, border, a ticked star spot.
  const platform = tile((px) => { px(0, 0, '#ded6c8', 16, 9); px(1, 1, '#fffdf8', 14, 7); px(2, 3, '#f3a414', 3, 3); px(7, 3, '#12351f', 6, 1); px(7, 5, '#a9d5b2', 4, 1); });
  const star = sprite(['....k....', '...kak...', 'kkkkaakkk', 'kaaaaaaak', '.kaaaaak.', '..kaaak..', '.kaakaak.', '.kak.kak.', '.kk...kk.'], { k: '#7a4a00', a: '#f3a414' });
  // Hazard: the nag loop. A grey cloud of "!" that circles a spot.
  const nag = sprite([
    '.....kkkk.........',
    '...kkggggkk.kkkk..',
    '..kggggggggkggggk.',
    '.kggggrgggrggggggk',
    'kgggggrgggrgggggk.',
    'kgggggrgggrggggggk',
    'kgggggrgggrggggggk',
    '.kggggggggggggggk.',
    '.kggggrgggrgggggk.',
    '..kkggggggggggkk..',
    '....kkkkkkkkkk....',
  ], { k: '#4a4a48', g: '#d6d6d2', r: '#e5484d' });
  // Finish: the egg that hatches into this week's pet.
  const finish = sprite([
    '......kkkk......',
    '....kkwwwwkk....',
    '...kwwwwwwwwk...',
    '..kwwwsswwwwwk..',
    '..kwwwwsswwwwk..',
    '.kwwwwwwwwwwwwk.',
    '.kwwswwwwwwswwk.',
    '.kwwwsswwwsswwk.',
    '.kwwwwwwwwwwwwk.',
    '..kwwwwwwwwwwk..',
    '...kkwwwwwwkk...',
    '.....kkkkkk.....',
  ], { k: '#12351f', w: '#fffdf8', s: '#a9d5b2' });
  const far = canvas(480, 270);
  // botanical doodles in the app's sage, peach and teal
  // soft hills, then big leaf sprigs on top
  for (let x = 0; x < 480; x++) {
    const h1 = 70 + Math.round(Math.sin(x / 38) * 18 + Math.sin(x / 17) * 6);
    far.px(x, 270 - h1, '#e4efd9', 1, h1);
    const h2 = 44 + Math.round(Math.sin(x / 26 + 2) * 12);
    far.px(x, 270 - h2, '#cfe6cf', 1, h2);
  }
  const leaf = (x: number, y: number, c: string) => {
    for (let i = 0; i < 34; i++) far.px(x + Math.round(Math.sin(i / 5) * 4), y + i, c, 2, 1);
    for (let k = 0; k < 4; k++) { const ly = y + 4 + k * 7, d = k % 2 ? 1 : -1; far.px(x + d * 3, ly, c, 6 * d > 0 ? 6 : 6, 3); far.px(x + d * 6 + (d < 0 ? -4 : 0), ly + 1, c, 5, 2); }
  };
  [[40, 158, '#7fbf8f'], [130, 150, '#f5b9a0'], [220, 166, '#7fbf8f'], [310, 152, '#9db8d6'], [400, 162, '#f5b9a0'], [455, 156, '#7fbf8f']].forEach(([x, y, c]) => leaf(x as number, y as number, c as string));
  const near = canvas(480, 270);
  [[60, 40], [180, 70], [260, 30], [360, 60], [440, 35]].forEach(([x, y]) => { near.px(x, y, '#f3a414', 1, 3); near.px(x - 1, y + 1, '#f3a414', 3, 1); });
  return { id: 'bedtime', sky, ground, fill, platform, pickup: [star, star], hazard: nag, finish, check: post('#f3a414'), spike: spike('#ded6c8', '#12351f'), far: far.c, near: near.c, ink: '#12351f', hud: '#12351f' };
}

// Checkpoint: a small marker post (not a flag).
function post(col: string) { return sprite(['.kkk.', 'kcckk', 'kcccK'.replace('K', 'k'), '.kkk.', '..k..', '..k..', '..k..', '..k..', '..k..', '.kkk.'], { k: '#161616', c: col }); }
function spike(fill: string, ink: string) {
  return sprite([
    '..k....k....k...',
    '..k....k....k...',
    '.kfk..kfk..kfk..',
    '.kfk..kfk..kfk..',
    'kfffkkfffkkfffk.',
    'kfffkkfffkkfffk.',
    'kkkkkkkkkkkkkkk.',
  ].map((r) => r.slice(0, 15) + 'k'), { k: ink, f: fill });
}

export const THEMES: Record<ThemeId, () => Theme> = { desk, board, bedtime };

/** The pet that hatches at the end of Bedtime. */
export const pet = () => sprite([
  '..k.......k.....',
  '.kak.....kak....',
  '.kaakkkkkaak....',
  'kaaaaaaaaaaak...',
  'kaakaaaaakaak...',
  'kaaaaapaaaaak...',
  '.kaaaaaaaaak....',
  '.kaaaaaaaaakk...',
  '.kaaaaaaaaakak..',
  '.kakkkkkkakkak..',
  '.kk......kk.k...',
], { k: '#12351f', a: '#f3a414', p: '#d98c78' });
