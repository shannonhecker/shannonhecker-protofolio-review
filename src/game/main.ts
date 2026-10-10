// The game chunk. Loaded only when someone presses Play (see game-loader.ts).
// Hand-written canvas loop: ~a few KB instead of Phaser's ~370 KB gzipped.
import { T, TILE, VIEW_W, VIEW_H } from './tuning';
import { LEVEL, parse } from './level';
import { sfx } from './sound';
export { setSound } from './sound';

type Item = { x: number; y: number; kind: 'o' | '^' | 'C' | 'F'; taken?: boolean };
export type GameState = {
  x: number; y: number; vx: number; vy: number; grounded: boolean;
  hits: number; collected: number; total: number; finished: boolean; paused: boolean; jumps: number;
};

const STEP = 1 / 120; // fixed physics step; render at display rate

export function start(canvas: HTMLCanvasElement, opts: { reduceMotion: boolean; onFinish: (s: GameState) => void; onStatus: (msg: string) => void }) {
  const ctx = canvas.getContext('2d')!;
  const lvl = parse(LEVEL);
  const items: Item[] = lvl.items.map((i) => ({ ...i }));
  const total = items.filter((i) => i.kind === 'o').length;
  const css = getComputedStyle(document.documentElement);
  const col = {
    ink: css.getPropertyValue('--fg').trim() || '#161616',
    grey: css.getPropertyValue('--fg-2').trim() || '#6b6b6b',
    hair: css.getPropertyValue('--hair').trim() || '#e6e6e4',
    bg: css.getPropertyValue('--bg').trim() || '#ffffff',
    bg2: css.getPropertyValue('--bg-2').trim() || '#f5f5f4',
    star: css.getPropertyValue('--ws-star').trim() || '#f3a414',
  };

  // Player hitbox is narrower than the 32×48 sprite cell.
  const PW = 20, PH = 44;
  let checkpoint = { x: lvl.spawn.x * TILE + (TILE - PW) / 2, y: (lvl.spawn.y + 1) * TILE - PH };
  const p = { x: checkpoint.x, y: checkpoint.y, vx: 0, vy: 0, grounded: false, face: 1, heldFor: 0, coyote: 0, buffer: 0, jumpHeld: false, rising: false, invuln: 0, squash: 0 };
  const s: GameState = { x: 0, y: 0, vx: 0, vy: 0, grounded: false, hits: 0, collected: 0, total, finished: false, paused: false, jumps: 0 };
  let cam = 0;
  let shake = 0;
  let last = 0, acc = 0, raf = 0;

  // ---- input: captured only while the canvas has focus, so the page never
  // loses its arrow keys or space bar, and Tab always leaves (no focus trap).
  const keys = new Set<string>();
  const touch = { left: false, right: false, jump: false };
  const GAME_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'a', 'd', 'w', 'A', 'D', 'W']);
  const onKey = (e: KeyboardEvent, down: boolean) => {
    if (e.key === 'Escape' && down) { setPaused(!s.paused); e.preventDefault(); return; }
    if (!GAME_KEYS.has(e.key)) return;
    e.preventDefault();
    if (down) {
      if (!keys.has(e.key) && isJumpKey(e.key)) p.buffer = T.buffer;
      keys.add(e.key);
    } else keys.delete(e.key);
  };
  const isJumpKey = (k: string) => k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W';
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

  function setPaused(v: boolean) {
    if (s.finished || s.paused === v) return;
    s.paused = v;
    opts.onStatus(v ? 'Paused. Press Escape or click the game to carry on.' : 'Playing.');
    if (!v) resume();
  }
  canvas.addEventListener('pointerdown', () => { canvas.focus(); setPaused(false); });
  canvas.addEventListener('focus', () => setPaused(false));

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
    // A fresh press from any source (touch, gamepad) arms the jump buffer.
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

  function hurt(fromX: number) {
    if (p.invuln > 0) return;
    s.hits++;
    sfx.hit();
    p.invuln = T.invuln;
    p.vx = (p.x + PW / 2 < fromX ? -1 : 1) * T.hitKnockX;
    p.vy = -T.hitKnockY;
    if (!opts.reduceMotion) shake = 6;
    if (s.hits >= T.maxHits) {
      // Brief: three hits restart the level. No lives, no game-over screen.
      s.hits = 0; s.collected = 0;
      items.forEach((i) => (i.taken = false));
      checkpoint = { x: lvl.spawn.x * TILE + (TILE - PW) / 2, y: (lvl.spawn.y + 1) * TILE - PH };
      respawn();
      opts.onStatus('Three hits. Back to the start.');
    }
  }
  function respawn() {
    p.x = checkpoint.x; p.y = checkpoint.y; p.vx = 0; p.vy = 0; p.invuln = 0.6;
  }

  function step(dt: number) {
    const { dir, jump } = input();
    // horizontal: accelerate toward target, brake harder when reversing
    p.heldFor = dir ? p.heldFor + dt : 0;
    const max = p.heldFor > T.runAfter ? T.runSpeed : T.walkSpeed;
    const air = p.grounded ? 1 : T.airMult;
    if (dir) {
      const reversing = Math.sign(p.vx) === -dir && p.vx !== 0;
      const a = (reversing ? T.turnAccel : T.accel) * air;
      if (dir * p.vx < max) p.vx = dir * Math.min(max, dir * p.vx + a * dt);
      // Above the cap (e.g. after knockback) bleed off speed, never add to it.
      else p.vx = dir * Math.max(max, dir * p.vx - T.friction * dt);
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
      p.buffer = 0; p.coyote = 0; p.grounded = false; p.rising = true; s.jumps++;
      sfx.jump();
      p.squash = opts.reduceMotion ? 0 : -0.14;
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

    // move Y (with upward corner correction and one-way platforms)
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
      if (land) {
        p.y = row * TILE - PH; p.vy = 0; p.grounded = true;
        if (!wasGrounded && !opts.reduceMotion) p.squash = 0.12;
      } else p.y = ny;
    } else p.y = ny;

    // fell out of the world: back to the last checkpoint, no penalty beyond time
    if (p.y > VIEW_H + 80) respawn();

    // items
    p.invuln = Math.max(0, p.invuln - dt);
    for (const it of items) {
      if (it.taken) continue;
      const ix = it.x * TILE, iy = it.y * TILE;
      const pad = it.kind === '^' ? 6 : 0;
      const over = p.x < ix + TILE - pad && p.x + PW > ix + pad && p.y < iy + TILE && p.y + PH > iy + pad * 2;
      if (!over) continue;
      if (it.kind === 'o') { it.taken = true; s.collected++; sfx.collect(); }
      else if (it.kind === '^') hurt(ix + TILE / 2);
      else if (it.kind === 'C') { checkpoint = { x: ix + (TILE - PW) / 2, y: iy + TILE - PH }; }
      else if (it.kind === 'F' && !s.finished) { s.finished = true; sfx.finish(); opts.onFinish({ ...s }); }
    }

    p.squash *= Math.pow(0.0001, dt); // ease back to 0 in ~100ms
    shake = Math.max(0, shake - dt * 30);

    // camera: follow with ~20% look-ahead, clamped to the level
    const target = p.x + PW / 2 - VIEW_W * 0.4 + p.face * VIEW_W * 0.1;
    const levelW = lvl.w * TILE;
    const clamped = Math.max(0, Math.min(levelW - VIEW_W, target));
    cam = opts.reduceMotion ? clamped : cam + (clamped - cam) * Math.min(1, dt * 6);

    Object.assign(s, { x: p.x, y: p.y, vx: p.vx, vy: p.vy, grounded: p.grounded });
  }

  // ---- render: flat shapes in the site's own tokens (greybox, art comes later)
  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = VIEW_W * dpr; canvas.height = VIEW_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener('resize', resize);

  function draw() {
    const sx = shake ? (Math.random() - 0.5) * shake : 0;
    ctx.fillStyle = col.bg; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.save();
    ctx.translate(Math.round(-cam + sx), 0);
    const x0 = Math.floor(cam / TILE) - 1, x1 = x0 + VIEW_W / TILE + 3;
    for (let ty = 0; ty < lvl.h; ty++)
      for (let tx = x0; tx < x1; tx++) {
        const t = lvl.tiles[ty]?.[tx];
        if (t === '#') {
          ctx.fillStyle = lvl.tiles[ty - 1]?.[tx] === '#' ? col.bg2 : col.ink;
          ctx.fillRect(tx * TILE, ty * TILE, TILE, TILE);
          if (lvl.tiles[ty - 1]?.[tx] !== '#') { ctx.fillStyle = col.bg2; ctx.fillRect(tx * TILE, ty * TILE + 4, TILE, TILE - 4); }
        } else if (t === '=') {
          ctx.fillStyle = col.ink; ctx.fillRect(tx * TILE, ty * TILE, TILE, 4);
        }
      }
    for (const it of items) {
      if (it.taken) continue;
      const cx = it.x * TILE + TILE / 2, cy = it.y * TILE + TILE / 2;
      if (it.kind === 'o') { ctx.fillStyle = col.star; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill(); }
      else if (it.kind === '^') { ctx.fillStyle = col.ink; ctx.beginPath(); ctx.moveTo(it.x * TILE + 4, (it.y + 1) * TILE); ctx.lineTo(cx, it.y * TILE + 10); ctx.lineTo((it.x + 1) * TILE - 4, (it.y + 1) * TILE); ctx.fill(); }
      else if (it.kind === 'C') { ctx.fillStyle = col.hair; ctx.fillRect(cx - 1, it.y * TILE - 16, 2, TILE + 16); }
      else if (it.kind === 'F') { ctx.fillStyle = col.ink; ctx.fillRect(it.x * TILE + 4, it.y * TILE - 24, TILE - 8, TILE + 24); }
    }
    // player: 32×48 cell, stand-in shape until the sprite sheet exists
    if (!(p.invuln > 0 && Math.floor(p.invuln * 12) % 2)) {
      const sq = p.squash, w = 32 * (1 + sq), h = 48 * (1 - sq);
      const px = p.x + PW / 2 - w / 2, py = p.y + PH - h;
      ctx.fillStyle = col.ink;
      ctx.beginPath(); ctx.roundRect(px, py, w, h, 10); ctx.fill();
      ctx.fillStyle = col.bg;
      ctx.fillRect(px + w / 2 + p.face * 6 - 2, py + 12, 4, 6);
    }
    ctx.restore();
    // HUD, scaled up when the canvas is shown small so it stays ~13px+ on a phone
    const k = Math.min(2.6, Math.max(1, (VIEW_W / (canvas.clientWidth || VIEW_W)) * 0.85));
    ctx.fillStyle = col.grey; ctx.font = `600 ${Math.round(16 * k)}px Inter, system-ui, sans-serif`;
    ctx.fillText(`${s.collected} / ${total}`, 20 * k, 32 * k);
    for (let i = 0; i < T.maxHits; i++) {
      ctx.fillStyle = i < T.maxHits - s.hits ? col.ink : col.hair;
      ctx.beginPath(); ctx.arc(VIEW_W - (24 + i * 18) * k, 26 * k, 5 * k, 0, Math.PI * 2); ctx.fill();
    }
    if (s.paused) {
      ctx.fillStyle = 'rgba(255,255,255,.72)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.fillStyle = col.ink; ctx.font = '700 40px "Inter Tight", Inter, system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Paused', VIEW_W / 2, VIEW_H / 2); ctx.textAlign = 'start';
    }
  }

  // ---- loop: fixed timestep. It stops entirely (no rAF at all) while paused,
  // offscreen or finished, so an idle game costs the page nothing.
  function frame(now: number) {
    if (s.paused || s.finished) { draw(); raf = 0; return; }
    acc += Math.min(0.1, (now - last) / 1000);
    last = now;
    while (acc >= STEP) { step(STEP); acc -= STEP; }
    draw();
    raf = requestAnimationFrame(frame);
  }
  function resume() {
    if (raf || s.paused || s.finished) return;
    last = performance.now(); acc = 0;
    raf = requestAnimationFrame(frame);
  }
  resume();
  canvas.focus();

  return {
    state: () => ({ ...s }),
    touch,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
    destroy() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('keydown', kd); canvas.removeEventListener('keyup', ku);
      canvas.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', vis);
      removeEventListener('resize', resize);
      io.disconnect();
    },
  };
}
