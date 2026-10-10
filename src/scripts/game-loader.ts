// Loads the game chunk only when someone presses Play. If the chunk fails,
// the poster stays and the rest of the page is untouched. Pressing Play opens
// the world map; a case page's "Play this case as a level" link (?level=n)
// starts that world directly. Between worlds a card states the facts and
// links to the case.
const root = document.querySelector<HTMLElement>('.play .game');
const canvas = document.getElementById('game') as HTMLCanvasElement | null;
const play = document.getElementById('game-play') as HTMLButtonElement | null;
const statusEl = document.getElementById('game-status');
const picker = document.getElementById('game-world') as HTMLSelectElement | null;
const ends = Array.from(document.querySelectorAll<HTMLElement>('.game-end'));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

type Game = ReturnType<typeof import('../game/main').start>;
let game: Game | null = null;
let soundOn = false;
const param = new URLSearchParams(location.search).get('level');
const fromCase = param !== null;
let chosen = Math.max(0, Math.min(ends.length - 1, (Number(param ?? '1') || 1) - 1));
if (picker) picker.value = String(chosen);

type Mission = { text: string; have: number; need: number; done: boolean };
function showEnd(n: number | null, shipped = false, mission?: Mission) {
  ends.forEach((e, i) => {
    e.hidden = i !== n;
    const badge = e.querySelector<HTMLElement>('.game-badge');
    if (badge) badge.hidden = !(i === n && shipped);
    const m = e.querySelector<HTMLElement>('.game-mission');
    if (m && i === n && mission) {
      m.hidden = false;
      m.dataset.done = String(mission.done);
      m.textContent = mission.done ? `★ Mission complete: ${mission.text}.` : `Mission: ${mission.text}. ${mission.need > 1 ? `${mission.have} of ${mission.need} this time.` : 'Not this time.'}`;
    }
  });
  if (n !== null) ends[n]?.querySelector<HTMLElement>('[data-next]')?.focus();
}

async function boot(level: number, toMap: boolean) {
  if (!root || !canvas) return;
  if (play) play.disabled = true;
  try {
    const mod = await import('../game/main');
    showEnd(null);
    root.dataset.state = 'playing';
    canvas.tabIndex = 0;
    chosen = level;
    if (picker) picker.value = String(level);
    if (game) (toMap ? game.showMap(level) : game.loadLevel(level));
    else {
      game = mod.start(canvas, {
        level,
        startOnMap: toMap,
        reduceMotion,
        onStatus: (m) => { if (statusEl) statusEl.textContent = m; },
        onLevelEnd: (s) => { showEnd(s.level, s.collected >= s.total, s.mission); },
        onMapSelect: (n) => { chosen = n; if (picker) picker.value = String(n); },
      });
      (window as unknown as { __game?: () => unknown }).__game = () => game?.state();
    }
    mod.setSound(soundOn);
  } catch {
    root.dataset.state = 'poster';
  } finally {
    if (play) play.disabled = false;
  }
}
play?.addEventListener('click', () => boot(chosen, !fromCase));
// Choosing a world starts it, before or after Play has been pressed.
picker?.addEventListener('change', () => { chosen = Number(picker.value); boot(chosen, false); });
document.querySelectorAll<HTMLButtonElement>('.game-end [data-next]').forEach((b) =>
  b.addEventListener('click', () => boot(Number(b.dataset.next), false)),
);
document.querySelectorAll<HTMLButtonElement>('.game-end [data-map]').forEach((b) =>
  b.addEventListener('click', () => boot(Math.min(ends.length - 1, chosen + 1), true)),
);

// Sound: off by default, one toggle (brief).
const soundBtn = document.getElementById('game-sound') as HTMLButtonElement | null;
soundBtn?.addEventListener('click', async () => {
  soundOn = !soundOn;
  soundBtn.setAttribute('aria-pressed', String(soundOn));
  if (game) { (await import('../game/main')).setSound(soundOn); canvas?.focus(); }
});

// Touch: three on-screen buttons, pointer-driven so multi-touch works.
document.querySelectorAll<HTMLButtonElement>('.game-touch button').forEach((b) => {
  const k = b.dataset.k as 'left' | 'right' | 'jump';
  // keep focus on the canvas, so a tap never reads as leaving the game
  const set = (v: boolean) => (e: Event) => { e.preventDefault(); if (game) game.touch[k] = v; if (v) canvas?.focus({ preventScroll: true }); };
  b.addEventListener('mousedown', (e) => e.preventDefault());
  b.addEventListener('pointerdown', set(true));
  b.addEventListener('pointerup', set(false));
  b.addEventListener('pointercancel', set(false));
  b.addEventListener('pointerleave', set(false));
});

export {};
