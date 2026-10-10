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

### PR 2 · Mobile nav, brand mark, award-level quality pass

**What Claude Code did**

- Made the mobile nav show where it overflows, and kept the active link in view. At 390px, three of the six sections had been hidden.
- Brought in Shannon's SH mark from shannonhecker.com for the nav, the footer and the favicon set.
- Wrote the award criteria down as checks in `docs/QUALITY.md` and scored the site honestly against them.
- Added a real pause control for the marquees (WCAG 2.2.2), print and PDF output, a 404 page, security headers and structured data.
- Measured a regression and reversed it. Applying `text-wrap: pretty` site-wide cost about a second of first paint on mobile, so it now applies to lead text only.

### PR 3 · Game engine (placeholder art)

**What Claude Code did**

- Rejected Phaser on the research numbers: about 369 KB gzipped against a 400 KB budget. Wrote a canvas engine instead, and the whole game chunk is 3.5 KB gzipped.
- Took the movement tuning from published references: SMB1 frame data and Celeste's open-source player code. The jump is defined by its height and time-to-apex. Coyote time, jump buffering, corner correction and apex hang are all in.
- Wrote a scripted bot that plays the level to the end in CI, so a level edit can never make the game unfinishable. Its first run found a speed-cap bug, which is now fixed.
- Made the game keyboard-only playable with no focus trap. It pauses on Escape, on blur, when the tab is hidden and when scrolled offscreen. It loads only when Play is pressed, and the page still works if that load fails.

**What Shannon changed by hand**

- _To fill in._

**Decisions Shannon overruled**

- _To fill in._
