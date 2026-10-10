// Loads the game chunk only when someone presses Play. If the chunk fails,
// the poster stays and the rest of the page is untouched.
const root = document.querySelector<HTMLElement>('.play .game');
const canvas = document.getElementById('game') as HTMLCanvasElement | null;
const play = document.getElementById('game-play') as HTMLButtonElement | null;
const again = document.getElementById('game-again') as HTMLButtonElement | null;
const end = document.getElementById('game-end');
const badge = document.getElementById('game-badge');
const statusEl = document.getElementById('game-status');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

type Game = Awaited<ReturnType<typeof import('../game/main').start>>;
let game: Game | null = null;

async function boot() {
  if (!root || !canvas || !play) return;
  play.disabled = true;
  try {
    const { start } = await import('../game/main');
    game?.destroy();
    end?.setAttribute('hidden', '');
    root.dataset.state = 'playing';
    canvas.tabIndex = 0;
    game = start(canvas, {
      reduceMotion,
      onStatus: (m) => { if (statusEl) statusEl.textContent = m; },
      onFinish: (s) => {
        if (badge) badge.hidden = s.collected < s.total;
        end?.removeAttribute('hidden');
        if (statusEl) statusEl.textContent = s.collected >= s.total ? 'Order filled, with every fill. Shipped.' : `Order filled, with ${s.collected} of ${s.total} fills.`;
        again?.focus();
      },
    });
    (await import('../game/main')).setSound(soundOn);
    (window as unknown as { __game?: () => unknown }).__game = () => game?.state();
  } catch {
    root.dataset.state = 'poster';
  } finally {
    play.disabled = false;
  }
}
play?.addEventListener('click', boot);

// Sound: off by default, one toggle (brief). The audio module ships in the
// game chunk, so the toggle only records the choice until the game loads.
const soundBtn = document.getElementById('game-sound') as HTMLButtonElement | null;
let soundOn = false;
soundBtn?.addEventListener('click', async () => {
  soundOn = !soundOn;
  soundBtn.setAttribute('aria-pressed', String(soundOn));
  if (game) (await import('../game/main')).setSound(soundOn);
  game ? canvas?.focus() : undefined;
});
again?.addEventListener('click', boot);

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
