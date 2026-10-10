# Brief for Claude Code: shannonhecker.com rebuild

Owner: Shannon Hecker, product designer, London.
Purpose: a portfolio site for the Revolut product designer interview, October 2026. It is the one submission a panel of about ten lead designers reviews asynchronously over one to three days. It then becomes my main site. One page, scroll-led, with a small playable platformer as the surprise.

## 0. The context that shapes everything

**Who is reading.** Revolut's design panel. They check for shipped live products verified against my LinkedIn timeline, UI craft, complete flows with edge and validation states, the problem, constraints, decisions with trade-offs, outcomes with metrics, recency and depth. Every section of the page exists to answer one of those.

**The role.** Product designer with AI in mind. So the site has to show two things at once: that I design high-stakes products for people, and that AI is a working part of my practice, not a slogan. That shows up in three ways.

1. The uoaui.ai chapter is the AI case. It stays honest: private alpha, practice not product, with the real design problem underneath (designing for output you can't predict, where the system acts and where it asks).
2. The site itself is proof. Build it with Claude Code, keep a short `BUILD.md` log of what the model did and what I corrected, and surface a one-line "Built in code with Claude Code, art directed by me" in the footer. The panel should be able to see the process, not just the result.
3. The game is also proof. A designer who can ship a playable thing on her own site, with an AI pair, says more about "AI in mind" than any paragraph.

**What it must never do.** Overclaim. AI-assisted does not mean AI-designed. Every decision on the page is mine, and the copy says so where it matters. Nothing on the page is generated placeholder content.

Start from `site-v4/index.html`. It is the approved prototype: content, order, tone, tokens and motion are all signed off. Your job is to turn it into a proper production site, not to redesign it. Where this brief and the prototype disagree, the prototype wins on content and this brief wins on engineering.

---

## 1. Goals, in order

1. A panel of ten lead designers can read every case asynchronously in one sitting and verify the live products against my LinkedIn dates.
2. The site itself reads as craft. Target the standard of Awwwards, FWA and Webby winners: clear art direction, directed motion, 60fps on a mid-range laptop.
3. The game is a delight at the end, never a barrier. Nobody has to play it to see the work.

## 2. Audience

- Primary: Lead and Head of Design reviewers. Desktop, Chrome or Safari, maybe a second pass on a phone. Short on time, high on taste.
- Secondary: recruiters and hiring managers later. Same page, no gating.

## 3. Stack

- Next.js 15 (App Router) with static export, or Astro 5. Pick whichever you can make faster to first paint. Static output, no server.
- TypeScript. CSS Modules or vanilla CSS with custom properties. No Tailwind, the prototype's CSS is the design system.
- GSAP 3 + ScrollTrigger for scroll-driven motion. Lenis for smooth scroll on desktop only, disabled on touch and when `prefers-reduced-motion` is set.
- Fonts via `next/font` or self-hosted woff2: Inter Tight (600, 700, 800), Inter (400, 500, 600), Nunito (700, 900). Preload the display face.
- Images: build-time optimised, AVIF/WebP with JPEG fallback, width-based srcset, explicit width and height on every image. Lazy load everything below the fold.
- Game: Phaser 3 (preferred) or Kaplay, loaded only when the game section enters the viewport, as a separate chunk. The site must work with the game chunk failing to load.
- Deploy: Vercel. Domain: shannonhecker.com. Also keep a `/revolut` route that is the same page with the hero line "Portfolio for the Revolut design panel".

## 4. Design direction

Keep exactly what the prototype does. In words:

- White page, one heavy grotesk, one grey, hairlines instead of cards, a lot of air. Section padding 110 to 260px.
- Composition per section: small text top-left, the big line bottom-left, the picture on the right.
- Type scale: hero up to 132px, chapter titles up to 150px, index rows up to 76px, section subheads up to 52px, body 17px. Letter-spacing negative on display sizes, zero on body.
- Winking Star chapter keeps its own palette inside the white page: cream `#f7f5ef`, card `#fffdf8`, forest `#12351f`, star `#f3a414`, Nunito Black headings. The app's tokens are in `site-v4/index.html` under `--ws-*`.
- No dark bands, no serif, no mono labels, no gradients, no drop shadows except on the phone frames.

## 5. Page structure

Keep this order and these ids, the nav and the rail depend on them.

1. `#top` Hero. Intro paragraph top-left, headline "I design tools where mistakes cost money.", FX cover image right, status row, pill marquee of the six beats.
2. `#work` Index. Four rows with hover preview: FX execution analytics, Fusion analytics dashboard, Winking Star, uoaui.ai.
3. `#fx` Case one. Eight beats: Problem, Users and research, Constraints, Explorations, Decisions and trade-offs, The full flow, Edge and validation states, Outcome.
4. `#fusion` Case two. Five beats.
5. `#winking` Case three. Hero card, Problem and research, Personas, The full flow (phone strip), Journey, Loops and decisions (with the playable tick demo), theme banner marquee, Edge cases, Outcome.
6. `#ai` uoaui.ai. Four beats.
7. `#how` How I work. Six principles.
8. `#play` The game. New, see section 8.
9. `#links` Footer with live links.

Every beat is a three-column label plus nine-column body on desktop, stacked on mobile. The label is sticky.

## 6. Motion spec

All motion respects `prefers-reduced-motion`. With it set: no transforms, no parallax, no marquee, no game autoplay. Content is always visible without JavaScript.

- Hero: headline lines reveal from a mask, staggered 110ms. Hero image unveils bottom to top over 1.3s, then drifts 12% on scroll.
- Headings: words fade and rise 0.4em as the heading enters, 40ms stagger.
- Beats: fade and rise 32px on enter, once.
- Screenshots: subtle vertical parallax, about 8% travel, scrubbed.
- Winking Star phone strip: horizontal, scrubbed to vertical scroll on desktop, native horizontal scroll on touch.
- Numbers in outcome tiles count up once on enter.
- Pill marquee and theme banner marquee: slow linear loop, pause on hover.
- Index rows: a floating image preview follows the cursor on hover, desktop only.
- Nav: fixed, transparent on top, frosted white after 40px.
- Easing everywhere: `cubic-bezier(.22,1,.36,1)`. Durations 160ms for hover, 360ms for state, 900ms to 1.3s for reveals.

## 7. Content rules

These are non-negotiable. The copy in the prototype already follows them.

- Barclays work is under NDA. Patterns and my public rebuild with sample data only. Never a real screen, never a client name.
- FX execution analytics is in beta with internal users. Say beta, not shipped.
- No metrics I have not measured. Placeholders marked `TODO` in the prototype stay as placeholders until I fill them.
- Dates must match LinkedIn: J.P. Morgan 2016 to 2025, VP on Fusion 2023 to 2025, Barclays from September 2025.
- Voice: plain first person with contractions, short declarative sentences, no em dashes, no colons in prose, capital letter after a colon in bullets, `uoaui.ai` always lowercase.
- Winking Star facts come from the app, v1.0.4: four pet stages, Monday brings a new pet, Sample Family on first open, parental gate, Kid Mode, Calm Mode, five languages, lifetime unlock, no ads, no tracking.

## 8. The game: "Star Run"

An original side-scrolling platformer in the spirit of classic 2D platformers. It must be its own thing. Do not use or imitate any Nintendo character, sprite, sound, level, item or name. No plumbers, no mushrooms, no pipes, no coins with that chime, no "world 1-1". If something would be recognisable as Mario, change it.

**Where it lives.** Section `#play`, after How I work. A 16:9 canvas inside the page, 960×540 logical, scaled to the column. A single "Press to play" state until the user starts, so nothing runs on page load. A "Skip to links" link above it for keyboard and screen reader users.

**The hero.** A pixel-art Shannon, 32×48 sprite at 1x, drawn from the photo I will provide in `assets/shannon-ref.jpg`. Keep it to the recognisable bits: hair, glasses if I'm wearing them in the photo, the outfit colours. Frames: idle (2), run (6), jump (1), fall (1), hurt (1), celebrate (2). Draw the sheet by hand as a PNG; if you generate it, I review before it ships.

**The world.** Three short levels, one per case, each about 45 seconds. Left to right, auto-scrolling camera that follows the player.

- Level 1, The Desk. Background: a dark trading floor skyline in flat shapes. Platforms are candlestick bars. Hazards: falling "spreadsheet" sheets. Collectible: blue price dots.
- Level 2, The Board Room. Background: white and grey, big typography from the site. Platforms are table rows. Hazards: "fixed template" blocks that slide. Collectible: green check marks.
- Level 3, Bedtime. Background: Winking Star cream with the botanical doodles from `img/ws-hero-art.jpg`. Platforms are the app's activity cards. Hazard: the nag loop, a looping cloud. Collectible: orange stars. The end of the level hatches a pet.

**Mechanics.** Run, jump with variable height, coyote time 80ms, jump buffering 100ms. One hit knocks back, three hits restart the level. Collect everything in a level to get a "Shipped" badge. Finishing all three shows a card with my three live links and a "Play again".

**Controls.** Arrow keys or WASD plus Space. On touch, three on-screen buttons: left, right, jump. Gamepad if available. Pause on blur.

**Sound.** Off by default. One toggle. Short synthesised chiptune jingles, written for this, no borrowed tunes.

**Performance.** 60fps on a 2020 MacBook Air. Sprite sheets under 200KB total. Game chunk under 400KB gzipped including Phaser.

**Accessibility.** Keyboard only is fully playable. Canvas has an aria-label and a text description of what the game is. Reduced motion: no screen shake, no parallax layers. The game never traps focus.

## 9. Assets I will supply

- `assets/shannon-ref.jpg`, a clear photo of me for the sprite.
- uoaui.ai screens, five captures.
- App Store downloads and rating for the Winking Star outcome tile.
- Everything else is in `site-v4/img`.

## 10. Definition of done

- Lighthouse 95 or above on Performance, Accessibility, Best Practices, SEO on desktop and mobile.
- axe-core: zero violations at 390, 820 and 1440px.
- No horizontal scroll at any width. 16px minimum gutter.
- All motion off under `prefers-reduced-motion`, page still complete.
- Works with JavaScript disabled: all content readable, game shows a static poster.
- Open Graph image and title, favicon, `robots.txt`, sitemap.
- Every external link opens in a new tab and is checked live in CI.
- `BUILD.md` exists and is linked from the footer: what was built with Claude Code, what I changed by hand, and the decisions I overruled.
- Footer carries the line "Built in code with Claude Code, art directed by me."
- Playwright tests: hero renders, each nav link scrolls to its section, the Winking Star tick demo reaches 6 of 6, the game boots on click and the player can jump.

## 11. How to work

- Branch per feature, PR to main, Vercel preview on each PR.
- Keep the prototype's class names where sensible so I can diff against it.
- Ask before changing copy. Do not add copy.
- When something in this brief is unclear, build the simplest version that satisfies section 10 and leave a `// DECISION:` comment explaining the call.
