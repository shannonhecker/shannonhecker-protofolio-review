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

### PR 4 · Calls Shannon delegated ("I trust your findings")

**What Claude Code decided and did**

- **Structure:** an index plus a page per case. The one-page site was 43 screens long; the new home is 7.2.
- **Art direction:** cropped the case slides to their UI. The originals are kept, and a script makes the crops.
- **Panel URL:** `/revolut` is now `/panel`, so no URL names another company while Shannon works at Barclays.
- **Placeholders:** replaced with facts the page already states. Nothing is invented.
- **Game:** concept B, renamed **Working Order**. Platforms ride an FX rate line.

### PR 5 · Shannon's calls: home plus case pages, game concept A, pixel art

**What Shannon decided**

- Keep the home page plus one page per case.
- Use game concept A, three levels with one per case, so the game is part of the portfolio's story.
- Make it a 2D pixel-art platformer in the Super Mario style.

**What Claude Code did**

- Looked for a relevant skill or plugin and found SpriteCook, which generates sprites with AI. Offered it as optional. The art in the game is hand-authored as character grids, in line with the brief's "draw the sheet by hand".
- Kept the style Mario-era and the nouns Shannon's own: no pipes, no ? blocks, no mushrooms, no flagpole, no plumber.
- Rendered the game at a true 480×270, scaled up with nearest-neighbour, so every pixel stays crisp.
- Built three worlds:
  - The Desk: a night trading floor, candlestick platforms, falling spreadsheets and the FX rate line.
  - The Board Room: the site's own type, data-table rows and sliding "fixed templates".
  - Bedtime: cream hills, activity cards, the nag-loop cloud and an egg that hatches the week's pet.
- Tied the game to the story. After each level, a card shows that case with "Read the case". Each case page links to its level, and the link selects the level without starting it.
- Fixed problems the test bot found:
  - Checkpoints only triggered on touch, so a jump over one lost progress. They now trigger when you pass.
  - A spike sat right before a pit, which meant two demands back to back.
  - A staircase in Bedtime needed precise timing. The cards now overlap.
- Fixed the test server so tests always run against the current build. One earlier "pass" had been hitting a stale preview.

### PR 6 · The game moves into the hero

**What Shannon decided**

- Move the game into the landing-page hero, the way Google puts a playable Doodle on its home page, instead of a separate section at the end.

**What Claude Code did**

- Kept the headline as the main thing. The game takes the place of the hero image and stays idle until someone presses Play.
- Sized the game column at up to 480px, exactly 1× the pixel canvas, so the art stays crisp on retina screens. It stacks under the headline on phones, with the touch controls directly under the canvas.
- Removed the bottom `#play` section. "Play this case as a level" links now land on the hero.
- Measured the result: Lighthouse is 100 in all four categories on mobile and desktop. Mobile LCP is 1.3–1.5 s, because the pixel poster is 3–6 KB as AVIF where the photo was much larger.
- Removed a leftover scratch test from the repo.

### PR 7 · The game becomes Shannon's career

**What Shannon decided**

- Turn the game into her career journey.
- Supplied the facts the CV doesn't have:
  - She grew up in Kaohsiung, by the sea, in the city by the park, on a motorbike.
  - She worked as a web and visual designer at 捷元電腦 (B2C).
  - At J.P. Morgan she joined in June 2016 as an intern, then became Analyst, Senior Analyst and VP, in the UI/UX team. The work was mostly UI and visual at first, then UI and UX together.

**What Claude Code did**

- Read the facts from her CV (`assets/CV_ShannonH.pdf`): Ling Tung 2008–2010, the London Met MA 2015–2016, J.P. Morgan 2016–2025, Barclays 2025 to now, uoaui.ai 2026, and Winking Star 2026. Every card states only these facts.
- Built the world map with eight worlds:
  - **Kaohsiung:** you ride a scooter, which comes from her own detail.
  - **Ling Tung**, **捷元電腦** and **London**, the last one in the rain.
  - **The J.P. Morgan tower:** a vertical climb, one floor per title. The pickups change from colour swatches (UI) to flow arrows (UX) as you climb.
  - **Barclays**, with the FX rate line.
  - **Next: AI:** platforms are drafted until you get close.
  - **Winking Star**, as a bonus world.
- Gave the character a different outfit in each era.
- Made "Next: AI" describe her practice rather than a job search, because she currently works at Barclays and the site is public.
- Fixed the problems the level bots found:
  - The first tower layout needed jumps longer than the jump allows.
  - A low ceiling blocked the climb.
  - A Ling Tung platform ended right at a pit.
- Left the 捷元電腦 years off until Shannon confirmed them (2012, added in PR 8).

**What Shannon changed by hand**

- _To fill in._

**Decisions Shannon overruled**

- _To fill in._

### PR 8 · Shannon's own character

- Shannon sent two pixel-art references of herself. I redrew the 16×24 sprite by hand from them:
  - Long wavy dark-brown hair with a fringe, big eyes with a highlight, blush, and a pearl earring.
  - A cream turtleneck with a gold pendant, wide pink trousers and cream trainers.
- That outfit is her look today. Barclays, Next: AI and the Winking Star bonus world use it.
- Earlier worlds keep their era clothes: summer blue in Kaohsiung, student green at Ling Tung, cream and navy at 捷元電腦, a camel coat in London, navy at J.P. Morgan. Shades are derived from each era's two colours, so an era still names only a top and trousers.
- Left the laptop out of the sprite. Her reference shows tool-brand stickers, and the game uses no brand marks. At 16 px it would also hide the pendant.
- 捷元電腦 now shows 2012 on the map, the HUD and the end card.
- Regenerated the map poster so the no-JS and pre-play state shows the new character.
- Checked every pose in every world on a contact sheet. 57/57 Playwright tests pass.

### PR 9 · Era looks, small enemies and missions

- **Her look changes with each era** (`src/game/looks.ts`), matched to what was in style in that year:
  - Kaohsiung: a ponytail with a scrunchie, a PE tee and shorts, plus a half-helmet on the scooter.
  - Ling Tung (2008–10): side-swept bangs, a Breton top and skinny jeans.
  - 2012: ombré tips, a mint top with a Peter Pan collar and coral skinnies.
  - London (2015–16): a lob, a camel coat over a black tee and white trainers.
  - J.P. Morgan: a sleek centre part, a navy blazer and a pale-blue shirt.
  - Today: her reference look. In Next: AI she also carries the laptop from her reference, with a plain lid and no brand stickers.
  - Bedtime: a claw-clip updo and pyjamas.
- **Each era has its own hand-drawn grid.** I drew one head and torso per era rather than tinting one sprite, because hair is what dates a look. Legs vary by cut (shorts, skinny, straight, wide).
- **Contact-sheet fix:** at first the white shirts under the chin read as a beard. I added a neck, and changed the London tee to black and the J.P. Morgan shirt to pale blue.
- **One small enemy kind per world** (`src/game/enemies.ts`): mosquitoes, deadline clocks, bugs, pigeons, meeting invites, late-change sticky notes, hallucinations and glowing screens.
  - Landing on one clears it and bounces her (higher if Jump is held). Touching one from the side is a hit.
  - Pigeons fly off rather than flatten.
  - None is an employer, a client or a person. All are original 12×10 sprites.
- **One optional mission per world**, shown under the HUD strip, announced to screen readers and reported on the end card:
  - Ride the scooter to the sea.
  - Beat 3 deadlines.
  - Squash 4 bugs.
  - Find every book.
  - Collect every flow arrow.
  - Catch 3 late changes.
  - Verify 3 hallucinations.
  - Put 3 screens to sleep.
- **Missions are a bonus only.** Finishing a world never depends on one, so nobody gets stuck. The map star turns gold when the mission is done.
- **New tests:**
  - A stomp clears an enemy and counts toward the mission.
  - A side touch is a hit.
  - Every world has a mission.
  - The Kaohsiung bot completes its ride mission.
  - Every end card reports its mission.
- **Regenerated the map poster.**

### PR 10 · A real map, and 捷元電腦 is 2010

- **Map projection:** the world map is drawn like a real map now (`src/game/map.ts`). Taiwan and Great Britain come from simplified real coastline coordinates (latitude and longitude, squeezed by cos(latitude)), rasterised once with hard pixel edges, a coastline and a shallow-water band.
- **Real places:** Taiwan's stops sit where they really are: Kaohsiung in the south-west, Ling Tung in Taichung, 捷元電腦 in the north. A dashed flight with a little plane goes from Taipei to London.
- **London inset:** a box with the Thames and its Isle of Dogs loop holds London Met, J.P. Morgan and Barclays. It makes no claims about which office.
- **AI island:** Next: AI is an island with a dashed, still-drafting coast. Bedtime is a small island beside it.
- **Map furniture:** a graticule, a compass, and "Not to scale".
- **Character:** she stands on the selected world in that era's look.
- **Date:** 捷元電腦 now shows 2010. Shannon later confirmed the year and the location (Taipei, which is where the map already puts it).

### PR 11 · Controls that don't get in the way (Shannon's report)

- **Dropdown before Play:** choosing a world in the dropdown before pressing Play did nothing. Now it starts that world, before or after Play.
- **Map clicks:** clicking a world on the map now updates the dropdown too.
- **Pause on blur:** pressing an on-screen arrow, Sound or the dropdown paused the game immediately, because any loss of focus counted as leaving. Now only leaving the game area pauses it. Touch buttons keep focus on the canvas.
- **Unpausing:** a paused game now carries on with any game key (Escape still pauses and Tab still leaves), not only a click.
- **Tests:** `tests/controls.spec.ts` covers all five behaviours. Each failed before the fix.

### PR 12 · Flags and brand-colour badges (Shannon's choice)

- **Flags:** pixel flags for Taiwan and the UK, hand-placed at 16×10 above each country's name. They're simplified as pixel art has to be: the Union Jack without its counterchange, and Taiwan's sun as a small disc with eight rays.
- **Badges:** London Met, J.P. Morgan and Barclays get brand-colour badges. Each one has a plate in the organisation's colour, a stripe of its accent colour, and its name in the pixel font. Each node's tile frame uses that colour too.
- **Why not logos:** these are badges, not logos. Shannon picked this over official logo files, so the site uses no trademarked artwork, and her current employer's mark isn't on a job-search site.
- **Colours:** they are close matches and live in `BRAND` in `src/game/map.ts`, so they're easy to correct.
- **Label:** world 4's map label now reads "London Met", which names the organisation like the other two badges.

### PR 13 · School buildings on the map (Shannon's note)

- **School icons:** Ling Tung and London Met are where Shannon studied, so their map tiles now show school buildings, not the level's pickup icon.
  - Ling Tung: a cream campus block with a red-tiled roof and a flag.
  - London Met: a brick building with a pediment, tall windows and steps.
- **How:** both are hand-placed 16×14 sprites in `SCHOOL_ICONS` (`src/game/map.ts`).

### PR 14 · The Barclays eagle (Shannon's request)

- **Eagle icon:** Shannon sent the Barclays eagle and asked for it on the map. Her Barclays tile now shows it in cyan on white, as the mark appears.
- **Not redrawn:** the eagle was box-downsampled from her file to 15×16 rather than redrawn, so the shape stays the brand's own.
- **Easy to remove:** the icon lives in `LOGO_ICONS` in `src/game/map.ts`. Deleting that entry brings back the plain brand-colour tile.
- **Flagged to Shannon:** Barclays is her current employer and the site is part of a job search, so she should check Barclays' brand and social-media policy before the link goes out.

### PR 15 · The J.P. Morgan octagon (Shannon's request)

- **Octagon icon:** the J.P. Morgan tile shows the octagon from the logo file Shannon sent, blue on white. The wordmark is left off: at 16 px it can't be read, and the badge already names the company.
- **Seams restored:** downsampling closed the octagon's four white seams, which turned it into a plain ring. I put them back at 1 px each, where the logo has them, so the pinwheel around the square hole still reads.
- **Exact colours:** the J.P. Morgan badge now uses the wordmark brown and octagon blue sampled from her file, replacing my earlier close match.

### PR 16 · Worlds and stages (Shannon: "too many choices")

- **Four choices, not eight:** the map offered eight separate choices. They're now grouped the way Mario does it:
  - World 1 · Taiwan (1-1 Kaohsiung, 1-2 Ling Tung, 1-3 捷元電腦).
  - World 2 · London (2-1 London Met, 2-2 J.P. Morgan, 2-3 Barclays).
  - World 3 · Next: AI.
  - A bonus.
- **Choosing a world:** Left and Right on the map step through the four, landing on each world's first unfinished stage. A dashed red frame marks the whole world. The footer reads "World 2 · London · 3 stages".
- **Why stages, not merged levels:** merging the three Taiwan levels into one long level would have lost the era looks and the story cards that carry the facts. Each stage still ends on its card.
- **End-card buttons:** "Next stage" inside a world, then "Next world: London", "Next world: AI" and "Bonus: Bedtime".
- **Picker:** the world dropdown uses `<optgroup>`s, so it's four groups of stages. A case page's `?level=` link still starts its exact stage.
- **Shared data:** groups live in `CHAPTERS` in `src/lib/journey.ts`, which the game, the cards and the picker all share.

### PR 17 · Private share (Shannon: "private share only, for the Revolut interview")

- **No search listing:** every page now carries `noindex, nofollow`, and `vercel.json` sends the same as an `X-Robots-Tag` header on every file, including images and the CV. The sitemap is gone.
- **robots.txt stays open on purpose:** a Disallow there would stop crawlers reading the noindex, and a blocked URL can still turn up in search as a bare link.
- **Lighthouse gate:** CI now skips Lighthouse's `is-crawlable` audit, the one check this choice fails by design. Every category is still 100, mobile and desktop.
- **Limit:** noindex keeps the site out of search; it doesn't password-protect it. Anyone with the link can open it, so share the link only with the panel. A password would need Vercel's paid Deployment Protection, or Vercel Authentication, which would make interviewers log in to Vercel.

### PR 18 · Selection follows the coastline (Shannon: "can't the red dotted square be the Taiwan shape?")

- **Coastline outline:** the selected world is now outlined by its own shape, not a box. A red line runs 2 px outside the real coastline of Taiwan, of the AI island and of the bonus island. For London it goes around the inset frame.
- **How:** each outline is computed once from the land pixels when the map is drawn (`SELECT_RINGS` in `src/game/map.ts`).
- **Why solid:** I tried a dotted version first. At this size it broke up into noise along the curved coast, so the line is solid.

### PR 19 · Every way home leads to /panel; Next: AI says it plainly

- **Links home:** the panel gets the `/panel` link, so every link back home now goes there too: the logo, Work and How I work in the nav, the 404 and build pages, and each case page's "Play this chapter" link (`/panel?level=n`). The panel line never drops away while they browse.
- **Next: AI copy:** Shannon confirmed that AI is the focus of her job search, so the end card now says it: "Where I'm heading next: designing AI products. uoaui.ai is the AI-native product I design and build to get there. The model drafts, I decide."
- **Why it's safe to say:** the earlier "practice, not a job search" framing was for a public site. This one is a private link for one panel.
- **Kept as is:** the uoaui case still calls it a private alpha, not a shipped product, because that's true.

### PR 20 · The panel line names AI (Shannon approved)

- **New wording:** the `/panel` hero eyebrow now reads "Portfolio for the Revolut design panel: product design, heading into AI". This puts the job-search direction above the headline, so the panel sees it before anything else.

### PR 21 · Full screen game, with an easy way out (Shannon's request)

- **Play opens full screen:** pressing Play now opens the game full screen. It uses the browser's Fullscreen API where allowed. On iPhone Safari, which doesn't allow it for a canvas, the same layout appears as a fixed overlay.
- **Three ways out:**
  - Escape (the browser's own, or ours in the overlay);
  - a white "Exit full screen ✕" button in the top corner;
  - re-entry any time with a "Full screen" button under the game.
- **Leaving full screen:** a level you leave stays paused, so nothing happens while you're away. The map never gets stuck: starting any world clears the pause.
- **Phones:**
  - Upright: the game sits above its controls, with a hint to turn the phone.
  - Sideways: the game fills the height, ← and → sit in the left margin, ↑ in the right, and the exit button shrinks to a ✕ (still announced as "Exit full screen").
- **Tests:** three new ones cover Escape, the buttons, the map case and the phone overlay. 71 pass.

### PR 22 · FX case: the diagrams the panel looks for

- **Source:** Shannon's Revolut portfolio deck in Figma. I read all 36 slides, plus the 17-slide intro-call deck and its speaker notes.
- **Built in the site's style, not as slide images:** the deck's diagrams are dark slides with serif titles, and the brief rules out serif type and dark bands. Each one is rebuilt with the site's type and hairlines, as real text.
- **New diagram components** (`src/components/dg`): Flow, Layers, Matrix, Stack and BeforeAfter.
  - Each is real text, so screen readers read it and it stays sharp at any size.
  - Each stacks on a phone.
  - The Matrix is a real `<table>` with row headers.
- **FX now shows:**
  - **Understanding the data:** five spreadsheets, four kinds of data, one mark each. This is the deck's slide 09, which the site didn't have.
  - **Reprice flow:** monitoring to action as six steps, with the Cancel branch ("nothing changes"), confirmation and the audit trail.
  - **Before/after:** schematics of the two version-one debts. State regions became a state lane; a smear of dots became counted clusters. These are schematics, not screens, so they stay NDA-safe.
  - **State matrix:** the edge and validation states as a table (state, what the screen does, why), replacing a two-column list.
- **No new claims:** every word comes from the deck or the existing case copy.
- **Test fix:** "the scooter makes you faster" read the speed after a fixed 900 ms, which sometimes landed after the bot rode into the pit at tiles 26–28. It now reads the speed as soon as it builds. It passes 8 of 8 in a row.

### PR 23 · Fusion case: a real problem, and the system made visible

- **Problem beat fixed:** beat 01 was labelled "Problem" but listed only constraints. It now states the problem in Shannon's deck words: "Their real need was trust in the numbers, not more features". It also covers the users, the job, and where it started (the legacy RaaS layout).
- **Constraints beat:** constraints have their own beat, now with her role (she led the design; the UX designer was shared; a product owner set requirements).
- **Workflow:** the four-step workflow is a Flow diagram. "What testing changed" (deck slide 20) is added.
- **Design beat:** two images that were already public on shannonhecker.com.
  - The widget grid: one shell, five uses. This is the proof of "one widget, many cubes".
  - The configuration panels, beside the tier decision. They aren't captioned as before or after the cut, because I can't tell which version they show.
- **System diagram:** "The system underneath" is now a Stack diagram: pages, widgets, the Fusion layer (outlined as hers), Salt, then FactSet. Entitlements and adoption are noted on the side.
- **No new claims:** nothing beyond the deck and the existing copy. I removed one line I'd written that went beyond the source.

### PR 24 · uoaui.ai: real screens, a demo clip, and the live links on every case

- **Screens, at last:** the uoaui.ai case had no images. It now shows the prompt screen (dark and light) and the design hub with the chart set, both already public on shannonhecker.com.
- **A demo clip:** the 30-second builder walkthrough from shannonhecker.com, re-encoded from 4.5 MB to 0.9 MB at 1280 px. It loads nothing until it nears the screen, plays only while visible, and stays a still poster with controls under reduced motion. The caption carries the content for anyone who can't watch.
- **Diagrams:** the five-step builder flow, and a Stack showing how a screen is built: person, model, token mapping (hers), official components, export.
- **"What it isn't":** added from the deck, because the honest line belongs on the page.
- **Live links where the panel reads them:** each case head now links to its live thing, not only the footer. FX and Fusion link to the public rebuilds, uoaui.ai to uoaui.ai. The footer's "uoaui.ai on request" is now a link.
- **Fixed in review:** the first image was the logo card, not the prompt screen; and the Stack's side notes overflowed on long text.
