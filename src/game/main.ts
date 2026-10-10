// The game chunk, loaded only when someone presses Play (see game-loader.ts).
// Hand-written canvas engine. The world is 960×540 with 32px tiles; it renders
// as pixel art on a 480×270 canvas, scaled up with nearest-neighbour in CSS.
import { T, TILE, VIEW_W, VIEW_H } from './tuning';
import { parse } from './level';
import { LEVELS } from './levels';
import { THEMES, playerFrames, pet, type Theme } from './art';
import { text } from './pixel';
import { sfx } from './sound';
export { setSound } from './sound';

export type GameState = {
  level: number; x: number; y: number; vx: number; vy: number; grounded: boolean;
  hits: number; collected: number; total: number; finished: boolean; paused: boolean; jumps: number;
};
type Opts = {
  level?: number;
  reduceMotion: boolean;
  onLevelEnd: (s: GameState) => void;
  onStatus: (msg: string) => void;
};

const STEP = 1 / 120; // fixed physics step; render at display rate
const ART = 0.5; // art px per world px
const snap = (v: number) => Math.round(v * ART) / ART;

export function start(canvas: HTMLCanvasElement, opts: Opts) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = VIEW_W * ART;
  canvas.height = VIEW_H * ART;
  ctx.imageSmoothingEnabled = false;
  const hero = playerFrames();
  const petSprite = pet();
  const assist = () => (window as unknown as { __gameAssist?: { invuln?: boolean } }).__gameAssist ?? {};

  // Player hitbox is narrower than the 32×48 sprite cell.
  const PW = 20, PH = 44;
  const p = { x: 0, y: 0, vx: 0, vy: 0, grounded: false, face: 1, heldFor: 0, coyote: 0, buffer: 0, jumpHeld: false, rising: false, invuln: 0, squash: 0, run: 0, hurtT: 0 };
  const s: GameState = { level: 0, x: 0, y: 0, vx: 0, vy: 0, grounded: false, hits: 0, collected: 0, total: 0, finished: false, paused: false, jumps: 0 };

  // ---- per-level state
  let lvl = parse(LEVELS[0].rows);
  let theme: Theme = THEMES.desk();
  let items: { x: number; y: number; kind: 'o' | '^' | 'C' | 'F'; taken?: boolean }[] = [];
  let checkpoint = { x: 0, y: 0 };
  let movers: { x: number; w: number; baseY: number; i: number; px: number; pw: number; y: number; prevY: number }[] = [];
  let hazards: { kind: 'S' | 'T' | 'N'; i: number; ox: number; oy: number; x: number; y: number; w: number; h: number; t: number }[] = [];
  let riding: (typeof movers)[number] | null = null;
  let clock = 0, cam = 0, shake = 0, endT = 0;
  const parts: { x: number; y: number; vx: number; vy: number; life: number; c: string }[] = [];

  function loadLevel(n: number) {
    s.level = n;
    lvl = parse(LEVELS[n].rows);
    theme = THEMES[LEVELS[n].theme]();
    items = lvl.items.map((i) => ({ ...i }));
    s.total = items.filter((i) => i.kind === 'o').length;
    s.collected = 0; s.hits = 0; s.finished = false; endT = 0; clock = 0;
    movers = lvl.movers.map((m) => ({ ...m, px: m.x * TILE, pw: m.w * TILE, y: m.baseY * TILE, prevY: m.baseY * TILE }));
    hazards = lvl.hazards.map((h) => {
      const size = h.kind === 'S' ? [24, 24] : h.kind === 'T' ? [32, 32] : [36, 22];
      return { kind: h.kind, i: h.i, ox: h.x * TILE, oy: h.y * TILE, x: h.x * TILE, y: h.y * TILE, w: size[0], h: size[1], t: h.i * 0.9 };
    });
    checkpoint = { x: lvl.spawn.x * TILE + (TILE - PW) / 2, y: (lvl.spawn.y + 1) * TILE - PH };
    respawn(); p.invuln = 0;
    cam = 0;
    opts.onStatus(`Level ${n + 1} of ${LEVELS.length}.`);
    resume();
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
  const GAME_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'a', 'd', 'w', 'A', 'D', 'W']);
  const isJumpKey = (k: string) => k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W';
  const onKey = (e: KeyboardEvent, down: boolean) => {
    if (e.key === 'Escape' && down) { setPaused(!s.paused); e.preventDefault(); return; }
    if (!GAME_KEYS.has(e.key)) return;
    e.preventDefault();
    if (down) { if (!keys.has(e.key) && isJumpKey(e.key)) p.buffer = T.buffer; keys.add(e.key); }
    else keys.delete(e.key);
  };
  const kd = (e: KeyboardEvent) => onKey(e, true);
  const ku = (e: KeyboardEvent) => onKey(e, false);
  canvas.addEventListener('keydown', kd);
  canvas.addEventListener('keyup', ku);
  const blur = () => { keys.clear(); setPaused(true); };
  canvas.addEventListener('blur', blur);
  const vis = () => { if (document.hidden) setPaused(true); };
  document.addEventListener('visibilitychange', vis);
  const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) setPaused(true); }, { threshold: 0.25 });
  io.observe(canvas);
  const wake = () => { canvas.focus(); setPaused(false); };
  const onFocus = () => setPaused(false);
  canvas.addEventListener('pointerdown', wake);
  canvas.addEventListener('focus', onFocus);

  function setPaused(v: boolean) {
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
  const oneWayAt = (tx: number, ty: number) => lvl.tiles[ty]?.[tx] === '=';
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
      opts.onStatus('Three hits. This level starts again.');
      loadLevel(s.level);
    }
  }
  function respawn() { p.x = checkpoint.x; p.y = checkpoint.y; p.vx = 0; p.vy = 0; p.invuln = 0.6; riding = null; }

  function step(dt: number) {
    clock += dt;
    if (s.finished) { endT += dt; p.vx = 0; return; }
    for (const m of movers) { m.prevY = m.y; m.y = m.baseY * TILE - AMP * price(clock + m.i * 0.7); }
    if (riding && p.vy >= 0 && p.x + PW > riding.px && p.x < riding.px + riding.pw) p.y = riding.y - PH;
    else riding = null;

    const { dir, jump } = input();
    p.heldFor = dir ? p.heldFor + dt : 0;
    const max = p.heldFor > T.runAfter ? T.runSpeed : T.walkSpeed;
    const air = p.grounded ? 1 : T.airMult;
    if (dir) {
      const reversing = Math.sign(p.vx) === -dir && p.vx !== 0;
      const a = (reversing ? T.turnAccel : T.accel) * air;
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
      const bonus = 1 + T.speedJumpBonus * Math.min(1, Math.abs(p.vx) / T.runSpeed);
      p.vy = -T.jumpSpeed * bonus;
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

    if (p.y > VIEW_H + 80) respawn(); // fell out: back to the last checkpoint

    // items
    p.invuln = Math.max(0, p.invuln - dt);
    p.hurtT = Math.max(0, p.hurtT - dt);
    for (const it of items) {
      if (it.taken) continue;
      const ix = it.x * TILE, iy = it.y * TILE;
      const pad = it.kind === '^' ? 6 : 0;
      // Checkpoints trigger on passing them, even mid-jump, not only on touch.
      if (it.kind === 'C') { if (p.x >= ix && checkpoint.x < ix) checkpoint = { x: ix + (TILE - PW) / 2, y: iy + TILE - PH }; continue; }
      if (!overlap(ix + pad, iy + pad * 2, TILE - pad * 2, TILE - pad * 2)) continue;
      if (it.kind === 'o') { it.taken = true; s.collected++; sfx.collect(); puff(ix + TILE / 2, iy + TILE / 2, 8, '#f3a414', 140); }
      else if (it.kind === '^') hurt(ix + TILE / 2);
      else if (it.kind === 'F' && !s.finished) {
        s.finished = true; endT = 0; sfx.finish();
        opts.onStatus(s.collected >= s.total ? `Level ${s.level + 1} done, with everything collected. Shipped.` : `Level ${s.level + 1} done, ${s.collected} of ${s.total} collected.`);
        const done = { ...s };
        setTimeout(() => opts.onLevelEnd(done), opts.reduceMotion ? 200 : 1300);
      }
    }

    // hazards
    for (const h of hazards) {
      h.t += dt;
      if (h.kind === 'S') {
        // a spreadsheet drops from the top on a 2.6 s rhythm
        const cyc = h.t % 2.6;
        h.x = h.ox + 4; h.y = cyc < 0.5 ? -60 : -40 + 0.5 * 900 * (cyc - 0.5) ** 2;
      } else if (h.kind === 'T') {
        h.x = h.ox + Math.sin(h.t * 1.4) * 70; h.y = h.oy;
      } else {
        h.x = h.ox + Math.cos(h.t * 1.8) * 44 - 2; h.y = h.oy + Math.sin(h.t * 1.8) * 30;
      }
      if (overlap(h.x + 3, h.y + 3, h.w - 6, h.h - 6)) hurt(h.x + h.w / 2);
    }

    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i];
      q.life -= dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 600 * dt;
      if (q.life <= 0) parts.splice(i, 1);
    }
    p.squash *= Math.pow(0.0001, dt);
    shake = Math.max(0, shake - dt * 30);

    // camera: follow with ~20% look-ahead, clamped to the level
    const target = p.x + PW / 2 - VIEW_W * 0.4 + p.face * VIEW_W * 0.1;
    const clamped = Math.max(0, Math.min(lvl.w * TILE - VIEW_W, target));
    cam = opts.reduceMotion ? clamped : cam + (clamped - cam) * Math.min(1, dt * 6);

    Object.assign(s, { x: p.x, y: p.y, vx: p.vx, vy: p.vy, grounded: p.grounded });
  }

  // ---- render
  const W = (im: HTMLCanvasElement, x: number, y: number) => ctx.drawImage(im, snap(x), snap(y), im.width / ART, im.height / ART);
  function draw() {
    ctx.save();
    ctx.scale(ART, ART);
    ctx.fillStyle = theme.sky; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    // parallax (static under reduced motion)
    const par = (im: HTMLCanvasElement, k: number) => {
      const o = opts.reduceMotion ? 0 : -((cam * k) % VIEW_W);
      ctx.drawImage(im, snap(o), 0, VIEW_W, VIEW_H);
      ctx.drawImage(im, snap(o + VIEW_W), 0, VIEW_W, VIEW_H);
    };
    par(theme.far, 0.2); par(theme.near, 0.5);

    const sx = shake ? (Math.random() - 0.5) * shake : 0;
    ctx.translate(snap(-cam + sx), 0);
    const x0 = Math.floor(cam / TILE) - 1, x1 = x0 + VIEW_W / TILE + 3;
    for (let ty = 0; ty < lvl.h; ty++)
      for (let tx = x0; tx < x1; tx++) {
        const t = lvl.tiles[ty]?.[tx];
        if (t === '#') W(lvl.tiles[ty - 1]?.[tx] === '#' ? theme.fill : theme.ground, tx * TILE, ty * TILE);
        else if (t === '=') W(theme.platform, tx * TILE, ty * TILE);
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
      for (const m of movers) for (let k = 0; k < m.w; k++) W(theme.platform, m.px + k * TILE, m.y);
    }
    const bob = opts.reduceMotion ? 0 : Math.round(Math.sin(clock * 4) * 2);
    for (const it of items) {
      if (it.taken) continue;
      const ix = it.x * TILE, iy = it.y * TILE;
      if (it.kind === 'o') { const im = theme.pickup[0]; W(im, ix + TILE / 2 - im.width, iy + TILE / 2 - im.height + bob); }
      else if (it.kind === '^') W(theme.spike, ix, iy + TILE - theme.spike.height / ART);
      else if (it.kind === 'C') W(theme.check, ix + TILE / 2 - theme.check.width, iy + TILE - theme.check.height / ART);
      else if (it.kind === 'F') {
        const im = theme.finish;
        W(im, ix + TILE / 2 - im.width, iy + TILE - im.height / ART);
        // Bedtime: the egg hatches into this week's pet
        if (theme.id === 'bedtime' && s.finished && endT > 0.4) W(petSprite, ix + TILE / 2 - petSprite.width, iy + TILE - im.height / ART - petSprite.height / ART - (opts.reduceMotion ? 0 : Math.min(16, endT * 30)));
      }
    }
    for (const h of hazards) if (h.y > -60) W(theme.hazard, h.x, h.y);
    // player
    const fr = p.face >= 0 ? hero.right : hero.left;
    let im = fr.idle[Math.floor(clock * 2) % 2];
    if (s.finished) im = fr.cheer[Math.floor(endT * 4) % 2];
    else if (p.hurtT > 0) im = fr.hurt[0];
    else if (!p.grounded) im = p.vy < 0 ? fr.jump[0] : fr.fall[0];
    else if (Math.abs(p.vx) > 20) im = fr.run[Math.floor(p.run) % 6];
    if (!(p.invuln > 0 && p.hurtT === 0 && Math.floor(p.invuln * 12) % 2)) {
      const sq = p.squash, w = 32 * (1 + sq), hh = 48 * (1 - sq);
      ctx.drawImage(p.hurtT > 0.25 ? hero.flash : im, snap(p.x + PW / 2 - w / 2), snap(p.y + PH - hh), snap(w), snap(hh));
    }
    for (const q of parts) { ctx.globalAlpha = Math.max(0, q.life / 0.35); ctx.fillStyle = q.c; ctx.fillRect(snap(q.x), snap(q.y), 4, 4); }
    ctx.globalAlpha = 1;
    ctx.restore();

    // HUD in the pixel font, at art resolution
    text(ctx, `${s.collected}/${s.total}`, 8, 8, theme.hud, 2);
    for (let i = 0; i < T.maxHits; i++) { ctx.fillStyle = i < T.maxHits - s.hits ? theme.hud : 'rgba(127,127,127,.35)'; ctx.fillRect(canvas.width - 14 - i * 10, 8, 6, 6); }
    text(ctx, `LV ${s.level + 1}/${LEVELS.length}`, canvas.width / 2 - 26, 8, theme.hud, 2);
    if (s.paused) {
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      text(ctx, 'PAUSED', canvas.width / 2 - 36, canvas.height / 2 - 8, '#ffffff', 3);
    }
  }

  // ---- loop: fixed timestep; stops entirely while paused, offscreen or between levels
  let last = 0, acc = 0, raf = 0;
  function frame(now: number) {
    if (s.paused) { draw(); raf = 0; return; }
    acc += Math.min(0.1, (now - last) / 1000);
    last = now;
    while (acc >= STEP) { step(STEP); acc -= STEP; }
    draw();
    raf = s.finished && endT > 2 ? 0 : requestAnimationFrame(frame);
  }
  function resume() {
    if (raf || s.paused) return;
    last = performance.now(); acc = 0;
    raf = requestAnimationFrame(frame);
  }

  loadLevel(Math.max(0, Math.min(LEVELS.length - 1, opts.level ?? 0)));
  canvas.focus();

  return {
    state: () => ({ ...s }),
    touch,
    levels: LEVELS.length,
    loadLevel: (n: number) => { canvas.focus(); loadLevel(n); },
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
