# Build log

How this site was made, kept honest. Shannon writes the entries marked **Shannon**. Claude Code's entries say what the model did. Nothing here is a claim about design authorship: every design decision on the page is Shannon's.

## Process

- **Prototype:** `prototype/site-v4/index.html`, signed off by Shannon for content, order, tone, tokens and motion. It is kept in the repo so every production file can be diffed against it.
- **Brief:** `prototype/BRIEF.md`.
- **Tooling:** Claude Code in a cloud session, one branch and one PR per feature.

## Log

### PR 1 · Production scaffold

**What Claude Code did**

- Chose Astro 7 static output over Next.js. A one-page site needs no framework runtime, so the first paint is just HTML and CSS.
- Converted the prototype markup into Astro components with a script instead of retyping it, so the copy is byte-for-byte the signed-off copy.
- Copied the prototype CSS unchanged into `src/styles/prototype.css`. Production-only overrides live in `production.css`, and each one says why it's there.
- Moved word-splitting for heading reveals from runtime `innerHTML` to build time.
- Ported the motion to GSAP + ScrollTrigger from npm, and added Lenis on desktop pointer devices only.
- Added an image pipeline: AVIF and WebP with a JPEG fallback, width-based srcsets, and explicit dimensions.
- Made the page work with no JavaScript: the phone strip scrolls natively, and hidden reveal states only apply once motion is confirmed.
- Kept the prototype's clean axe result (zero violations, the same as v4). Added a few things on top: roles on the labelled scroll regions, a screen-reader warning on links that open a new tab, and keyboard focus now pauses the theme marquee.
- Added the `/revolut` route, Open Graph tags, a favicon, `robots.txt`, a sitemap, Playwright tests and CI.

**What Shannon changed by hand**

- _To fill in._

**Decisions Shannon overruled**

- _To fill in._
