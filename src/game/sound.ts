// Original synthesised sounds (no samples, no borrowed tunes). Off by default;
// the page's Sound toggle switches it on. One shared AudioContext, created on
// the first user gesture as browsers require.
let ac: AudioContext | null = null;
export let soundOn = false;
export function setSound(v: boolean) {
  soundOn = v;
  if (v && !ac) ac = new AudioContext();
  if (v) void ac?.resume();
  syncMusic();
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
  power: () => [659,880,988,1319].forEach((f,i)=>tone(f,.15,'square',.045,undefined,i*.07)),
  stomp: () => tone(523, 0.1, 'square', 0.05, 196),
  hit: () => tone(220, 0.22, 'sawtooth', 0.05, 110),
  finish: () => [587, 740, 880, 1175].forEach((f, i) => tone(f, i === 3 ? 0.36 : 0.12, 'square', 0.05, undefined, i * 0.11)),
};

// Original eight-bar chiptune. A low melody and bass leave room for the effects.
let musicAllowed=false, power=false, timer:ReturnType<typeof setInterval>|undefined;
let nextNote=0, beat=0;
const voices=new Set<OscillatorNode>();
const melody=[62,66,69,74,71,69,66,64,62,66,69,71,69,66,64,57,59,62,66,69,67,66,62,59,57,61,64,69,67,64,61,57];
function musicNote(midi:number,when:number,duration:number,volume:number,type:OscillatorType){
 if(!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=440*2**((midi-69)/12);
 g.gain.setValueAtTime(0,when);g.gain.linearRampToValueAtTime(volume,when+.008);g.gain.exponentialRampToValueAtTime(.0001,when+duration);
 o.connect(g).connect(ac.destination);voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};o.start(when);o.stop(when+duration+.02);
}
function stopMusic(){if(timer)clearInterval(timer);timer=undefined;voices.forEach(v=>{try{v.stop();}catch{}});voices.clear();}
function syncMusic(){
 if(!soundOn||!musicAllowed||document.hidden||!ac){stopMusic();return;}
 if(timer)return;nextNote=ac.currentTime;const schedule=()=>{
  if(!ac)return;while(nextNote<ac.currentTime+.18){const step=60/(power?152:108)/2;
   musicNote(melody[beat%melody.length]+(power?12:0),nextNote,step*.8,.022,'square');
   if(beat%2===0)musicNote([38,38,35,33][Math.floor(beat/8)%4],nextNote,step*1.5,.035,'triangle');
   beat++;nextNote+=step;
  }
 };schedule();timer=setInterval(schedule,90);
}
export function setMusicPlaying(on:boolean){musicAllowed=on;syncMusic();}
export function setPowerMusic(on:boolean){power=on;}
export function audioState(){return {enabled:soundOn,playing:!!timer,power,voices:voices.size};}
document.addEventListener('visibilitychange',syncMusic);
