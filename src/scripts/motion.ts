// Scroll-led motion, ported from prototype/site-v4/index.html.
// Rules: content is visible without JS (hidden states are scoped to html.js,
// which the head script only sets when motion is allowed), and nothing moves
// under prefers-reduced-motion.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

function reveals() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.rv, .split'));
  if (reduce) return;
  const vh = innerHeight;
  els.forEach((el) => {
    if (el.getBoundingClientRect().top > vh * 0.9) el.classList.add('pre');
    else el.classList.add('in');
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.remove('pre');
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    },
    { rootMargin: '0px 0px 10% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

// Anything a nav jump skipped past still gets revealed.
function sweep() {
  const lim = scrollY + innerHeight * 1.2;
  document.querySelectorAll<HTMLElement>('.rv.pre, .split.pre').forEach((el) => {
    if (el.getBoundingClientRect().top + scrollY < lim) {
      el.classList.remove('pre');
      el.classList.add('in');
    }
  });
}

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
  const hi = document.querySelector('.hero-art img');
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

function peek() {
  const box = document.querySelector<HTMLElement>('.peek');
  const pimg = box?.querySelector('img');
  if (!fine || reduce || !box || !pimg) return;
  let cx = 0, cy = 0, px = 0, py = 0;
  addEventListener('mousemove', (e) => { cx = e.clientX; cy = e.clientY; }, { passive: true });
  const loop = () => {
    px += (cx - px) * 0.18;
    py += (cy - py) * 0.18;
    if (box.classList.contains('on')) {
      box.style.left = px + 40 + 'px';
      box.style.top = py + 'px';
    }
    requestAnimationFrame(loop);
  };
  loop();
  document.querySelectorAll<HTMLElement>('[data-peek]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      pimg.src = el.dataset.peek ?? '';
      px = cx; py = cy;
      box.classList.add('on');
    });
    el.addEventListener('mouseleave', () => box.classList.remove('on'));
  });
}

function chrome() {
  const prog = document.querySelector<HTMLElement>('.progress');
  const nav = document.querySelector<HTMLElement>('.nav');
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav a.l'));
  // Links are either home-page anchors (/#work) or case pages (/fx).
  const here = location.pathname.replace(/\/$/, '') || '/';
  const pageLink = links.find((a) => a.getAttribute('href') === here);
  const sections = here === '/' || here === '/revolut'
    ? links.map((a) => { const h = a.getAttribute('href') ?? ''; const i = h.indexOf('#'); return i >= 0 ? document.getElementById(h.slice(i + 1)) : null; }).filter((s): s is HTMLElement => !!s)
    : [];
  const list = nav?.querySelector('ul');
  const edges = () => {
    if (!list) return;
    list.classList.toggle('more-start', list.scrollLeft > 2);
    list.classList.toggle('more-end', list.scrollLeft + list.clientWidth < list.scrollWidth - 2);
  };
  list?.addEventListener('scroll', edges, { passive: true });
  let lastCur: HTMLElement | null = null;
  const upd = () => {
    const h = root.scrollHeight - innerHeight;
    if (prog) prog.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
    const y = scrollY + innerHeight * 0.35;
    let cur: HTMLElement | null = null;
    sections.forEach((s) => { if (s.offsetTop <= y) cur = s; });
    links.forEach((a) => {
      const on = pageLink ? a === pageLink : !!cur && (a.getAttribute('href') ?? '').endsWith('#' + (cur as HTMLElement).id);
      if (on) a.setAttribute('aria-current', pageLink ? 'page' : 'true');
      else a.removeAttribute('aria-current');
    });
    nav?.classList.toggle('solid', scrollY > 40);
    if (list && cur !== lastCur) {
      lastCur = cur;
      const a = list.querySelector<HTMLElement>('a[aria-current="true"]');
      if (a && list.scrollWidth > list.clientWidth) {
        const ar = a.getBoundingClientRect();
        const lr = list.getBoundingClientRect();
        list.scrollTo({ left: list.scrollLeft + ar.left - lr.left - lr.width / 2 + ar.width / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    edges();
    sweep();
  };
  let t = 0;
  addEventListener('scroll', () => {
    if (t) return;
    t = requestAnimationFrame(() => { upd(); t = 0; });
  }, { passive: true });
  addEventListener('resize', upd);
  upd();
}

gsap.registerPlugin(ScrollTrigger);
reveals();
smoothScroll();
scrollDriven();
peek();
chrome();
root.dataset.ready = '1';
