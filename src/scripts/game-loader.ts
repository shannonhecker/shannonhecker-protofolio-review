// Loads the game chunk only when someone presses Play. If the chunk fails,
// the poster stays and the rest of the page is untouched. Between levels it
// shows that case's card, so the game hands the reader back to the work.
const root = document.querySelector<HTMLElement>('.play .game');
const canvas = document.getElementById('game') as HTMLCanvasElement | null;
const play = document.getElementById('game-play') as HTMLButtonElement | null;
const statusEl = document.getElementById('game-status');
const levelBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('.game-level'));
const ends = Array.from(document.querySelectorAll<HTMLElement>('.game-end'));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

type Game = ReturnType<typeof import('../game/main').start>;
let game: Game | null = null;
let soundOn = false;
// "Play this level" links from the case pages select a level; they never start it.
let chosen = Math.max(0, Math.min(2, Number(new URLSearchParams(location.search).get('level') ?? '1') - 1 || 0));

function choose(n: number) {
  chosen = n;
  levelBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === n)));
}
choose(chosen);

function showEnd(n: number | null, shipped = false) {
  ends.forEach((e, i) => {
    e.hidden = i !== n;
    const badge = e.querySelector<HTMLElement>('.game-badge');
    if (badge) badge.hidden = !(i === n && shipped);
  });
  if (n !== null) ends[n]?.querySelector<HTMLElement>('[data-next]')?.focus();
}

async function boot(level: number) {
  if (!root || !canvas) return;
  if (play) play.disabled = true;
  try {
    const mod = await import('../game/main');
    showEnd(null);
    root.dataset.state = 'playing';
    canvas.tabIndex = 0;
    choose(level);
    if (game) game.loadLevel(level);
    else {
      game = mod.start(canvas, {
        level,
        reduceMotion,
        onStatus: (m) => { if (statusEl) statusEl.textContent = m; },
        onLevelEnd: (s) => { showEnd(s.level, s.collected >= s.total); },
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
play?.addEventListener('click', () => boot(chosen));
levelBtns.forEach((b, i) => b.addEventListener('click', () => { choose(i); if (game) boot(i); }));
document.querySelectorAll<HTMLButtonElement>('.game-end [data-next]').forEach((b) =>
  b.addEventListener('click', () => boot(Number(b.dataset.next))),
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
  const set = (v: boolean) => (e: Event) => { e.preventDefault(); if (game) game.touch[k] = v; };
  b.addEventListener('pointerdown', set(true));
  b.addEventListener('pointerup', set(false));
  b.addEventListener('pointercancel', set(false));
  b.addEventListener('pointerleave', set(false));
});

export {};
