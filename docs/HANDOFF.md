# Handoff: how to continue this site in a new session

Read this first. It holds the rules, the decisions already made, and what is
next, so a fresh session can carry on without Shannon re-explaining.

## What this is
Shannon Hecker's portfolio for the Revolut product-designer interview,
October 2026. Private share: one link goes to the panel. Live at
https://shannonhecker-work.vercel.app/panel (auto-deploys from `main`).
Repo: `shannonhecker/shannonhecker-protofolio-review`. The brief is in
`prototype/BRIEF.md`; the running log of every change is `BUILD.md`.

## Rules that never change
- Barclays is under NDA: no real screens, no client names. FX is "beta", never "shipped".
- No unmeasured metrics. Never overclaim. AI-assisted is not AI-designed.
- Dates match LinkedIn: J.P. Morgan 2016–2025 (intern June 2016, analyst,
  senior analyst, VP on Fusion 2023–2025); Barclays from September 2025;
  Ling Tung 2008–2010; 捷元電腦 2010, Taipei; London Met 2015–2016;
  Winking Star launched 2026.
- Voice: first person, no em dashes, `uoaui.ai` lowercase.
- Design: white page, one grotesk, hairlines, lots of air, no dark bands,
  no serif, no gradients, no drop shadows except phone frames.
- Keep Shannon's words. She said no to cutting the case copy (10 Oct 2026).
  Add images, spacing and diagrams around it instead.
- Game: no Nintendo characters, sprites, sounds, items or names.
- Footer line: "Built in code with Claude Code, art directed by me." linking to /build.
- Branch per change, PR to main, merge. Run `npx playwright test` first
  (`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome` in the cloud sandbox).
- Ask Shannon one question at a time.

## Sources of truth for content
- Her Revolut portfolio deck in Figma (36 slides): file `17Rsi3vWFtaYwlrRf5iO8E`, node `2068-239`.
- Her intro-call deck (17 slides + speaker notes): same file, node `2044-260`.
- Her old public site: a read-only clone at `/home/user/shannonhecker/shannonhecker-portfolio`
  (images in `assets/`, project pages `project-*.html`). Public, so its images are safe to reuse.
- Her CV: `assets/CV_ShannonH.pdf` in that clone.

## Live links to include everywhere relevant
- uoaui.ai: https://uoaui.ai/ (private alpha)
- FX execution analytics, public rebuild: https://shannonhecker.github.io/fx-execution-analytics/
- Fusion analytics, public rebuild: https://jpm-analytics-dashboard-shannon-h.vercel.app/
- Winking Star: https://apps.apple.com/app/id6765767262 and https://winkingstar.com

## Decisions already made (do not reopen)
- Home page plus one page per case; `/panel` is the link to send, every home link goes there.
- The game ("Working Order") is in the hero, opens full screen on Play, Escape exits.
  Three worlds plus a bonus, with stages (1-1, 1-2 …). Map is a real map; selection follows the coastline.
- Company marks on the map: Barclays eagle and J.P. Morgan octagon (Shannon supplied the files); school buildings for the two universities.
- Site is noindex/nofollow everywhere; no sitemap; Lighthouse gate skips `is-crawlable`.
- "Next: AI" says plainly that AI is where she is heading. Panel line: "Portfolio for the Revolut design panel: product design, heading into AI".
- Diagrams are built as HTML/SVG in the site's style (`src/components/dg`), never as slide images.

## Where things stand (10 Oct 2026)
Done: FX, Fusion and uoaui.ai case pages have diagrams and real images; live links on every case head.
Next, in order:
1. Breathing room: more space between beats, full-width uncropped image moments, dense lists reflowed. Words unchanged.
2. Real screenshots of the three live products on their case pages (Shannon pastes them, or a session that can reach those hosts takes them).
3. Winking Star: a co-parent sync diagram and the deck's edge cases. Skip anything in the deck marked [Confirm] or [Month year].
4. More work from the intro deck, with the old site's public images: Corporate Action Manager (40% faster, 60% fewer steps, zero ADA violations), Deal Model (two hours to twenty minutes, ~60 product owners), Data Solution.
5. Only if Shannon supplies files: generated graphics or video (she mentioned higgsfield.ai). Use sparingly; real product work carries the page.

## Known limits of the cloud sandbox
It cannot reach uoaui.ai, shannonhecker.github.io, the vercel.app sites or figma.com downloads unless those hosts are in the environment's Allowed domains (changes apply to new sessions). It has no link to Shannon's browser.
