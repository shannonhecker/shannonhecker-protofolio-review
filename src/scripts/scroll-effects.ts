import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let initialized = false;
export function initScrollEffects() {
  if (initialized) return;
  initialized = true;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add({ desktop:'(min-width: 901px) and (hover: hover) and (pointer: fine)', motion:'(prefers-reduced-motion: no-preference)' }, context => {
    if (!context.conditions?.motion) return;
    const desktop=!!context.conditions.desktop;
    const marked:HTMLElement[]=[];
    const scrub=desktop?.55:.2;
    const enter=(trigger:Element)=>({trigger,start:'top 96%',end:'top 58%',scrub});

    // The artwork leads, followed by its title and description. A single
    // timeline follows native scrolling in both directions without pinning.
    document.querySelectorAll<HTMLElement>('#work .row').forEach((row,index)=>{
      const artwork=row.querySelector(':scope > picture, :scope > .project-preview');
      if(!artwork)return;
      const timeline=gsap.timeline({scrollTrigger:enter(row)});
      timeline.fromTo(artwork,{y:desktop?(index%2?88:56):20,scale:desktop?.97:1},{y:0,scale:1,duration:1,ease:'none',immediateRender:false},0);
      timeline.fromTo(row.querySelectorAll(':scope > .n, :scope > h3'),{y:desktop?32:12,opacity:.25},{y:0,opacity:1,duration:.55,ease:'none',immediateRender:false},.15);
      timeline.fromTo(row.querySelector(':scope > .meta'),{y:desktop?24:8,opacity:.3},{y:0,opacity:1,duration:.55,ease:'none',immediateRender:false},.3);
    });

    // Existing selectable words reveal through masks; no duplicate reading
    // text, runtime splitting, or horizontal offsets that can clip a phone.
    document.querySelectorAll<HTMLElement>('.split').forEach(heading=>{
      const words=heading.querySelectorAll('.wd');if(!words.length)return;
      heading.dataset.scrollMotion='true';marked.push(heading);
      gsap.fromTo(words,{yPercent:desktop?65:25,clipPath:'inset(0% 0% 100% 0%)'},
        {yPercent:0,clipPath:'inset(0% 0% 0% 0%)',stagger:.035,ease:'none',immediateRender:false,scrollTrigger:enter(heading)});
    });
    document.querySelectorAll<HTMLElement>('.work-title, .process-heading h3').forEach(heading=>{
      gsap.fromTo(heading,{y:desktop?32:12,clipPath:'inset(0% 0% 100% 0%)'},
        {y:0,clipPath:'inset(0% 0% 0% 0%)',ease:'none',immediateRender:false,scrollTrigger:enter(heading)});
    });

    if(desktop){
      // The complete product frame moves. Its UI remains uncropped.
      document.querySelectorAll<HTMLElement>('.case-page .body > .product-capture, .case-page .screen-sequence > .product-capture').forEach((frame,index)=>{
        gsap.fromTo(frame,{y:index%2?72:48,scale:.975},{y:0,scale:1,ease:'none',immediateRender:false,scrollTrigger:{trigger:frame,start:'top 100%',end:'top 32%',scrub:.7}});
      });
      document.querySelectorAll<HTMLElement>('.case-page .project-hero').forEach(frame=>{
        gsap.to(frame,{y:-48,ease:'none',scrollTrigger:{trigger:frame,start:'top 18%',end:'bottom top',scrub:.7}});
      });
      // Separate scene layers drift at different speeds as the intro leaves.
      const companion=document.querySelector('.landing-companion');
      if(companion){
        const timeline=gsap.timeline({scrollTrigger:{trigger:companion,start:'top 20%',end:'bottom top',scrub:.8}});
        timeline.to('.companion-stage',{y:-24,ease:'none'},0)
          .to('.companion-object.object-one',{y:-40,rotation:-8,ease:'none'},0)
          .to('.companion-object.object-two',{y:32,rotation:12,ease:'none'},0);
      }
      document.querySelectorAll<HTMLElement>('.journey-route').forEach(route=>{
        gsap.fromTo(route.children,{y:36,opacity:.3},{y:0,opacity:1,stagger:.12,ease:'none',immediateRender:false,scrollTrigger:{trigger:route,start:'top 94%',end:'top 45%',scrub:.6}});
      });
    }
    // Keyboard focus always exposes the complete linked tile immediately.
    const revealFocus=(event:FocusEvent)=>{
      const row=(event.target as Element).closest('#work .row');
      if(row)gsap.set(row.querySelectorAll(':scope > *'),{y:0,scale:1,opacity:1});
    };
    document.addEventListener('focusin',revealFocus);
    return ()=>{marked.forEach(el=>delete el.dataset.scrollMotion);document.removeEventListener('focusin',revealFocus);};
  });
}
