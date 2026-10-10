const root=document.documentElement;
const system=matchMedia('(prefers-color-scheme:dark)');
const picker=document.querySelector<HTMLElement>('.theme-picker');
const trigger=picker?.querySelector<HTMLButtonElement>('.theme-trigger');
const menu=picker?.querySelector<HTMLElement>('.theme-menu');
const options=Array.from(picker?.querySelectorAll<HTMLButtonElement>('[data-theme-choice]')||[]);
let choice=root.dataset.appearance||'project';
const update=()=>{
 const dark=choice==='dark'||(choice==='system'&&system.matches)||(choice==='project'&&root.dataset.project==='fx');
 root.dataset.theme=dark?'dark':'light';
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#171b22':'#ffffff');
 root.dataset.appearance=choice;
 options.forEach(option=>option.setAttribute('aria-checked',String(option.dataset.themeChoice===choice)));
 const selected=options.find(option=>option.dataset.themeChoice===choice);
 const label=picker?.querySelector('.theme-current-label');
 if(label)label.textContent=selected?.dataset.themeLabel||'Theme';
 trigger?.setAttribute('aria-label',`Colour theme: ${selected?.dataset.themeLabel||'Theme'}`);
 picker?.querySelectorAll<SVGElement>('[data-theme-icon]').forEach(icon=>icon.setAttribute('data-current',String(icon.dataset.themeIcon===choice)));
};
const close=(restore=false)=>{if(menu)menu.hidden=true;trigger?.setAttribute('aria-expanded','false');if(restore)trigger?.focus();};
const open=()=>{if(!menu)return;menu.hidden=false;trigger?.setAttribute('aria-expanded','true');(options.find(option=>option.dataset.themeChoice===choice)||options[0])?.focus();};
trigger?.addEventListener('click',()=>menu?.hidden?open():close());
trigger?.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();open();}});
options.forEach(option=>option.addEventListener('click',()=>{choice=option.dataset.themeChoice!;try{localStorage.setItem('portfolio-theme',choice);}catch{}update();close(true);}));
menu?.addEventListener('keydown',event=>{
 const index=options.indexOf(document.activeElement as HTMLButtonElement);
 if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close(true);}
 else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;
  options[next]?.focus();
 }else if(event.key.length===1&&/^[a-z]$/i.test(event.key))options.find(option=>option.textContent?.trim().toLowerCase().startsWith(event.key.toLowerCase()))?.focus();
});
document.addEventListener('pointerdown',event=>{if(!picker?.contains(event.target as Node))close();});
picker?.addEventListener('focusout',event=>{if(!picker.contains(event.relatedTarget as Node|null))close();});
system.addEventListener('change',update);update();
export {};
