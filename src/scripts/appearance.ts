const root=document.documentElement;
const system=matchMedia('(prefers-color-scheme:dark)');
const control=document.querySelector<HTMLSelectElement>('.appearance select');
let choice=root.dataset.appearance||'project';
const update=()=>{
 const dark=choice==='dark'||(choice==='system'&&system.matches)||(choice==='project'&&root.dataset.project==='fx');
 root.dataset.theme=dark?'dark':'light';
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#171b22':'#ffffff');
 if(control)control.value=choice;
};
control?.addEventListener('change',()=>{choice=control.value;try{localStorage.setItem('portfolio-theme',choice);}catch{}update();});
system.addEventListener('change',update);update();
export {};
