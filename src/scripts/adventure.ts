// Chapter navigation and pointer-led avatar motion never capture keyboard input.
export {};
const root=document.documentElement;
const index=document.querySelector<HTMLElement>('.case-contents');
const nav=document.querySelector<HTMLElement>('.nav');
if(nav){
 const measure=()=>root.style.setProperty('--global-nav-height',`${nav.offsetHeight}px`);
 measure();new ResizeObserver(measure).observe(nav);
}
if(index){
 const links=Array.from(index.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
 const sections=links.map(a=>document.getElementById(a.hash.slice(1))).filter((e):e is HTMLElement=>!!e);
 let previous=scrollY,travel=0,frame=0;
 const update=()=>{
  const delta=scrollY-previous;previous=scrollY;
  travel=Math.sign(delta)===Math.sign(travel)?travel+delta:delta;
  const pastHeader=index.getBoundingClientRect().top<=((nav?.offsetHeight??80)+4);
  if(scrollY<180||nav?.contains(document.activeElement))root.classList.remove('nav-away');
  else if(pastHeader&&travel>35)root.classList.add('nav-away');
  else if(travel< -18)root.classList.remove('nav-away');
  let current=0;sections.forEach((el,i)=>{if(el.getBoundingClientRect().top<innerHeight*.4)current=i;});
  links.forEach((a,i)=>{if(i===current)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
  const count=index.querySelector('.chapter-count');if(count)count.textContent=`${current+1} / ${links.length}`;
  frame=0;
 };
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});
 nav?.addEventListener('focusin',()=>root.classList.remove('nav-away'));
 update();
}
const companion=document.querySelector<HTMLElement>('.landing-companion');
if(companion){
 const avatar=companion.querySelector<HTMLElement>('[data-avatar]')!;
 const stage=companion.querySelector<HTMLElement>('.companion-stage')!;
 const toggle=companion.querySelector<HTMLButtonElement>('.companion-motion')!;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=false,visible=false,x=0,y=0,targetX=0,targetY=0,frame=0,last=0;
 const enabled=()=>!paused&&!reduced.matches&&visible&&!document.hidden;
 const render=()=>{avatar.style.setProperty('--avatar-x',`${x.toFixed(2)}px`);avatar.style.setProperty('--avatar-y',`${y.toFixed(2)}px`);};
 const tick=(time:number)=>{
  frame=0;if(!enabled())return;
  const ease=1-Math.exp(-Math.min(40,time-(last||time))/120);last=time;
  x+=(targetX-x)*ease;y+=(targetY-y)*ease;render();
  if(Math.abs(targetX-x)+Math.abs(targetY-y)>.04)frame=requestAnimationFrame(tick);
 };
 const schedule=()=>{if(enabled()&&!frame){last=0;frame=requestAnimationFrame(tick);}};
 const sync=()=>{
  const stopped=!enabled();companion.dataset.paused=String(stopped);
  toggle.disabled=reduced.matches;
  toggle.setAttribute('aria-pressed',String(paused||reduced.matches));
  toggle.textContent=reduced.matches?'Reduced motion':paused?'Resume motion':'Pause motion';
  if(stopped){cancelAnimationFrame(frame);frame=0;x=0;y=0;targetX=0;targetY=0;render();}else schedule();
 };
 stage.addEventListener('pointermove',e=>{
  if(e.pointerType!=='mouse'||!enabled())return;
  const r=stage.getBoundingClientRect();targetX=Math.max(-8,Math.min(8,((e.clientX-r.left)/r.width-.5)*16));
  companion.dataset.greeting='true';schedule();
 });
 stage.addEventListener('pointerleave',()=>{targetX=0;companion.dataset.greeting='false';schedule();});
 toggle.addEventListener('click',()=>{paused=!paused;sync();});
 reduced.addEventListener('change',sync);
 document.addEventListener('visibilitychange',sync);
 addEventListener('scroll',()=>{if(!enabled())return;targetY=Math.max(-12,Math.min(0,-scrollY*.025));schedule();},{passive:true});
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;companion.dataset.visible=String(visible);sync();}).observe(companion);
 sync();
}
