// The game chunk, loaded only when someone presses Play (see game-loader.ts).
// Hand-written canvas engine. The world is 960×540 with 32px tiles; it renders
// with a 960×540 backing canvas. Map and HUD retain their 480×270 logical grid.
// Shannon's career is the world map: one short level per stage, Kaohsiung to AI.
import { T, TILE, VIEW_W, VIEW_H } from './tuning';
import { parse } from './level';
import { LEVELS } from './levels';
import { THEMES, playerFrames, helmet, pet, scooter, type Theme } from './art';
import { FOES, type Foe } from './enemies';
import { text, textWidth } from './pixel';
import { mapBase, NODES, labelAt, BRAND, SCHOOL_ICONS, LOGO_ICONS, SELECT_RINGS } from './map';
import { CHAPTERS, chapterOf, stageCode } from '../lib/journey';
import { sfx } from './sound';
import { scenery, ground, prepareScenery } from './scenery';
import { illustrated, drawIllustration, prepareIllustrations } from './illustrated';
export { setSound } from './sound';
export async function prepareArt() {
  await Promise.all([prepareIllustrations(), prepareScenery(LEVELS.map((level) => level.theme))]);
}

/** What the map and HUD show for each world. Facts only: CV and Shannon's own words. */
export const WORLDS = [
  { short: 'KAOHSIUNG', when: 'GROWING UP' },
  { short: 'LING TUNG', when: '2008-2010' },
  { short: 'WEB DESIGN', when: '2010' },
  { short: 'LONDON MET', when: '2015-2016' },
  { short: 'J.P. MORGAN', when: '2016-2025' },
  { short: 'BARCLAYS', when: '2025-NOW' },
  { short: 'NEXT: AI', when: '2026-NOW' },
  { short: 'BEDTIME', when: 'BONUS' },
] as const;

// One optional mission per world, worth a gold star on the map. Finishing a
// world never depends on it. 'stomp' counts enemies cleared, 'all' every
// pickup, 'arrows' the tower's flow arrows, 'ride' reaching the end on the scooter.
type MissionKind = 'ride' | 'stomp' | 'all' | 'arrows';
export const MISSIONS: { text: string; kind: MissionKind; need: number }[] = [
  { text: 'Ride the scooter to the sea', kind: 'ride', need: 1 },
  { text: 'Beat 3 deadlines', kind: 'stomp', need: 3 },
  { text: 'Squash 4 bugs', kind: 'stomp', need: 4 },
  { text: 'Find every book', kind: 'all', need: 0 },
  { text: 'Collect every flow arrow', kind: 'arrows', need: 0 },
  { text: 'Catch 3 late changes', kind: 'stomp', need: 3 },
  { text: 'Verify 3 hallucinations', kind: 'stomp', need: 3 },
  { text: 'Put 3 screens to sleep', kind: 'stomp', need: 3 },
];

export type GameState = {
  elapsed: number;
  mode: 'map' | 'level';
  level: number; x: number; y: number; vx: number; vy: number; grounded: boolean; riding: boolean;
  hits: number; collected: number; total: number; finished: boolean; paused: boolean; jumps: number;
  done: number[];
  stomped: number; foes: number;
  mission: { text: string; have: number; need: number; done: boolean };
  missions: number[]; // worlds whose mission is complete
};
type Opts = {
  level?: number;
  startOnMap?: boolean;
  reduceMotion: boolean;
  onLevelEnd: (s: GameState) => void;
  onLevelStart?: (stage: number) => void;
  onStatus: (msg: string) => void;
  onMapSelect?: (n: number) => void;
};

const STEP = 1 / 120; // fixed physics step; render at display rate
const ART = 0.5; // sprite px per world px
const RENDER = 2; // preserve fine illustrated detail without changing physics
const HUD_W = VIEW_W * ART, HUD_H = VIEW_H * ART;
const snap = (v: number) => Math.round(v * ART) / ART;
const RIDE = 1.45; // scooter speed multiplier

export function start(canvas: HTMLCanvasElement, opts: Opts) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = HUD_W * RENDER;
  canvas.height = HUD_H * RENDER;
  ctx.imageSmoothingEnabled = false;
  const petSprite = pet();
  const bike = scooter();
  const assist = () => (window as unknown as { __gameAssist?: { invuln?: boolean } }).__gameAssist ?? {};

  // Player hitbox is narrower than the 32×48 sprite cell.
  const PW = 20, PH = 44;
  const p = { x: 0, y: 0, vx: 0, vy: 0, grounded: false, face: 1, heldFor: 0, coyote: 0, buffer: 0, jumpHeld: false, rising: false, invuln: 0, squash: 0, run: 0, hurtT: 0, ride: false };
  const s: GameState = { elapsed: 0, mode: 'map', level: 0, x: 0, y: 0, vx: 0, vy: 0, grounded: false, riding: false, hits: 0, collected: 0, total: 0, finished: false, paused: false, jumps: 0, done: [], stomped: 0, foes: 0, mission: { text: '', have: 0, need: 0, done: false }, missions: [] };

  // ---- per-level state
  let lvl = parse(LEVELS[0].rows);
  let theme: Theme = THEMES.kaohsiung();
  let hero = playerFrames(theme.id);
  let items: { x: number; y: number; kind: 'o' | 'u' | '^' | 'C' | 'F' | 'B'; taken?: boolean }[] = [];
  let checkpoint = { x: 0, y: 0 };
  let movers: { x: number; w: number; baseY: number; i: number; px: number; pw: number; y: number; prevY: number }[] = [];
  let hazards: { kind: 'S' | 'T' | 'N'; i: number; ox: number; oy: number; x: number; y: number; w: number; h: number; t: number }[] = [];
  let foe: Foe = FOES.kaohsiung();
  let foes: { x: number; y: number; ox: number; oy: number; vx: number; t: number; alive: boolean; deadT: number }[] = [];
  let arrows = 0, arrowsGot = 0;
  const lid = helmet();
  let revealed = new Set<string>(); // drafted platforms that have become real
  let riding: (typeof movers)[number] | null = null;
  let clock = 0, cam = 0, camY = 0, shake = 0, endT = 0;
  const parts: { x: number; y: number; vx: number; vy: number; life: number; c: string }[] = [];
  const rain: { x: number; y: number }[] = Array.from({ length: 70 }, (_, i) => ({ x: (i * 137) % 480, y: (i * 71) % 270 }));
  let mapSel = Math.max(0, Math.min(LEVELS.length - 1, opts.level ?? 0));

  let runSequence = 0;
  function loadLevel(n: number) {
    runSequence++;
    s.elapsed = 0; s.jumps = 0;
    opts.onLevelStart?.(n);
    s.mode = 'level';
    s.level = n;
    lvl = parse(LEVELS[n].rows);
    theme = THEMES[LEVELS[n].theme]();
    hero = playerFrames(theme.id);
    items = lvl.items.map((i) => ({ ...i }));
    s.total = items.filter((i) => i.kind === 'o' || i.kind === 'u').length;
    arrows = items.filter((i) => i.kind === 'u').length; arrowsGot = 0;
    s.collected = 0; s.hits = 0; s.finished = false; s.paused = false; endT = 0; clock = 0; p.ride = false;
    foe = FOES[theme.id]();
    foes = lvl.foes.map((f) => ({ x: f.x * TILE + 4, y: (f.y + 1) * TILE - 20, ox: f.x * TILE + 4, oy: (f.y + 1) * TILE - 20, vx: -46, t: f.i * 1.3, alive: true, deadT: 0 }));
    s.stomped = 0; s.foes = foes.length;
    const m = MISSIONS[n];
    s.mission = { text: m.text, have: 0, need: m.kind === 'all' ? s.total : m.kind === 'arrows' ? arrows : m.need, done: false };
    revealed = new Set();
    movers = lvl.movers.map((m) => ({ ...m, px: m.x * TILE, pw: m.w * TILE, y: m.baseY * TILE, prevY: m.baseY * TILE }));
    hazards = lvl.hazards.map((h) => {
      const size = h.kind === 'S' ? [24, 24] : h.kind === 'T' ? [32, 32] : [36, 22];
      return { kind: h.kind, i: h.i, ox: h.x * TILE, oy: h.y * TILE, x: h.x * TILE, y: h.y * TILE, w: size[0], h: size[1], t: h.i * 0.9 };
    });
    checkpoint = { x: lvl.spawn.x * TILE + (TILE - PW) / 2, y: (lvl.spawn.y + 1) * TILE - PH };
    respawn(); p.invuln = 0;
    cam = 0;
    camY = Math.max(0, lvl.h * TILE - VIEW_H);
    opts.onStatus(`World ${stageCode(n)}: ${WORLDS[n].short.toLowerCase()}. Mission: ${m.text}.`);
    resume();
  }

  function showMap(sel = mapSel) {
    runSequence++;
    s.mode = 'map';
    s.finished = false;
    mapSel = sel;
    const ch = CHAPTERS[chapterOf(sel)];
    opts.onStatus(`World map. ${ch.name}, ${ch.stages.length === 1 ? 'one stage' : `${ch.stages.length} stages`}, selected. Left and right to choose a world, Space to start.`);
    draw();
  }

  // ---- juice (off under reduced motion)
  const puff = (x: number, y: number, n: number, c: string, spread: number) => {
    if (opts.reduceMotion) return;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      parts.push({ x, y, vx: Math.cos(a) * spread, vy: Math.sin(a) * spread - spread * 0.3, life: 0.35, c });
    }
  };

  // ---- rate line (Desk): platforms follow a deterministic, chart-like signal
  const AMP = 56;
  const price = (t: number) => 0.55 * Math.sin(t * 1.05) + 0.3 * Math.sin(t * 2.3 + 1.1) + 0.15 * Math.sin(t * 4.7 + 0.4);

  // ---- input: captured only while the canvas has focus, so the page keeps
  // its arrow keys and space bar, and Tab always leaves (no focus trap).
  const keys = new Set<string>();
  const touch = { left: false, right: false, jump: false };
  const GAME_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter', 'a', 'd', 'w', 'A', 'D', 'W']);
  const isJumpKey = (k: string) => k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W';
  const onKey = (e: KeyboardEvent, down: boolean) => {
    if (e.key === 'Escape' && down) { if (s.mode === 'level') setPaused(!s.paused); e.preventDefault(); return; }
    if (!GAME_KEYS.has(e.key)) return;
    e.preventDefault();
    if (s.mode === 'map') {
      if (!down) return;
      // arrows step world by world, landing on that world's first unfinished stage
      const step = (d: number) => {
        const c = (chapterOf(mapSel) + d + CHAPTERS.length) % CHAPTERS.length;
        const st = CHAPTERS[c].stages as readonly number[];
        mapSel = st.find((i) => !s.done.includes(i)) ?? st[0];
        opts.onMapSelect?.(mapSel); showMap(mapSel);
      };
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') step(-1);
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') step(1);
      else if (e.key === ' ' || e.key === 'Enter') loadLevel(mapSel);
      return;
    }
    if (down && s.paused) setPaused(false); // any game key carries on: no separate unpause step
    if (down) { if (!keys.has(e.key) && isJumpKey(e.key)) p.buffer = T.buffer; keys.add(e.key); }
    else keys.delete(e.key);
  };
  const kd = (e: KeyboardEvent) => onKey(e, true);
  const ku = (e: KeyboardEvent) => onKey(e, false);
  canvas.addEventListener('keydown', kd);
  canvas.addEventListener('keyup', ku);
  // Leaving the game pauses it; moving focus to its own controls (touch
  // arrows, Sound, the world picker) does not.
  const blur = (e: FocusEvent) => {
    keys.clear();
    const to = e.relatedTarget as Node | null;
    if (to && canvas.closest('.play')?.contains(to)) return;
    if (s.mode === 'level') setPaused(true);
  };
  canvas.addEventListener('blur', blur);
  const vis = () => { if (document.hidden && s.mode === 'level') setPaused(true); };
  document.addEventListener('visibilitychange', vis);
  // Entering the browser's fullscreen layer can briefly report the focused
  // canvas as non-intersecting. Restore only a pause caused by this observer;
  // an explicit pause, blur or hidden tab must still wait for the player.
  let pausedOffscreen = false;
  const io = new IntersectionObserver((entries) => {
    // A fullscreen transition may batch both the old and new visibility.
    const e = entries[entries.length - 1];
    if (!e || s.mode !== 'level') return;
    if (!e.isIntersecting && !s.paused) {
      setPaused(true);
      pausedOffscreen = true;
    } else if (e.isIntersecting && pausedOffscreen) {
      pausedOffscreen = false;
      if (!document.hidden && document.activeElement === canvas) setPaused(false);
    }
  }, { threshold: 0.25 });
  io.observe(canvas);
  const wake = (e: PointerEvent) => {
    canvas.focus();
    if (s.mode === 'map') {
      // click a world on the map to start it
      const r = canvas.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * HUD_W, my = ((e.clientY - r.top) / r.height) * HUD_H;
      let best = -1, bd = 26 * 26;
      NODES.forEach(([nx, ny], i) => { const d = (nx - mx) ** 2 + (ny - my) ** 2; if (d < bd) { bd = d; best = i; } });
      if (best >= 0) { mapSel = best; opts.onMapSelect?.(best); loadLevel(best); }
      return;
    }
    setPaused(false);
  };
  const onFocus = () => { if (s.mode === 'level') setPaused(false); };
  canvas.addEventListener('pointerdown', wake);
  canvas.addEventListener('focus', onFocus);

  function setPaused(v: boolean) {
    pausedOffscreen = false;
    if (s.finished || s.paused === v) return;
    s.paused = v;
    opts.onStatus(v ? 'Paused. Press Escape or click the game to carry on.' : 'Playing.');
    if (!v) resume(); else draw();
  }

  function input() {
    let left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A') || touch.left;
    let right = keys.has('ArrowRight') || keys.has('d') || keys.has('D') || touch.right;
    let jump = keys.has(' ') || keys.has('ArrowUp') || keys.has('w') || keys.has('W') || touch.jump;
    const pad = navigator.getGamepads?.().find(Boolean);
    if (pad) {
      left ||= pad.axes[0] < -0.4 || !!pad.buttons[14]?.pressed;
      right ||= pad.axes[0] > 0.4 || !!pad.buttons[15]?.pressed;
      jump ||= !!pad.buttons[0]?.pressed;
    }
    if (jump && !p.jumpHeld) p.buffer = Math.max(p.buffer, T.buffer);
    return { dir: (right ? 1 : 0) - (left ? 1 : 0), jump };
  }

  // ---- collision helpers
  const solidAt = (tx: number, ty: number) => lvl.tiles[ty]?.[tx] === '#';
  const oneWayAt = (tx: number, ty: number) => {
    const t = lvl.tiles[ty]?.[tx];
    return t === '=' || (t === 'D' && revealed.has(`${tx},${ty}`));
  };
  function hitsSolid(x: number, y: number, w: number, h: number) {
    for (let ty = Math.floor(y / TILE); ty <= Math.floor((y + h - 0.01) / TILE); ty++)
      for (let tx = Math.floor(x / TILE); tx <= Math.floor((x + w - 0.01) / TILE); tx++)
        if (solidAt(tx, ty) || tx < 0) return true;
    return false;
  }
  const overlap = (ax: number, ay: number, aw: number, ah: number) => p.x < ax + aw && p.x + PW > ax && p.y < ay + ah && p.y + PH > ay;

  function hurt(fromX: number) {
    if (p.invuln > 0 || assist().invuln) return;
    s.hits++;
    sfx.hit();
    p.invuln = T.invuln; p.hurtT = 0.35;
    p.vx = (p.x + PW / 2 < fromX ? -1 : 1) * T.hitKnockX;
    p.vy = -T.hitKnockY;
    if (!opts.reduceMotion) shake = 6;
    if (s.hits >= T.maxHits) {
      // Brief: three hits restart the level. No lives, no game-over screen.
      opts.onStatus('Three hits. This world starts again.');
      loadLevel(s.level);
    }
  }
  // mission progress; announces once when it completes
  function progress(add = 0) {
    const m = MISSIONS[s.level];
    s.mission.have = m.kind === 'stomp' ? s.stomped : m.kind === 'all' ? s.collected : m.kind === 'arrows' ? arrowsGot : s.mission.have + add;
    if (!s.mission.done && s.mission.have >= s.mission.need) {
      s.mission.done = true;
      if (!s.missions.includes(s.level)) s.missions.push(s.level);
      opts.onStatus(`Mission complete: ${m.text.toLowerCase()}.`);
    }
  }
  function respawn() { p.x = checkpoint.x; p.y = checkpoint.y; p.vx = 0; p.vy = 0; p.invuln = 0.6; riding = null; }

  function step(dt: number) {
    clock += dt;
    if (!s.finished) s.elapsed += dt * 1000;
    if (s.finished) { endT += dt; p.vx = 0; return; }
    for (const m of movers) { m.prevY = m.y; m.y = m.baseY * TILE - AMP * price(clock + m.i * 0.7); }
    if (riding && p.vy >= 0 && p.x + PW > riding.px && p.x < riding.px + riding.pw) p.y = riding.y - PH;
    else riding = null;

    // drafted platforms become real as you come close: the model drafts, you decide
    if (theme.draft) {
      const cx = Math.floor((p.x + PW / 2) / TILE);
      for (let ty = 0; ty < lvl.h; ty++) for (let tx = cx - 4; tx <= cx + 6; tx++) if (lvl.tiles[ty]?.[tx] === 'D' && !revealed.has(`${tx},${ty}`)) {
        revealed.add(`${tx},${ty}`);
        puff(tx * TILE + TILE / 2, ty * TILE + 4, 3, '#c4b5fd', 50);
      }
    }

    const { dir, jump } = input();
    const k = p.ride ? RIDE : 1;
    p.heldFor = dir ? p.heldFor + dt : 0;
    const max = (p.heldFor > T.runAfter ? T.runSpeed : T.walkSpeed) * k;
    const air = p.grounded ? 1 : T.airMult;
    if (dir) {
      const reversing = Math.sign(p.vx) === -dir && p.vx !== 0;
      const a = (reversing ? T.turnAccel : T.accel) * air * k;
      if (dir * p.vx < max) p.vx = dir * Math.min(max, dir * p.vx + a * dt);
      else p.vx = dir * Math.max(max, dir * p.vx - T.friction * dt); // bleed off, never add
      p.face = dir;
    } else {
      const f = T.friction * air * dt;
      p.vx = Math.abs(p.vx) <= f ? 0 : p.vx - Math.sign(p.vx) * f;
    }

    // jump: buffer + coyote, variable height, apex hang, heavier fall
    p.coyote = p.grounded ? T.coyote : Math.max(0, p.coyote - dt);
    p.buffer = Math.max(0, p.buffer - dt);
    if (p.buffer > 0 && p.coyote > 0) {
      const bonus = 1 + T.speedJumpBonus * Math.min(1, Math.abs(p.vx) / (T.runSpeed * k));
      p.vy = -T.jumpSpeed * bonus * (p.ride ? 1.06 : 1);
      p.buffer = 0; p.coyote = 0; p.grounded = false; p.rising = true; s.jumps++; riding = null;
      p.squash = opts.reduceMotion ? 0 : -0.14;
      sfx.jump();
    }
    if (p.rising && (!jump || p.vy >= 0)) p.rising = false;
    let g = T.gravity;
    if (!p.rising || p.vy > 0) g *= T.fallMult;
    if (jump && Math.abs(p.vy) < T.apexHangVy) g = T.gravity * T.apexHangMult;
    p.vy = Math.min(T.maxFall, p.vy + g * dt);
    p.jumpHeld = jump;

    // move X
    const nx = p.x + p.vx * dt;
    if (!hitsSolid(nx, p.y, PW, PH)) p.x = nx;
    else { p.x = p.vx > 0 ? Math.floor((nx + PW) / TILE) * TILE - PW - 0.01 : Math.ceil(nx / TILE) * TILE + 0.01; p.vx = 0; }
    if (Math.abs(p.vx) > 1 && p.grounded) p.run += (Math.abs(p.vx) * dt) / 14;

    // move Y (upward corner correction, one-way platforms, rate-line platforms)
    const ny = p.y + p.vy * dt;
    const wasGrounded = p.grounded;
    p.grounded = false;
    if (p.vy < 0 && hitsSolid(p.x, ny, PW, PH)) {
      let fixed = false;
      for (let d = 1; d <= T.cornerCorrect && !fixed; d++)
        for (const sx of [d, -d])
          if (!hitsSolid(p.x + sx, ny, PW, PH)) { p.x += sx; p.y = ny; fixed = true; break; }
      if (!fixed) { p.y = Math.ceil(ny / TILE) * TILE + 0.01; p.vy = 0; p.rising = false; }
    } else if (p.vy >= 0) {
      const feetBefore = p.y + PH, feetAfter = ny + PH;
      const row = Math.floor(feetAfter / TILE);
      let land = false;
      for (let tx = Math.floor(p.x / TILE); tx <= Math.floor((p.x + PW - 0.01) / TILE); tx++) {
        if (solidAt(tx, row)) land = true;
        if (oneWayAt(tx, row) && feetBefore <= row * TILE + 0.5) land = true;
      }
      if (land) { riding = null; p.y = row * TILE - PH; p.vy = 0; p.grounded = true; }
      else {
        for (const m of movers) {
          if (p.x + PW <= m.px || p.x >= m.px + m.pw) continue;
          if (feetBefore <= Math.max(m.prevY, m.y) + 1 && feetAfter >= m.y) { p.y = m.y - PH; p.vy = 0; p.grounded = true; riding = m; break; }
        }
        if (!p.grounded) p.y = ny;
      }
      if (p.grounded && !wasGrounded && !opts.reduceMotion) { p.squash = 0.12; puff(p.x + PW / 2, p.y + PH, 6, theme.ink, 70); }
    } else p.y = ny;

    if (p.y > lvl.h * TILE + 80) respawn(); // fell out: back to the last checkpoint

    // items
    p.invuln = Math.max(0, p.invuln - dt);
    p.hurtT = Math.max(0, p.hurtT - dt);
    for (const it of items) {
      if (it.taken) continue;
      const ix = it.x * TILE, iy = it.y * TILE;
      // Checkpoints trigger on passing them on the same storey, even mid-jump.
      if (it.kind === 'C') { if (p.x >= ix && Math.abs(p.y + PH - (iy + TILE)) < TILE * 3 && (checkpoint.y !== iy + TILE - PH || checkpoint.x < ix)) checkpoint = { x: ix + (TILE - PW) / 2, y: iy + TILE - PH }; continue; }
      const pad = it.kind === '^' ? 6 : 0;
      if (!overlap(ix + pad, iy + pad * 2, TILE - pad * 2, TILE - pad * 2)) continue;
      if (it.kind === 'o' || it.kind === 'u') { it.taken = true; s.collected++; if (it.kind === 'u') arrowsGot++; sfx.collect(); puff(ix + TILE / 2, iy + TILE / 2, 8, '#f3a414', 140); progress(); }
      else if (it.kind === 'B') { it.taken = true; p.ride = true; sfx.collect(); opts.onStatus('On the scooter.'); }
      else if (it.kind === '^') hurt(ix + TILE / 2);
      else if (it.kind === 'F' && !s.finished) {
        s.finished = true; endT = 0; sfx.finish();
        if (MISSIONS[s.level].kind === 'ride' && p.ride) progress(1);
        if (!s.done.includes(s.level)) s.done.push(s.level);
        const ms = s.mission.done ? ' Mission complete: gold star.' : ` Mission: ${s.mission.have} of ${s.mission.need}.`;
        const code = stageCode(s.level);
        opts.onStatus((s.collected >= s.total ? `World ${code} done, with everything collected. Shipped.` : `World ${code} done, ${s.collected} of ${s.total} collected.`) + ms);
        const done = { ...s, done: [...s.done], missions: [...s.missions], mission: { ...s.mission } };
        const finishedRun = runSequence;
        setTimeout(() => { if (finishedRun === runSequence) opts.onLevelEnd(done); }, opts.reduceMotion ? 200 : 1300);
      }
    }

    // hazards
    for (const h of hazards) {
      h.t += dt;
      if (h.kind === 'S') {
        // drops from where it sits on a 2.6 s rhythm
        const cyc = h.t % 2.6;
        h.x = h.ox + 4; h.y = cyc < 0.5 ? -1e4 : h.oy - 40 + 0.5 * 900 * (cyc - 0.5) ** 2;
      } else if (h.kind === 'T') {
        h.x = h.ox + Math.sin(h.t * 1.4) * 70; h.y = h.oy;
      } else {
        h.x = h.ox + Math.cos(h.t * 1.8) * 44 - 2; h.y = h.oy + Math.sin(h.t * 1.8) * 30;
      }
      if (overlap(h.x + 3, h.y + 3, h.w - 6, h.h - 6)) hurt(h.x + h.w / 2);
    }

    // small enemies: walkers turn at walls and ledges; fliers hover on a beat.
    // Landing on one from above clears it (and bounces you); touching it from
    // the side is a hit, like any hazard.
    for (const e of foes) {
      e.t += dt;
      if (!e.alive) { e.deadT += dt; if (foe.flee) { e.y -= 160 * dt; e.x += 60 * dt; } continue; }
      if (foe.fly) { e.x = e.ox + Math.sin(e.t * 0.9) * 64; e.y = e.oy - 34 + Math.sin(e.t * 5) * 5; }
      else {
        const nx = e.x + e.vx * dt, lead = e.vx < 0 ? nx : nx + 24;
        const tx = Math.floor(lead / TILE), ty = Math.floor((e.y + 19) / TILE);
        const ledge = !solidAt(tx, ty + 1) && !oneWayAt(tx, ty + 1);
        if (solidAt(tx, ty) || ledge || tx < 0) e.vx = -e.vx; else e.x = nx;
      }
      if (!overlap(e.x + 2, e.y + 2, 20, 18)) continue;
      const feetBefore = p.y + PH - p.vy * dt;
      if (p.vy > 0 && feetBefore <= e.y + 10) {
        e.alive = false; e.deadT = 0; s.stomped++;
        p.vy = -T.jumpSpeed * (p.jumpHeld ? 0.85 : 0.55); p.rising = p.jumpHeld; p.grounded = false;
        sfx.stomp(); puff(e.x + 12, e.y + 10, 8, theme.ink, 120);
        if (MISSIONS[s.level].kind === 'stomp') progress();
      } else hurt(e.x + 12);
    }

    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i];
      q.life -= dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 600 * dt;
      if (q.life <= 0) parts.splice(i, 1);
    }
    p.squash *= Math.pow(0.0001, dt);
    shake = Math.max(0, shake - dt * 30);

    // camera: follow with ~20% look-ahead; vertical levels follow up and down too
    const target = p.x + PW / 2 - VIEW_W * 0.4 + p.face * VIEW_W * 0.1;
    const clamped = Math.max(0, Math.min(lvl.w * TILE - VIEW_W, target));
    const targetY = Math.max(0, Math.min(lvl.h * TILE - VIEW_H, p.y + PH / 2 - VIEW_H * 0.55));
    const ease = opts.reduceMotion ? 1 : Math.min(1, dt * 6);
    cam += (clamped - cam) * ease;
    camY += (targetY - camY) * ease;

    Object.assign(s, { x: p.x, y: p.y, vx: p.vx, vy: p.vy, grounded: p.grounded, riding: p.ride });
  }

  // ---- render
  const W = (im: HTMLCanvasElement, x: number, y: number) => ctx.drawImage(im, snap(x), snap(y), im.width / ART, im.height / ART);

  // The map: a real-ish map of her route (map.ts), drawn once; nodes, routes,
  // labels and the character go on top each time it changes.
  const mapIcons = LEVELS.map((l) => THEMES[l.theme]());
  const base = mapBase();
  const schools: Record<number, HTMLCanvasElement> = Object.fromEntries(Object.entries(SCHOOL_ICONS).map(([k, f]) => [k, f()]));
  const logos: Record<number, HTMLCanvasElement> = Object.fromEntries(Object.entries(LOGO_ICONS).map(([k, l]) => [k, l.icon()]));
  function drawMap() {
    const plate = illustrated('world-map');
    if (plate) ctx.drawImage(plate, 0, 0, HUD_W, HUD_H);
    else ctx.drawImage(base, 0, 0);
    const mapText = (label: string, x: number, y: number, colour: string, size = 8) => {
      ctx.font = `${size}px "Pixelify Sans", monospace`;
      ctx.textBaseline = 'top'; ctx.fillStyle = colour;
      ctx.fillText(label, x, y);
    };
    mapText('WORKING ORDER', 16, 10, '#263b50', 15);
    mapText('KAOHSIUNG TO LONDON TO NEXT', 16, 27, '#2b3654', 8);
    // routes: roads in Taiwan and London, sea lanes out to the islands
    // (Taipei to London is the dashed flight in the base map)
    const route = (i: number, col: string, gap: number) => {
      const [x0, y0] = NODES[i], [x1, y1] = NODES[i + 1];
      const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / gap);
      ctx.fillStyle = col;
      for (let k = 1; k < n; k++) {
        const x = Math.round(x0 + ((x1 - x0) * k) / n), y = Math.round(y0 + ((y1 - y0) * k) / n);
        if (NODES.some(([nx, ny]) => Math.abs(nx - x) < 12 && Math.abs(ny - y) < 12)) continue;
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    };
    [0, 1, 3, 4].forEach((i) => route(i, '#a0471f', 4));
    [5, 6].forEach((i) => route(i, '#2b3654', 5));
    // the selected world: a red line around its own coastline (or London's inset frame)
    ctx.fillStyle = '#e5484d';
    if (!plate) for (const [x, y] of SELECT_RINGS[chapterOf(mapSel)]) ctx.fillRect(x, y, 1, 1);
    NODES.forEach(([x, y], i) => {
      const sel = chapterOf(i) === chapterOf(mapSel), done = s.done.includes(i);
      const brand = BRAND[i];
      ctx.fillStyle = sel ? '#e5484d' : brand ? brand.bg : '#2b3654'; ctx.fillRect(x - 11, y - 11, 22, 22);
      ctx.fillStyle = LOGO_ICONS[i]?.bg ?? mapIcons[i].sky; ctx.fillRect(x - 9, y - 9, 18, 18);
      const ic = logos[i] ?? schools[i] ?? mapIcons[i].pickup[0]; // schools show their buildings; Barclays its eagle
      if (logos[i] || !drawIllustration(ctx, i === 7 ? 'star' : i === 6 ? 'gem' : i === 0 ? 'heart' : 'journal', x, y + 8, 16, 16))
        ctx.drawImage(ic, Math.round(x - ic.width / 2), Math.round(y - ic.height / 2));
      // a star for finishing; gold once the world's mission is done too
      if (done) drawIllustration(ctx, 'star', x + 12, y - 8, 10, 10);
      const code = stageCode(i);
      const lines = [`${code === 'Bonus' ? '★' : code} ${WORLDS[i].short}`, WORLDS[i].when];
      lines.forEach((l, k) => {
        const [lx, ly] = labelAt(i, l, k);
        if (brand && k === 0) {
          // the organisation's badge: its colour, a stripe of its accent, its name
          ctx.fillStyle = brand.bg; ctx.fillRect(lx - 4, ly - 2, textWidth(l) + 7, 9);
          ctx.fillStyle = brand.accent; ctx.fillRect(lx - 4, ly - 2, 2, 9);
          mapText(l, lx, ly - 1, brand.fg, 7);
          return;
        }
        ctx.globalAlpha = 0.85; ctx.fillStyle = '#fbf7ea'; ctx.fillRect(lx - 2, ly - 1, textWidth(l) + 4, 7); ctx.globalAlpha = 1;
        mapText(l, lx, ly - 1, k ? '#5a5a58' : sel ? '#9b372d' : '#161616', 7);
      });
    });
    // the character stands on the selected world, dressed for that era
    const [sx, sy] = NODES[mapSel];
    const era = playerFrames(mapIcons[mapSel].id);
    if (!drawIllustration(ctx, 'walk-1', sx, sy - 13, 34, 34)) ctx.drawImage(era.right.idle[0], sx - 8, sy - 37);
    // footer: the selected world, then how to move
    const c = chapterOf(mapSel), ch = CHAPTERS[c];
    const name = 'bonus' in ch && ch.bonus ? `BONUS · ${ch.name}` : `WORLD ${c + 1} · ${ch.name}`;
    const foot = `< ${name} · ${ch.stages.length === 1 ? '1 STAGE' : `${ch.stages.length} STAGES`} >   SPACE TO PLAY`;
    ctx.globalAlpha = 0.85; ctx.fillStyle = '#fbf7ea'; ctx.fillRect(14, 254, textWidth(foot) + 4, 9); ctx.globalAlpha = 1;
    mapText(foot, 16, 255, '#2b3654', 7);
    mapText('NOT TO SCALE', 405, 256, '#2b3654', 6);
  }

  function draw() {
    ctx.setTransform(RENDER, 0, 0, RENDER, 0, 0);
    if (s.mode === 'map') { drawMap(); return; }
    ctx.save();
    ctx.scale(ART, ART);
    ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    // parallax (static under reduced motion)
    const par = (im: HTMLCanvasElement, kx: number) => {
      const o = opts.reduceMotion ? 0 : -((cam * kx) % VIEW_W);
      ctx.drawImage(im, snap(o), 0, VIEW_W, VIEW_H);
      ctx.drawImage(im, snap(o + VIEW_W), 0, VIEW_W, VIEW_H);
    };
    const plate = scenery(theme.id);
    if (plate) {
      // Full image, never cropped or tiled: a landmark appears once.
      const scale = Math.min(VIEW_W / plate.naturalWidth, VIEW_H / plate.naturalHeight);
      const width = plate.naturalWidth * scale, height = plate.naturalHeight * scale;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(plate, (VIEW_W - width) / 2, (VIEW_H - height) / 2, width, height);
      ctx.imageSmoothingEnabled = false;
    } else { par(theme.far, 0.2); par(theme.near, 0.5); }

    const sx = shake ? (Math.random() - 0.5) * shake : 0;
    ctx.translate(snap(-cam + sx), snap(-camY));
    const x0 = Math.floor(cam / TILE) - 1, x1 = x0 + VIEW_W / TILE + 3;
    const y0 = Math.floor(camY / TILE) - 1, y1 = y0 + VIEW_H / TILE + 3;
    const platformArt = theme.id === 'ai' ? 'glass' : theme.id === 'bedtime' ? 'wood' : theme.id === 'tower' || theme.id === 'desk' ? 'desk' : 'stone';
    const drawPlatform = (x: number, y: number) => {
      if (!drawIllustration(ctx, platformArt, x + TILE / 2, y + 14, TILE + 1, 14)) W(theme.platform, x, y);
    };
    for (let ty = Math.max(0, y0); ty < Math.min(lvl.h, y1); ty++)
      for (let tx = x0; tx < x1; tx++) {
        const t = lvl.tiles[ty]?.[tx];
        if (t === '#') ground(ctx, tx * TILE, ty * TILE, lvl.tiles[ty - 1]?.[tx] !== '#', theme.id);
        else if (t === '=') drawPlatform(tx * TILE, ty * TILE);
        else if (t === 'D' && theme.draft) {
          ctx.globalAlpha = revealed.has(`${tx},${ty}`) ? 1 : .35;
          drawPlatform(tx * TILE, ty * TILE); ctx.globalAlpha = 1;
        }
      }
    // floor signs (the tower's job titles)
    if (theme.sign) for (const l of LEVELS[s.level].labels) {
      const w = textWidth(l.text, 2) + 12;
      ctx.fillStyle = theme.sign.bg; ctx.fillRect(snap(l.x * TILE), snap(l.y * TILE), w / ART, 22 / ART);
      ctx.save(); ctx.translate(snap(l.x * TILE), snap(l.y * TILE)); ctx.scale(1 / ART, 1 / ART);
      text(ctx, l.text, 6, 6, theme.sign.fg, 2); ctx.restore();
    }
    if (movers.length) {
      // the FX rate, drawn as a dashed chart line through the platforms' real tops
      const pts = movers.map((m) => [m.px + m.pw / 2, m.y + 4]);
      const f = pts[0], l = pts[pts.length - 1];
      pts.unshift([f[0] - TILE * 3, f[1] - (pts[1] ? (pts[1][1] - f[1]) * 0.6 : 0)]);
      pts.push([l[0] + TILE * 3, l[1] + (pts.length > 2 ? (l[1] - pts[pts.length - 2][1]) * 0.6 : 0)]);
      ctx.strokeStyle = '#4a90d9'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
      ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
      ctx.stroke(); ctx.setLineDash([]);
      for (const m of movers) for (let k = 0; k < m.w; k++) drawPlatform(m.px + k * TILE, m.y);
    }
    const bob = opts.reduceMotion ? 0 : Math.round(Math.sin(clock * 4) * 2);
    for (const it of items) {
      if (it.taken) continue;
      const ix = it.x * TILE, iy = it.y * TILE;
      if (it.kind === 'o' || it.kind === 'u') {
        const name = it.kind === 'u' ? 'arrow' : theme.id === 'bedtime' ? 'star' : theme.id === 'london' || theme.id === 'lingtung' ? 'journal' : 'gem';
        if (!drawIllustration(ctx, name, ix + TILE / 2, iy + TILE - 4 + bob, 24, 24)) { const im = it.kind === 'u' && theme.pickup2 ? theme.pickup2 : theme.pickup[0]; W(im, ix + TILE / 2 - im.width, iy + TILE / 2 - im.height + bob); }
      }
      else if (it.kind === 'B') { if (!drawIllustration(ctx, 'scooter', ix + TILE / 2, iy + TILE + bob, 50, 34)) W(bike, ix + TILE / 2 - bike.width, iy + TILE - bike.height / ART + bob); }
      else if (it.kind === '^') W(theme.spike, ix, iy + TILE - theme.spike.height / ART);
      else if (it.kind === 'C') { if (!drawIllustration(ctx, 'flag', ix + TILE / 2, iy + TILE, 26, 38)) W(theme.check, ix + TILE / 2 - theme.check.width, iy + TILE - theme.check.height / ART); }
      else if (it.kind === 'F') {
        const im = theme.finish;
        if (!drawIllustration(ctx, 'finish', ix + TILE / 2, iy + TILE, 42, 54)) W(im, ix + TILE / 2 - im.width, iy + TILE - im.height / ART);
        // Bedtime: the egg hatches into this week's pet
        if (theme.id === 'bedtime' && s.finished && endT > 0.4) W(petSprite, ix + TILE / 2 - petSprite.width, iy + TILE - im.height / ART - petSprite.height / ART - (opts.reduceMotion ? 0 : Math.min(16, endT * 30)));
      }
    }
    for (const h of hazards) if (h.y > -60 && h.y < lvl.h * TILE) W(theme.hazard, h.x, h.y);
    for (const e of foes) {
      const fr = foe.frames[Math.floor(e.t * (foe.fly ? 10 : 5)) % 2];
      const foeName = ['mosquito','deadline','beetle','pigeon','meeting','change','hallucination','screen'][s.level];
      if (illustrated(`foe-${foeName}`)) {
        if (e.alive || (foe.flee ? e.deadT < 1.2 : e.deadT < .35)) {
          ctx.globalAlpha = e.alive ? 1 : Math.max(0, 1 - e.deadT / (foe.flee ? 1.2 : .35));
          drawIllustration(ctx, `foe-${foeName}`, e.x + 12, e.y + 20, 28, e.alive || foe.flee ? 26 : 10, e.vx > 0);
          ctx.globalAlpha = 1;
        }
        continue;
      }
      if (e.alive) {
        // walkers face the way they walk
        if (!foe.fly && e.vx > 0) { ctx.save(); ctx.translate(snap(e.x + 24), snap(e.y)); ctx.scale(-1, 1); ctx.drawImage(fr, 0, 0, 24, 20); ctx.restore(); }
        else W(fr, e.x, e.y);
      } else if (foe.flee ? e.deadT < 1.2 : e.deadT < 0.35) {
        if (foe.flee) W(fr, e.x, e.y);
        else ctx.drawImage(fr, snap(e.x - 2), snap(e.y + 12), 28, 8); // flattened, then gone
      }
    }
    // player (on the scooter in Kaohsiung)
    const fr = p.face >= 0 ? hero.right : hero.left;
    let im = fr.idle[Math.floor(clock * 2) % 2];
    if (s.finished) im = fr.cheer[Math.floor(endT * 4) % 2];
    else if (p.hurtT > 0) im = fr.hurt[0];
    else if (p.ride) im = fr.idle[0];
    else if (!p.grounded) im = p.vy < 0 ? fr.jump[0] : fr.fall[0];
    else if (Math.abs(p.vx) > 20) im = fr.run[Math.floor(p.run) % 6];
    if (!(p.invuln > 0 && p.hurtT === 0 && Math.floor(p.invuln * 12) % 2)) {
      const sq = p.squash, w = 32 * (1 + sq), hh = 48 * (1 - sq);
      const lift = p.ride ? 14 : 0;
      const frame = p.grounded && Math.abs(p.vx) > 20 && !opts.reduceMotion ? Math.floor(p.run) % 4 + 1 : 1;
      if (!drawIllustration(ctx, `walk-${frame}`, p.x + PW / 2, p.y + PH - lift, 60, 60, p.face < 0))
        ctx.drawImage(p.hurtT > 0.25 ? hero.flash : im, snap(p.x + PW / 2 - w / 2), snap(p.y + PH - hh - lift), snap(w), snap(hh));
      // Kaohsiung: a half-helmet whenever she rides
      if (p.ride && !illustrated('walk-1')) ctx.drawImage(lid, snap(p.x + PW / 2 - w / 2), snap(p.y + PH - hh - lift - 2), snap(w), snap(10 * (1 - sq)));
      if (p.ride) {
        ctx.save(); ctx.translate(snap(p.x + PW / 2), snap(p.y + PH - bike.height / ART)); ctx.scale(p.face >= 0 ? 1 : -1, 1);
        if (!drawIllustration(ctx, 'scooter', 0, bike.height / ART, 52, 34)) ctx.drawImage(bike, -bike.width / ART / 2, 0, bike.width / ART, bike.height / ART); ctx.restore();
      }
    }
    for (const q of parts) { ctx.globalAlpha = Math.max(0, q.life / 0.35); ctx.fillStyle = q.c; ctx.fillRect(snap(q.x), snap(q.y), 4, 4); }
    ctx.globalAlpha = 1;
    ctx.restore();

    // weather, screen-space
    if (theme.weather === 'rain' && !opts.reduceMotion) {
      ctx.fillStyle = 'rgba(214,226,240,.7)';
      for (const d of rain) { d.y = (d.y + 5) % 270; d.x = (d.x + 479) % 480; ctx.fillRect(d.x, d.y, 1, 4); }
    }

    // HUD in the pixel font, at art resolution, on a strip so it reads on any background
    ctx.globalAlpha = 0.94; ctx.fillStyle = '#f6fbfd'; ctx.fillRect(0, 0, HUD_W, 22); ctx.globalAlpha = 1;
    ctx.font = '12px "Pixelify Sans", monospace'; ctx.textBaseline = 'top'; ctx.fillStyle = '#30485a';
    ctx.fillText(`${s.collected}/${s.total}`, 8, 6);
    for (let i = 0; i < T.maxHits; i++) {
      ctx.globalAlpha = i < T.maxHits - s.hits ? 1 : .25;
      drawIllustration(ctx, 'heart', HUD_W - 12 - i * 13, 17, 10, 10);
    }
    ctx.globalAlpha = 1;
    const head = `${stageCode(s.level)} ${WORLDS[s.level].short} · ${WORLDS[s.level].when}`;
    ctx.font = '8px "Pixelify Sans", monospace'; ctx.fillStyle = '#30485a';
    ctx.fillText(head, (HUD_W - ctx.measureText(head).width) / 2, 8);
    // the mission, under the strip
    const ms = s.mission.done ? `★ ${s.mission.text} · DONE` : MISSIONS[s.level].kind === 'ride' ? `★ ${s.mission.text}` : `★ ${s.mission.text} · ${s.mission.have}/${s.mission.need}`;
    ctx.globalAlpha = .94; ctx.fillStyle = '#f6fbfd'; ctx.fillRect(0, 22, ctx.measureText(ms).width + 16, 13); ctx.globalAlpha = 1;
    ctx.fillStyle = s.mission.done ? '#8c5a00' : '#30485a'; ctx.fillText(ms, 8, 24);
    if (s.paused) {
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(0, 0, HUD_W, HUD_H);
      text(ctx, 'PAUSED', HUD_W / 2 - 36, HUD_H / 2 - 8, '#ffffff', 3);
    }
  }

  // ---- loop: fixed timestep; stops entirely on the map, while paused, offscreen or between worlds
  let last = 0, acc = 0, raf = 0;
  function frame(now: number) {
    if (s.paused || s.mode === 'map') { draw(); raf = 0; return; }
    acc += Math.min(0.1, (now - last) / 1000);
    last = now;
    while (acc >= STEP) { step(STEP); acc -= STEP; }
    draw();
    raf = s.finished && endT > 2 ? 0 : requestAnimationFrame(frame);
  }
  function resume() {
    if (raf || s.paused || s.mode === 'map') return;
    last = performance.now(); acc = 0;
    raf = requestAnimationFrame(frame);
  }

  if (opts.startOnMap ?? true) showMap(mapSel);
  else loadLevel(mapSel);
  canvas.focus();

  return {
    state: () => ({ ...s, done: [...s.done], missions: [...s.missions], mission: { ...s.mission }, enemies: foes.filter((e) => e.alive).map(({ x, y }) => ({ x, y })) }),
    touch,
    levels: LEVELS.length,
    loadLevel: (n: number) => { canvas.focus(); mapSel = n; loadLevel(n); },
    showMap: (n?: number) => { canvas.focus(); cancelAnimationFrame(raf); raf = 0; showMap(n ?? mapSel); },
    pause: () => setPaused(true),
    resume: () => setPaused(false),
    destroy() {
      cancelAnimationFrame(raf); raf = 0;
      canvas.removeEventListener('keydown', kd); canvas.removeEventListener('keyup', ku);
      canvas.removeEventListener('blur', blur); canvas.removeEventListener('pointerdown', wake);
      canvas.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', vis);
      io.disconnect();
    },
  };
}
