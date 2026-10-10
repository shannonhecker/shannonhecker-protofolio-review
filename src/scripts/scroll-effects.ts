import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
function smoothScroll() {
  // Desktop only. Touch keeps native momentum; reduced motion keeps native jumps.
  if (reduce || !fine) return;
  const lenis = new Lenis({ anchors: { offset: 0 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollDriven() {
  if (reduce) return;
  const hi = document.querySelector('.hero-art:not(.hero-game) img');
  if (hi) {
    gsap.to(hi, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
  document.querySelectorAll<HTMLElement>('.shot.para img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.closest('.shot'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Phone strip: scrubbed to vertical scroll on wide pointer screens,
  // native horizontal scroll everywhere else (and with JS off).
  const strip = document.getElementById('strip');
  const wrap = strip?.parentElement;
  if (strip && wrap) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (hover: hover)', () => {
      wrap.classList.add('driven');
      wrap.scrollLeft = 0;
      const dist = () => Math.max(0, strip.scrollWidth - innerWidth + 80);
      gsap.to(strip, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'center 60%', end: () => '+=' + dist() * 0.9, scrub: 0.6, invalidateOnRefresh: true },
      });
      return () => wrap.classList.remove('driven');
    });
  }

  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const to = parseInt(el.dataset.count ?? '0', 10);
    if (!to) return;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(o, { v: to, duration: 1.2, ease: 'power2.out', onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
      },
    });
  });
}

export function initScrollEffects() {
 gsap.registerPlugin(ScrollTrigger);
 smoothScroll();
 scrollDriven();
}
