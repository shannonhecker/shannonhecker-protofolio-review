import { startScore, endScore } from './leaderboard';
import { track } from './analytics';
// Loads the game chunk only when someone presses Play. If the chunk fails,
// the poster stays and the rest of the page is untouched. Pressing Play opens
// the world map; a case page's "Play this case as a level" link (?level=n)
// starts that world directly. Between worlds a card states the facts and
// links to the case.
const root = document.querySelector<HTMLElement>('.play .game');
const canvas = document.getElementById('game') as HTMLCanvasElement | null;
const play = document.getElementById('game-play') as HTMLButtonElement | null;
const statusEl = document.getElementById('game-status');
const mapButton = document.getElementById('game-world');
const stageNav = document.querySelector<HTMLElement>('.game-stages');
const stageButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-stage]'));
function syncStage(n:number){
  stageButtons.forEach(button=>button.setAttribute('aria-current',String(Number(button.dataset.stage)===n)));
  mapButton?.setAttribute('data-stage',String(n));
}
const ends = Array.from(document.querySelectorAll<HTMLElement>('.game-end'));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

type Game = ReturnType<typeof import('../game/main').start>;
let game: Game | null = null;
let musicControl: ((on:boolean)=>void) | undefined;
let bootSequence = 0;
let soundOn = false;
const param = new URLSearchParams(location.search).get('level');
const fromCase = param !== null;
let chosen = Math.max(0, Math.min(ends.length - 1, (Number(param ?? '1') || 1) - 1));
syncStage(chosen);

type Mission = { text: string; have: number; need: number; done: boolean };
function showEnd(n: number | null, shipped = false, mission?: Mission) {
  if (root) root.dataset.result = String(n !== null);
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
  const sequence = ++bootSequence;
  if (play) play.disabled = true;
  try {
    const mod = await import('../game/main');
    musicControl=mod.setMusicPlaying;
    if (statusEl) statusEl.textContent = 'Preparing your adventure…';
    await mod.prepareArt();
    if (sequence !== bootSequence) return;
    showEnd(null);
    root.dataset.state = 'playing';
    if(stageNav)stageNav.hidden=!toMap;
    canvas.tabIndex = 0;
    chosen = level;
    syncStage(level);
    if (game) (toMap ? game.showMap(level) : game.loadLevel(level));
    else {
      game = mod.start(canvas, {
        level,
        startOnMap: toMap,
        reduceMotion,
        onStatus: (m) => { if (statusEl) statusEl.textContent = m; },
        onLevelStart: (n) => { if(stageNav)stageNav.hidden=true; syncStage(n); showEnd(null); startScore(n); },
        onLevelEnd: (s) => { showEnd(s.level, s.collected >= s.total, s.mission); void endScore(s, ends[s.level]); },
        onMapSelect: (n) => { chosen = n; syncStage(n); },
      });
      (window as unknown as { __game?: () => unknown }).__game = () => game?.state();
    }
    mod.setSound(soundOn);
  } catch {
    root.dataset.state = 'poster';
  } finally {
    if (play && sequence === bootSequence) play.disabled = false;
  }
}
// ---- full screen: Play opens it; Escape or the Exit button always leaves.
// Real full screen where the browser allows it; a fixed overlay otherwise.
const box = document.querySelector<HTMLElement>('.play');
const exitBtn = document.getElementById('game-exit') as HTMLButtonElement | null;
const fullBtn = document.getElementById('game-full') as HTMLButtonElement | null;
let full = false;
let fullscreenChanges=0;
let fullscreenQueue=Promise.resolve();
function changeNativeFullscreen(action:()=>Promise<void>){
  fullscreenChanges++;
  fullscreenQueue=fullscreenQueue.then(action).catch(()=>{}).finally(()=>{fullscreenChanges--;});
}
function setFull(on: boolean) {
  full = on;
  box?.classList.toggle('is-full', on);
  document.documentElement.classList.toggle('game-is-full', on);
  if (exitBtn) exitBtn.hidden = !on;
  if (on) { canvas?.focus({ preventScroll: true }); game?.resume(); musicControl?.(true); }
  else { musicControl?.(false); if ((game?.state() as { mode?: string } | undefined)?.mode === 'level') game?.pause(); box?.scrollIntoView({ block: 'center' }); }
}
function enterFull() {
  if (!box || full) return;
  setFull(true);
  // must run inside the click that asked for it; a refusal keeps the overlay
  if (document.fullscreenEnabled) changeNativeFullscreen(async()=>{if(!document.fullscreenElement && full) await box.requestFullscreen?.();});
}
function exitFull() {
  if (!full) return;
  changeNativeFullscreen(async()=>{if(document.fullscreenElement) await document.exitFullscreen();});
  track('game_exit', { stage: game?.state().level ?? chosen });
  setFull(false);
  play?.focus({ preventScroll: true });
}
// the browser's own Escape (or its exit gesture) leaves real full screen
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && full && fullscreenChanges===0) setFull(false); });
// in the overlay, Escape leaves too (capture phase: before the game's own pause key)
window.addEventListener('keydown', (e) => { if (full && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); exitFull(); } }, true);
exitBtn?.addEventListener('click', exitFull);
fullBtn?.addEventListener('click', () => { enterFull(); if (!game) boot(chosen, !fromCase); });

play?.addEventListener('click', () => { track('game_start'); enterFull(); boot(chosen, !fromCase); });
mapButton?.addEventListener('click',()=>{enterFull();void boot(chosen,true);});
stageButtons.forEach(button=>button.addEventListener('click',()=>{enterFull();void boot(Number(button.dataset.stage),false);}));
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
  const set = (v: boolean) => (e: Event) => {
    e.preventDefault();
    if (game) game.touch[k] = v;
    if (v) {
      canvas?.focus({ preventScroll: true });
      game?.resume();
    }
  };
  b.addEventListener('mousedown', (e) => e.preventDefault());
  b.addEventListener('pointerdown', set(true));
  b.addEventListener('pointerup', set(false));
  b.addEventListener('pointercancel', set(false));
  b.addEventListener('pointerleave', set(false));
});

export {};
