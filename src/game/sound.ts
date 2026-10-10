// Original synthesised sounds (no samples, no borrowed tunes). Off by default;
// the page's Sound toggle switches it on. One shared AudioContext, created on
// the first user gesture as browsers require.
let ac: AudioContext | null = null;
export let soundOn = false;
export function setSound(v: boolean) {
  soundOn = v;
  if (v && !ac) ac = new AudioContext();
  if (v) void ac?.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, slideTo?: number, at = 0) {
  if (!soundOn || !ac) return;
  const t = ac.currentTime + at;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ac.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

// A rising fifth for the jump, a two-note "tick" for a collectible (a nod to
// Winking Star's star landing), a soft drop for a hit, and a short
// four-note phrase in D major for the finish.
export const sfx = {
  jump: () => tone(392, 0.12, 'square', 0.05, 587),
  collect: () => { tone(1175, 0.06, 'triangle', 0.07); tone(1568, 0.09, 'triangle', 0.07, undefined, 0.06); },
  stomp: () => tone(523, 0.1, 'square', 0.05, 196),
  hit: () => tone(220, 0.22, 'sawtooth', 0.05, 110),
  finish: () => [587, 740, 880, 1175].forEach((f, i) => tone(f, i === 3 ? 0.36 : 0.12, 'square', 0.05, undefined, i * 0.11)),
};
