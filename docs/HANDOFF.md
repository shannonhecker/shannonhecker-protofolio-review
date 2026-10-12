# Handoff: how to continue this site in a new session

Written for any agent or person, Claude Code or Codex alike. Read this first. It holds the rules, the decisions already made, and what is
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
- Footer: Shannon requested removal of the build credit on 10 October 2026. Keep the build log at `/build`, without the credit line in the footer.
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

## Continuation update, 10 October 2026

The breathing-room pass, current media replacement, four-case process diagrams,
co-parent flow and supplied avatar direction are implemented on
`design/breathing-room-game-craft`. See `docs/TASKS.md` for release status,
`docs/QUALITY.md` for current checks and `docs/MEDIA-SOURCES.md` for provenance.

Shannon's latest directions override the older source/media guidance above:

- Use the three live product URLs for **current** screenshots and videos,
  including the signed-in uoaui builder when authorized. The older public-site
  captures are superseded, not extra evidence to leave beside current screens.
- Preserve full image proportions throughout. Recreate process graphics as
  HTML/SVG when needed; do not crop UI screenshots to fit a decorative frame.
- Both supplied pixel avatars are approved assets. Match small site accents
  and game art to their playful direction.
- Higgsfield graphics and animation were explicitly requested and are now
  authorized supporting assets. They must not stand in for real product UI.
- Read every Figma page for context. The seven-page source audit is recorded
  in `docs/FIGMA-AUDIT.md`; older drafts and `[Confirm]` claims stay excluded.
- Preserve the narrative except identified conflicts with the latest product.
  The two scoped corrections in this pass are logged in BUILD.md.

After this release, the next new-content feature remains Corporate Action
Manager, Deal Model and Data Solution, with source verification before adding
outcome claims. Award quality is a craft target, not an award certification.

## Later direction, 10 October 2026

Shannon explicitly reopened layout and art direction. Follow
`docs/ADVENTURE-DIRECTION.md` for the confirmed immersive illustrated pixel world,
readable lighter typography, scroll-led chapters and optional game. These choices
supersede the earlier white-page-only visual restriction and frozen composition.
Content accuracy, NDA, original words, complete images and accessibility still
apply. The redesign is not complete; see `docs/TASKS.md` for remaining work.

### Latest review direction, 10 October evening

Shannon supplied matthieugivelet.com for typography, generous spacing and large
clean product imagery, and eddy-naboulet.dev for playful responsive interactions.
The current revision uses neutral sans-serif display type and a wider image-first
work gallery, preserving the full product images. Subtle project colours return
in structural accents; game scenery remains within the game. The avatar uses
registered separate eye/mouth parts, no keyboard/directional controls, gentle
pointer/scroll response and a pause control. Reduced motion stays still.
The original Figma FX decision loop is again the primary flowchart, source-linked
and accompanied by an accessible transcript. Keep authored Figma process work
alongside current labelled public-rebuild screenshots; do not replace it with a
generic synthesized diagram. See the latest PR #25 checkpoint in TASKS.

### Latest confirmed personal timeline, 10 October late evening

Shannon confirmed babies in 2018 and 2021, arrival in the UK in 2013 for a working holiday and study, art/craft/digital media study in Taiwan, and Digital Media at London Met focused on game and UX design. The existing London Met degree dates remain 2015–2016; they must not be described as the UK arrival dates. These details appear in the optional game's journal, education cards and achievements. Source-linked world news is context, not her personal experience or a scored achievement.

Interface corners now use a shared 4px token. Keep circular art/dots intentional. The game has eight distinct original soundtracks plus a map tune, a separate death cue, seated scooter pose, Taiwan→UK flight and a final Scrollkeeper/castle/flag sequence. Functional browser storage `working-order-progress-v2` remembers completed stages and mission stars; it is separate from analytics and scoreboard data.

Late FX sync: user confirmed BOTH website and Figma mobile frame. Portfolio file FX desktop `32:9` and mobile `32:10` now contain original personas/journey, and mobile adapts newly authored desktop chart/compare/ticket/data-layer vectors. Source UI file is preserved. Final level 7 (eighth stage) is locked until done includes all 0–6; enforce in engine, DOM chooser and map, including direct links. Optional mission stars are not prerequisites.

Finale weapon: starlight wand is equipped in stage 7. X/J, gamepad button 2, or contextual touch Cast fires a wall-blocked projectile in the facing direction; 0.5s cooldown, three boss hits, pause freezes shots. Original pixel art and synthesized casting sound. No weapon in earlier levels.

Latest instruction: finish the website changes and push them all live; Claude is independently improving Figma, so do not overwrite those frames. Website scroll motion uses the existing GSAP ScrollTrigger plugin, loaded on first scroll. Reversible masked words and staggered image/caption timelines use shorter touch movement and matchMedia cleanup for reduced motion. Keep product screenshots complete. The home intro uses a ~1.3s sequence; derive elapsed time from document.timeline and animation.startTime, because finished animation.currentTime is clamped.

Music scores live in `src/game/music-score.ts`: eight stage songs plus a map waltz, each with original phrasing, metre, bass and percussion. Stage switching stops all old music voices and resets the score; tests observe Web Audio scheduling rather than only track names. Baby milestones are **2018 and 2021**, per Shannon's correction on 11 October.

### Evidence-led hiring review follow-up · 12 October 2026

Shannon approved the hiring-review plan. The case order is now Fusion, Winking Star, FX, Deal Model, uoaui.ai, with the optional game after selected work on `/panel`. This supersedes the old panel-hero game placement. Full case copy remains, with new summaries after the opening images.

Shannon confirmed that custom-component proliferation was a Fusion problem, and that she audited/grouped the components and regularly reviewed fixes with developers. No numerical impact was supplied. She also confirmed Yu-Hsuan Chen is her legal name and Shannon Hecker her professional name; Winking Star now explains the App Store seller name.

Continue the one-question-at-a-time evidence interview using docs/REVOLUT-EVIDENCE.md. Winking Star results have been requested and are pending. Do not invent missing adoption, testing, audit scope or dates; presentation improvements do not by themselves close the hiring-review evidence gaps.
