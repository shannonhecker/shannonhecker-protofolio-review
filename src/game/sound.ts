// Original synthesised sounds (no samples, no borrowed tunes). Off by default;
// the page's Sound toggle switches it on. One shared AudioContext, created on
// the first user gesture as browsers require.
let ac: AudioContext | null = null;
export let soundOn = false;
const effects=new Set<OscillatorNode>();
let deaths=0;
function stopEffects(){effects.forEach(voice=>{try{voice.stop();}catch{}});effects.clear();}
export function setSound(v: boolean) {
  soundOn = v;
  if (v && !ac) ac = new AudioContext();
  if (v) void ac?.resume();
  if(!v)stopEffects();
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
  effects.add(o);o.onended=()=>{effects.delete(o);o.disconnect();g.disconnect();};
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
  death: () => {
    deaths++;stopMusic();quietUntil=(ac?.currentTime??0)+1.05;
    [659,523,392,196].forEach((frequency,index)=>tone(frequency,index===3?.38:.14,'square',.045,index===3?98:undefined,index*.16));
    syncMusic();
  },
  finish: () => [587, 740, 880, 1175].forEach((f, i) => tone(f, i === 3 ? 0.36 : 0.12, 'square', 0.05, undefined, i * 0.11)),
};

// Original stage themes: distinct melodies, tempos, bass progressions and timbres.
// No recorded samples or borrowed game tunes.
type Track={name:string;bpm:number;lead:OscillatorType;notes:number[];bass:number[]};
const tracks:Track[]=[
 {name:'Harbour morning',bpm:112,lead:'square',notes:[62,66,69,74,71,69,66,64,62,66,69,71,69,66,64,57,59,62,66,69,67,66,62,59,57,61,64,69,67,64,61,57],bass:[38,38,35,33]},
 {name:'Campus sketchbook',bpm:124,lead:'triangle',notes:[72,76,79,76,74,77,81,77,76,79,84,79,74,72,69,0,69,72,76,79,77,74,71,74,67,71,74,79,76,74,72,0],bass:[36,41,33,43]},
 {name:'Pixel workshop',bpm:132,lead:'square',notes:[64,0,71,76,74,71,67,71,64,67,0,74,76,79,76,71,69,0,72,76,74,72,69,67,66,69,71,74,71,66,64,0],bass:[40,36,45,35]},
 {name:'London rain',bpm:88,lead:'triangle',notes:[69,72,76,0,74,72,69,0,67,71,74,0,72,71,67,0,65,69,72,76,74,72,69,0,64,68,71,0,68,64,0,0],bass:[45,43,41,40]},
 {name:'City ascent',bpm:120,lead:'square',notes:[67,71,74,79,74,71,69,74,71,74,79,83,81,79,74,0,72,76,79,84,83,79,76,72,69,74,78,81,79,78,74,0],bass:[43,40,36,38]},
 {name:'Market pulse',bpm:138,lead:'square',notes:[62,0,65,69,0,72,69,65,64,0,67,71,0,74,71,67,65,69,72,0,74,72,69,65,57,61,64,69,67,64,61,0],bass:[38,40,41,33]},
 {name:'New possibilities',bpm:106,lead:'sine',notes:[66,73,78,0,75,73,70,0,68,75,80,0,78,75,73,0,70,73,78,82,80,78,75,0,66,70,73,78,75,73,70,0],bass:[42,44,46,37]},
 {name:'Winking lullaby',bpm:72,lead:'sine',notes:[72,0,76,79,0,76,74,0,71,0,74,77,0,74,72,0,69,0,72,76,0,72,71,0,67,0,71,74,0,71,72,0],bass:[36,43,33,41]},
 {name:'The scenic route',bpm:96,lead:'triangle',notes:[62,0,69,66,74,0,71,69,67,0,71,74,76,74,71,0],bass:[38,43,35,33]},
];
let trackIndex=8,musicAllowed=false,power=false,timer:ReturnType<typeof setInterval>|undefined;
let nextNote=0,beat=0,quietUntil=0;
const voices=new Set<OscillatorNode>();
function musicNote(midi:number,when:number,duration:number,volume:number,type:OscillatorType){
 if(!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=440*2**((midi-69)/12);
 g.gain.setValueAtTime(0,when);g.gain.linearRampToValueAtTime(volume,when+.008);g.gain.exponentialRampToValueAtTime(.0001,when+duration);
 o.connect(g).connect(ac.destination);voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};o.start(when);o.stop(when+duration+.02);
}
function stopMusic(){if(timer)clearInterval(timer);timer=undefined;voices.forEach(v=>{try{v.stop();}catch{}});voices.clear();}
function syncMusic(){
 if(!soundOn||!musicAllowed||document.hidden||!ac){stopMusic();return;}
 if(timer)return;nextNote=Math.max(ac.currentTime,quietUntil);const schedule=()=>{
  if(!ac)return;const track=tracks[trackIndex];
  while(nextNote<ac.currentTime+.18){const step=60/(power?Math.max(152,track.bpm*1.2):track.bpm)/2;
   const note=track.notes[beat%track.notes.length];
   if(note)musicNote(note+(power?12:0),nextNote,step*.8,.022,track.lead);
   if(beat%2===0)musicNote(track.bass[Math.floor(beat/8)%track.bass.length],nextNote,step*1.5,.035,'triangle');
   beat++;nextNote+=step;
  }
 };schedule();timer=setInterval(schedule,90);
}
export function setMusicStage(stage:number|null){const index=stage===null?8:Math.max(0,Math.min(7,stage));if(index===trackIndex)return;trackIndex=index;beat=0;stopMusic();syncMusic();}
export function setMusicPlaying(on:boolean){musicAllowed=on;if(!on)stopEffects();syncMusic();}
export function setPowerMusic(on:boolean){power=on;}
export function audioState(){return {enabled:soundOn,playing:!!timer,power,voices:voices.size,effects:effects.size,track:tracks[trackIndex].name,stage:trackIndex===8?null:trackIndex,bpm:tracks[trackIndex].bpm,deaths};}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopEffects();syncMusic();});
