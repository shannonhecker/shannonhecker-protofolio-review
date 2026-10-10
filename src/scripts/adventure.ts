// Chapter navigation and optional avatar controls never capture page-wide keys.
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
 const controls=companion.querySelector<HTMLElement>('.companion-controls')!;
 const toggle=companion.querySelector<HTMLButtonElement>('.companion-motion')!;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches,x=0,y=0,scrollOffset=0,frame=0;
 const render=()=>{avatar.style.setProperty('--avatar-x',`${x}px`);avatar.style.setProperty('--avatar-y',`${y+scrollOffset}px`);};
 const setPaused=()=>{companion.dataset.paused=String(paused||reduced.matches);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Resume motion':'Pause motion';if(paused||reduced.matches){scrollOffset=0;render();}};
 const move=(direction:string)=>{
  const bound=Math.max(0,(companion.clientWidth-avatar.clientWidth)/2-8);
  if(direction==='left')x=Math.max(-bound,x-28);if(direction==='right')x=Math.min(bound,x+28);
  if(direction==='up')y=Math.max(-38,y-16);if(direction==='down')y=Math.min(12,y+16);
  render();
 };
 controls.addEventListener('click',e=>{const b=(e.target as Element).closest<HTMLButtonElement>('[data-move]');if(b)move(b.dataset.move!);});
 controls.addEventListener('keydown',e=>{const dirs:Record<string,string>={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};if(dirs[e.key]){e.preventDefault();move(dirs[e.key]);}});
 toggle.addEventListener('click',()=>{paused=!paused;setPaused();});
 reduced.addEventListener('change',()=>{paused=reduced.matches;setPaused();});
 addEventListener('scroll',()=>{if(frame||paused||reduced.matches)return;frame=requestAnimationFrame(()=>{const r=companion.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){scrollOffset=Math.max(-16,Math.min(16,-scrollY*.035));render();}frame=0;});},{passive:true});
 addEventListener('resize',()=>{x=0;render();});
 new IntersectionObserver(([entry])=>{companion.dataset.visible=String(entry.isIntersecting);}).observe(companion);
 setPaused();
}
