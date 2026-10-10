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
    // Paired gallery images meet at the centre as their row enters the page.
    // Animate the complete frame so no product pixels are clipped or enlarged.
    document.querySelectorAll<HTMLElement>('#work .row > picture, #work .row > .project-preview').forEach((picture,index)=>{
      gsap.fromTo(picture,{x:index%2?18:-18},{x:0,duration:.75,ease:'power2.out',clearProps:'transform',immediateRender:false,
        scrollTrigger:{trigger:picture,start:'top 92%',once:true}});
    });
    const pairs: { text: HTMLElement; picture: HTMLElement }[] = [];
    document.querySelectorAll<HTMLElement>('.case-page .beat').forEach(beat => {
      const text = beat.querySelector<HTMLElement>('.body > .h-sub');
      const picture = beat.querySelector<HTMLElement>('.body > .product-capture, .body > .shot');
      if (text && picture && pairs.length < 3) pairs.push({ text, picture });
    });
    // Only major evidence moments, not every paragraph or card. No opacity
    // changes: text is readable before, during and without the effect.
    pairs.forEach(({ text, picture }, index) => {
      const direction = index % 2 ? 1 : -1;
      for (const [element, offset] of [[text, direction * 24], [picture, -direction * 24]] as const) {
        gsap.fromTo(element, { x: offset }, {
          x: 0, duration: .65, ease: 'power2.out', clearProps: 'transform',
          immediateRender: false,
          scrollTrigger: { trigger: element, start: 'top 92%', once: true },
        });
      }
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
