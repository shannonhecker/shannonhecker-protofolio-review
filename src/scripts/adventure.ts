// Scroll position directly controls the character. No endless animation loop,
// and no image is moved inside a clipped frame.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-adventure-scene]'));
let scheduled = false;
function update() {
 scheduled = false;
 for (const scene of scenes) {
  const r = scene.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (innerHeight-r.top)/(innerHeight+r.height)));
  scene.style.setProperty('--travel-x', reduced.matches ? '0px' : `${(progress-.5)*r.width*.3}px`);
 }
}
function request() { if (!scheduled) { scheduled=true;requestAnimationFrame(update); } }
addEventListener('scroll',request,{passive:true});addEventListener('resize',request);reduced.addEventListener('change',request);update();

const index=document.querySelector<HTMLElement>('.case-contents');
if(index){
 const links=Array.from(index.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
 const sections=links.map(a=>document.getElementById(a.hash.slice(1))).filter((e):e is HTMLElement=>!!e);
 const observer=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
  if(!visible.length)return;
  for(const a of links){if(a.hash===`#${visible[0].target.id}`)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');}
 },{rootMargin:'-180px 0px -50% 0px',threshold:0});
 sections.forEach(el=>observer.observe(el));
}
