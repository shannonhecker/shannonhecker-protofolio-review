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

### PR 25 · More room, current product evidence, and a little more me

- I gave the home page and every case more space between ideas. Screens use the full case width and keep their original proportions, with a full-size link for the dense details.
- My two pixel avatars now appear in the introduction and the AI case. Peach details connect them to the game. The game has a gentler map palette and more considered Kaohsiung scenery, plus a short Higgsfield waterfront animation on its cover.
- I replaced the old FX, Fusion and uoaui screenshots with captures of their current live products, including the signed-in uoaui builder. FX and Fusion have new real walkthroughs; uoaui uses the current clip from its own site. Product videos have native controls and wait for Play.
- Every case has direct links to its problem, personas, journey, flow and decision map. New diagrams are real responsive text, based on the case copy and Figma sources. Assumptions are labelled. Winking Star also shows the shared-board journey for a second adult.
- I checked all seven Figma pages. Older drafts and unconfirmed details stay out. Classic is the Barclays design; Enhanced is my public rebuild. No private bank screens or data were used.
- My existing story stays intact except for two corrections against the current products: compare and tune is my practice, not an enforced uoaui export gate; FX's state lane and counted clusters are shown as design refinements, not current live UI.
- I checked desktop and mobile layouts, uncropped images, playback, keyboard controls, reduced motion and the game. Current verification is recorded in `docs/QUALITY.md`; asset provenance is in `docs/MEDIA-SOURCES.md`.

### PR 26 · One illustrated world, with the work kept clear

- I brought the site into the soft illustrated adventure I chose: cream, peach, rose and sky blue, lighter headings, more open type and a shared spacing system. Each of my four cases has equal prominence, its own setting and accent, and a sticky chapter index.
- My avatar now changes outfit and props by chapter. The scenery and role illustrations came from Higgsfield; the role pictures are fictional artwork, not photographs of research participants. Product screens remain real captures with their original proportions.
- I replaced the mixed-city game poster with a Kaohsiung-inspired harbour scene and added illustrated backgrounds to all eight stages. They load per stage and do not repeat landmark towers. These are stylized settings, not literal records of my old campuses or offices. The sharper rendering and lighter ground keep the game closer to its cover without changing the physics.
- I fixed the full-screen startup pause exposed by CI. The game reads the latest visibility entry, recovers only from its own offscreen pause, and lets touch controls resume play. Deliberate pauses still stop the game.
- I made the case navigation cover more of the official Revolut brief. Current tablet and phone captures show what the products actually support, including the FX phone overflow. The brief coverage and remaining evidence gaps are recorded in `docs/REVOLUT-CHECKLIST.md`.
- I added my confirmed work on UITK before Fusion, and kept the accessibility specialist's involvement clear: from the start. The uoaui case now states what the private alpha demonstrates and the next validation question, without inventing adoption or time-saving figures.
- I made my end-to-end ownership visible in Winking Star and uoaui: original logos, current palettes, typography, spacing and component foundations. Winking uses the original 1024px app icon; uoaui uses my original lockup and a fresh capture of my own live system. Current product tokens take precedence over older portfolio swatches.
- I fixed the narrow-screen hero overflow and updated the enemy-landing check to approach an enemy and jump deliberately, rather than jump blindly on a timer. The test reads enemy positions; gameplay physics are unchanged.
- Final local verification: eight routes built, 73 files checked with zero diagnostics, all 78 tests passed in 42.0 seconds, and all ten Lighthouse runs met the 95-point category budget. Mobile performance is 96–99. Optional desktop effects now load on scroll. Release CI and deployment are tracked separately.

### PR 27 · Optional scores and private visit reports

- I added a stage scoreboard with an optional made-up nickname. Sharing is a deliberate choice at the end of a stage, and each stage has its own top ten. The score rewards finishing and pickups, with a small deduction for bumps.
- I connected a free London database with paid auto-upgrades disabled. The server checks score bounds, signs short-lived run receipts and saves repeat submissions only once. These are friendly, client-reported game scores, not a cheat-proof tournament.
- I connected my existing Google Analytics stream for visits, reading depth and stage starts/completions. Analytics loads only after consent, with advertising features off. Nicknames are never sent to Google. Footer settings and a privacy page explain the choice.
- I reset jump counts per attempt and prevent an old delayed finish from showing over a new stage. Network failures leave the game playable.
- Local checks: nine routes built, 81 files checked without diagnostics, 83 tests passed. A real database concurrency check saved one result from two simultaneous submissions, then removed the test entry. Release and visual checks are tracked in docs/TASKS.md.

- Following my visual review, I removed the illustrated landscape headers from all four cases and kept scenery in the game. The pages are white again, with stronger 700-weight headings, medium-weight introductions and more generous chapter, row and diagram spacing.
- Each case now opens with its own product UI: the current public FX and Fusion rebuilds, the current uoaui builder, and a three-screen Winking Star flow. Screens keep their full proportions.
- I removed the build credit from the footer after my review. The build log remains available at its existing address.

- I made the introduction and optional game feel like my own small adventure: my pixel SH mark, a larger avatar with blink and smile frames, bounded arrow controls and a pause button. The game preview stays compact and the four projects share equal space.
- I brought the game map, walk cycle, objects, obstacles and HUD closer to the detailed scenery. Artwork is prepared before play, with the original renderer as a connection fallback. Keyboard, touch and physics stay intact.
- I gave each project its own accent and added light, dark, system and project theme choices. FX starts dark. The main navigation slips away while reading and returns on upward scroll; Contact and the theme selector remain on one row.
- I put role portraits inside persona cards, added project-specific process illustrations, and removed repetitive filled boxes from journey and flow diagrams. All diagram text stays selectable and responsive. Decorative art is labelled separately from research evidence.
- I added more current public FX, Fusion and uoaui screens, plus Winking Star's published iPhone and iPad artwork and labelled French and Traditional Chinese store compositions. Screens retain their proportions and full-size links.
- The current local release candidate passes 94 browser tests, including all eight game stages, theme persistence, system preference changes, bounded avatar controls, accessibility and analytics consent. Ten Lighthouse runs meet the 95-point gate: mobile performance 96–99, desktop 100, and accessibility/best practices/SEO 100. CI and live deployment remain separate gates in the tracker.
- Preview verification caught TypeScript source extensions surviving Vercel's server compilation. I changed the server imports to emitted JavaScript paths and added a compiled-runtime CI check, so an import that only works in the source test runner cannot pass unnoticed.
- I replaced Winking Star's remaining automatic theme strip with a quiet, responsive gallery of four complete banners. There are no repeated copies or cropped scrolling artwork.
- CI's root-page performance check exposed an empty-grid-row bug: without the panel eyebrow, the optional game could appear ahead of the introduction. I assigned the landing rows explicitly and added a layout-order regression check for both URLs on phone and desktop.
- After reviewing the animation, I replaced the full-body expression swaps with separately generated and registered eye and mouth layers. The body stays fixed through each blink. My avatar now follows the pointer and responds gently to scrolling, with no arrow controls, a pause option, and a still version for reduced motion.
- I used Matthieu Givelet's generous typography and image-led spacing as a reference for a wider, cleaner gallery. The complete product images now lead each project, with aligned icons and labels beneath. A neutral sans-serif carries the case stories, with small project-coloured details and gentle left/right entrances. Native scrolling stays in place.
- I restored my original FX decision-loop graphic from the interview deck as the primary flow diagram, with a full-size link and a readable branch transcript. The current product rebuild remains labelled separately.
- I re-exported the original FX loop directly from its 69 Figma vector nodes at 3× resolution, so the full diagram stays sharp at case-page width. The source link and readable transcript stay alongside it.
- I fixed a lazy-image layout shift caught by release CI: screenshots now reserve their exact source proportions before loading, so a chapter link does not jump away when images appear above it. A delayed-image regression check covers the behaviour.
- I replaced the browser-native theme dropdown with a custom appearance menu: project, light, dark and system choices, with icons, a selected marker and a compact mobile trigger. Keyboard arrows, Escape, Tab, outside-click dismissal and saved preferences are covered by tests.
- I stopped the optional game cover and avatar competing with the heading at first load, and matched the consent heading to the site typography. The cover uses sizes appropriate to its compact preview.
- I simplified appearance to one keyboard-accessible light/dark switch and made the optional game a full-width shallow banner that opens at its original playing ratio.
- I replaced the realistic game scenery with a consistent chunky pixel palette across all eight stages, the map, avatar cycle, objects and enemies. The generated source jobs and preparation pipeline are recorded in docs/game-art-generation.json.
- I added an eight-second collectible power star, extra speed and protection, and an original quiet chiptune that follows the Sound toggle and stops on exit. Career achievements reveal verified project names from my CV, including the JPMM, DXD and Fusion work; the next stage continues the story.
- I removed the decorative process illustration strips. The journeys now connect interaction schematics to friction and design responses; decision branches show the chosen approach beside its alternative. My existing words and original FX Figma flow remain intact.
- I fixed rapid fullscreen exit/re-entry, narrow banner sizing and diagram connector overflow found during testing. Scroll reveals now batch layout reads before writes to reduce initial work on slower phones.
- My final preview check sharpened the map labels with the bitmap font, improved the game caption contrast, and corrected the home introduction to say four cases.
- Release CI caught the map chooser squeezing its canvas vertically. I reserved room for the chooser and kept the playing surface at 16:9. The hazard check now waits for collected star protection to expire before checking damage.
- I brought the stage results into the game's pixel palette, with a star emblem, square controls and compact achievement and score panels. Touch devices no longer perform the optional desktop reveal measurements on first load.
- I rebuilt the project index as large editorial rows and opened each case with a compact summary beside complete product screens. The composition follows the scale and spacing I liked in Matthieu Givelet's portfolio, with my own project colours, words and imagery. I kept the design work local.
- I made the scroll depth more visible: screens and headings approach the centre separately, and settle together without cropping the product. Touch devices and reduced-motion readers see all heading words immediately.
- I gave all eight game stages their own generated outfit and hairstyle, registered to a shared pixel grid with dark silhouette outlines. A flat wash quiets the scenery behind the character while leaving platforms and pickups sharp.
- I rebuilt the work index as two large image tiles with a narrow gutter and quiet labels underneath, following my supplied reference more closely. Case introductions now use a 40/60 summary and gallery, with context beside role details and the description below. I preserved my words and complete product screens.
- I replaced the full-width numbered chapter bar with one compact Sections control. It closes after a jump, on Escape, or when I click outside. I added coordinated title/gallery entrances, paired scroll depth and gentle product hover movement; reduced motion and touch keep content immediately readable.
- I made the world map react to hovering, with distinct selected and hovered markers. My character travels to the keyboard-selected stage; water glints and route lights animate gently. Up and Down select individual stages, while Left and Right still change worlds. Motion stops offscreen, when hidden, and under reduced motion.
- I gave project pages more space between sections, diagrams and screenshots. Small section headings have an opaque theme background, and portfolio labels share the same reading typeface. Pixel lettering stays in the game.
- I changed Mandarin interface labels to English, including Kaohsiung and Genuine C&C Inc. The employer name is verified in Taiwan's company register (23134543). Winking Star now compares English and French store artwork; its five supported languages remain accurately listed in English.
- I removed game objects from project titles, reading links and process steps. Project wayfinding is now simple text, numbers and arrows; the pixel objects remain with my avatar and the optional game.
- I made the section labels compact opaque pills, with rounded ends and less space after the text. Project arrows sit directly beside the title and appear on hover or keyboard focus; touch keeps them visible.
- I studied the archive transition in sequence and replaced the page crossfade with a lifting background, then a masked title entrance, then copy and product screens. Links, history and reduced motion keep their native behaviour.
- I added a small avatar cursor that changes outfit by project, walks with the pointer and rests when it stops. A precise dot marks the click point. Text fields, video, the game, keyboard use and reduced motion restore the native cursor; the footer has a saved on/off choice.
- I added a short landing greeting using new, registered arm poses. My original face and body stay fixed while the arm lifts and waves, with a gentle entrance and smile. It plays once when visible, stops when paused or hidden, and skips motion when requested.
- I staged the landing entrance: headline, introduction and links arrive in sequence, then my avatar appears after two seconds. Her separate hand now waves at the wrist, repeats after a short rest and greets mouse/touch visits. Pause, hidden/offscreen states and reduced motion stop it.

- I synced my revised Figma home gallery, including the FX tablet mockup, Fusion composition, Winking Star phone artwork and uoaui desktop. My home headings use the revised Inter type; project-page imagery stays unchanged.
- I moved the arch, book and star entrance after the copy and before my avatar. The game banner now has its own pixel title screen and Start adventure prompt. Decorative motion stops outside the viewport.
- I added a gold pixel umbrella to the rainy London stage, anchored to my character as she turns and jumps. I fixed a heading entrance that left case titles shifted offscreen, and cleared the navigation and avatar cursor from the full-screen game overlay.

### PR 25 · Final review: the reading experience and the journey

- I replaced the section popup with a closable side panel and made the FX status note plain text. My new FX personas, journey map and two interaction frames now come from my supplied Figma file, with source links and responsive text. The sample-data labels distinguish designs from the public rebuild.
- I removed the coloured gaps around the home artwork, set interface corners to 4px and kept desktop product statuses on one row. The introduction now flows from text to scenery to my avatar with a much shorter pause.
- I added my 2018 and 2021 family milestones, my 2013 move to the UK for a working holiday and study, and my art, craft, digital media, game and UX education details to the game. A few source-linked world events provide context.
- Every stage has an original tune. Losing a run or falling has its own cue. My scooter uses a seated pose, and a short skippable flight connects Taiwan to the UK.
- Winking Star now ends with an original Scrollkeeper villain, a storybook castle, a flag I raise and a celebration. Completed stages have check marks, optional missions have stars, and progress stays in the browser between visits.
- The combined build passes all 120 browser checks, including the final boss, flag, travel, saved completion, distinct stage music, timeline pause/resume, responsive artwork and title-label clearance. CI and live release are recorded separately.

### Final review: FX Figma sync and finale unlock

I brought my revised FX desktop artwork into the case introduction and carried it into the mobile layout: the chart, compare detail, order ticket and original data-layer diagram. The portfolio Figma desktop and mobile frames now also contain my three authored personas and five-stage journey; mobile keeps the copy at a readable size. The final game stage stays locked until all seven earlier stages are finished, including when someone follows a direct level link. The map explains the lock and saved progress unlocks it on later visits.

I added an original starlight wand to the finale. I can face the Scrollkeeper and cast with X or J, gamepad X or the touch Cast button. Gold sparks, a short hand pose, a casting sound and a cooldown make each attack visible. Three wand hits defeat the boss before I raise the flag. I also fixed a heading that clipped when a desktop window became mobile and tightened the greeting timing.

### Scroll motion and page-load rhythm

I made the work gallery move in layers: images arrive first, then titles and captions catch up. Section words reveal through masks that follow scrolling in both directions, and the intro's book, star and backdrop travel at different speeds. Touch uses smaller movements; reduced motion restores static, fully readable content. Case metadata and descriptions enter in a short sequence. I tightened the text-to-scene-to-avatar entrance and load the first greeting poses eagerly, so the choreography does not add a long wait. This pass changes website code only while Claude improves the Figma file.

I corrected my baby milestone from 2011 to 2021, keeping 2018 unchanged. The game journal now lists both family milestones in chronological order.

I gave every stage a different song arrangement: swung harbour melody, campus waltz, clipped workshop groove, slow London rain, rising city theme, fast market rhythm, spacious AI theme and a driving storybook finale. Each has its own note lengths, bass pattern and instrumentation. The browser test observes actual Web Audio notes and checks that changing stages stops the previous song. I embedded the small original journey vectors to avoid twenty competing image requests while the FX hero loads, and defer offscreen video posters with native lazy loading.

I removed the redundant Figma-design caption under the FX hero after my final review. The main project-status explanation and detailed source links remain in the case study.

I reduced the body font from three weight downloads to one local variable file while keeping the same type and supported weights. Phone entrances use small opacity and position changes, with a slightly quicker avatar arrival; desktop title masks and scroll masks stay in place. This reduces startup work on slower phones.

### Home motion, image detail and map markers

I made my home title and introduction respond from the first scroll, with staggered words and separate copy depth that reverse when I scroll back. The work captions now animate as the captions enter view, rather than finishing below the screen. My avatar scene has more visible depth, and reduced motion restores a still page.

I aligned Selected work and its gallery with the introduction and exported sharper original FX panels and Winking Star cover compositions from Figma without editing the file. Responsive images now retain source detail for large and Retina displays. The FX overview, ticket and comparison have clear space between them. My first company stage uses a computer-work badge, while universities show their own buildings and completed stages retain their ticks.

I made the shared stylesheet cacheable between pages instead of embedding the entire design system in every HTML response. The home document is now about 64KB rather than 194KB before compression, and the intro flows a little faster from words to scene to greeting.

I softened the navigation and reading-section dividers with a subtle, theme-aware neutral line. They now sit closer to the page background, especially in dark mode, while controls and focus indicators keep their contrast.

My fixed header now becomes frosted glass after scrolling: a translucent page tint, restrained blur and a soft inner highlight. It works in both themes and returns to an opaque surface for reduced transparency or browsers without backdrop-filter. I used the MDN and WebKit backdrop-filter examples as references, with no extra library.

I moved the avatar's blink and smile frames to stepped opacity animations, preserving the poses while allowing the browser to composite them without continuous visibility changes. Phones also avoid stacking individual word masks inside the title entrance. Lighthouse no longer reports non-composited avatar animations; the local mobile check scores 96 for performance and 100 in the other three categories.

I fixed my Contact button's hover and keyboard-focus colours in both themes. My scooter now has a solid rose body, dark chassis and opaque tyres. The game HUD uses the same hand-drawn bitmap lettering as the map, with crisp canvas scaling so its labels stay sharp on large screens.

I corrected the two remaining pale lines around How I work. They were using a fixed light colour; they now share the subtle theme-aware divider, as do the case-section and ticker rules.

## 11 October · dark by default

I made dark mode the starting appearance across my site, including the first HTML paint and browser theme colour. A visitor's saved light or dark choice still takes precedence. I also kept the missing-page link readable on hover against the dark background.
- The dark-default release check caught a slow mobile first paint. I kept the phone introduction's movement but let its text paint immediately, so the entrance does not delay reading. All 130 browser tests still pass.

### 11 October · Updated Figma content and Deal Model

**What Codex did**

I read the current desktop and mobile working pages in Shannon's portfolio Figma file and brought the updated case-study content into the existing site structure. I added Deal Model as the fifth project, with its four composite roles, five-step journey, six decisions, validation states and thirteen design-file screens. I kept the stated limits: smart pricing was explored, and the time saving is Shannon's estimate, not a measured result.

I replaced the older persona, journey and decision treatments for Fusion, uoaui.ai and Winking Star with the current authored material. I exported the updated FX persona illustrations and kept names, roles and quotes as accessible page text. I compared forty existing product-image placements against Figma and retained the higher-resolution originals where their content matched. I used the provided illustrations and diagrams; no generated replacement graphics were needed, and I did not edit the Figma file while Claude was working there.

I checked desktop composition, mobile reflow, image loading, section navigation, reduced motion and both themes. The first test pass caught a visible margin around the new home tile; I fixed its crop. The final local production build succeeds, Astro reports zero errors and warnings (one pre-existing hint), and all 140 browser checks pass. The release still requires its own remote CI and published-site verification.

The visual pass then caught two source-flow labels extending beyond their boxes and connector labels that were difficult to read against dark mode. I rebuilt the four small flow diagrams as theme-aware vectors, keeping their wording and relationships. I also increased chapter-jump clearance to account for the entrance motion, with a regression for the sticky header. All 141 local browser checks pass. I corrected the screenshot test to use Playwright's output directory so the same evidence can be saved on the Linux release runner.

The cloud mobile homepage audit scored 94, just below my 95 budget. I shortened the introductory paragraph's phone entrance and stopped the navigation from measuring the full gallery while the page is at the top. The title, avatar greeting and scroll motion remain. All 141 browser checks pass after this refinement.

### 11 October · Complete the graphic sync

I replaced the six generic FX decision sketches with my finished Figma chart comparisons: combined versus split views, chart repricing versus a settings menu, and market-price studies versus incomplete fill data. The six exports are 1748 pixels wide, with responsive delivery and original-size links. I gave the comparisons more room and stack them on phones. I also placed the authored comparison graphics on white surfaces so their dark illustration text stays readable in dark mode.

I audited the other case graphics alongside the product screenshots, personas, journey maps and decision flows. The prior source-backed assets remain; this pass fills the six missing FX vector drawings without substituting generated product evidence.

### 11 October · Match the expanded data-layer diagram

I brought the expanded FX data-layer view into line with my finished Figma diagram. Market context, order intent, execution results and benchmarks now keep their four branches, with price changes and order states together. The connected diagram keeps selectable text and stacks on phones; the original full-size design remains available above it.

I also removed the separate colour blocks from the FX personas. Each card now uses a continuous illustration-matched background behind the identity and supporting text, with dark type for contrast. The planned shared avatar pass will replace the remaining baked-in image backgrounds.

### 11 October · Consistent comparisons and a complete game entrance

I aligned my FX comparisons with the case reading column, keeping the diagrams smaller and their full explanations directly underneath. The original high-resolution images remain available to open. I removed the second repeated decision layout without cutting its wording, and kept the chosen and alternative views stacked on phones.

I removed the three-project status strip now that Selected work includes five projects. The game now shows an original pixel compass while its map loads and fullscreen settles, replacing the stretched poster flash. The loading scene remains until the canvas has painted, respects reduced motion, and allows retry after a loading failure.

The cloud mobile audit scored 94 against my 95 budget. I let the phone introduction paragraph paint immediately, while keeping the title entrance, avatar greeting and scroll-driven text movement.

### 11 October · One illustrated persona family

I recreated all fifteen persona portraits with Nano Banana 2, using the FX illustration style as the reference. They share a 1200 by 1600 source canvas and the same 300 by 400 display frame. Deal Model now includes all four composite roles. The cards share one continuous warm surface, with names, quotes and needs kept as selectable text in the existing project structure.

The illustrations are fictional design personas, not photographs of research participants. Their source jobs and role mapping are recorded in the media notes.

I prioritised the reading font on phones and limited the avatar image preloads to larger screens, where the illustration is visible immediately. The greeting frames still load eagerly and decode before the animation starts. I also removed an inherited portrait margin so every illustration rests at the card edge.

The hosted phone audit exposed an extra synchronous navigation layout during startup. I moved its overflow measurement into a resize observer and let CSS expose touch/reduced-motion content without rewriting every reveal class at load. Scroll motion and navigation behaviour remain covered by the browser suite.
