import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let initialized = false;
export function initScrollEffects() {
  if (initialized) return;
  initialized = true;
  gsap.registerPlugin(ScrollTrigger);
  // Native scrolling throughout. MatchMedia reverts transforms immediately when
  // reduced motion is enabled or the viewport/pointer no longer qualifies.
  const media = gsap.matchMedia();
  media.add('(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    // The image and its caption move at different depths, then settle together.
    // Transform complete frames: the product UI is never cropped for the effect.
    document.querySelectorAll<HTMLElement>('#work .row > picture, #work .row > .project-preview').forEach((picture,index)=>{
      gsap.fromTo(picture,{x:index%2?28:-28,y:index%2?56:24,scale:.97},{x:0,y:0,scale:1,ease:'none',immediateRender:false,
        scrollTrigger:{trigger:picture,start:'top 95%',end:'top 65%',scrub:.6}});
    });
    document.querySelectorAll<HTMLElement>('.case-page .beat .body > .h-sub').forEach((heading) => {
      gsap.fromTo(heading, { y: 32 }, { y: 0, ease:'none', immediateRender:false,
        scrollTrigger:{trigger:heading,start:'top 95%',end:'top 60%',scrub:.5}});
    });
    document.querySelectorAll<HTMLElement>('.case-page .body > .product-capture, .case-page .screen-sequence > .product-capture').forEach((frame,index) => {
      gsap.fromTo(frame, { x:index%2 ? 56 : -56, y:56, scale:.97 }, { x:0,y:0,scale:1,ease:'none',immediateRender:false,
        scrollTrigger:{trigger:frame,start:'top 100%',end:'top 24%',scrub:.65}});
    });
    document.querySelectorAll<HTMLElement>('.case-page .project-hero').forEach(frame => {
      gsap.to(frame,{y:-36,ease:'none',scrollTrigger:{trigger:frame,start:'top 25%',end:'bottom top',scrub:.7}});
    });
    // Move a complete decorative setting, never the pixels inside a screenshot.
    document.querySelectorAll<HTMLElement>('.chapter-scene .scene-setting').forEach(scene => {
      gsap.fromTo(scene, { y: 6 }, {
        y: -6, ease: 'none',
        scrollTrigger: { trigger: scene.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });
}
