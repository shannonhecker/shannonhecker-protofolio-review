# Portfolio delivery checklist

Current audit: 12 October 2026. This is the authoritative current checklist.
Older TASKS.md and QUALITY.md describe historical releases. Completion requires
source, rendered implementation and deployed result to agree.

**Current state:** PR [#49](https://github.com/shannonhecker/shannonhecker-protofolio-review/pull/49),
head `7057e7a13e08e7003390707cb788c6ce0ebc0d75`, is open. Local build and all
149 browser tests passed in 58.9s. CI
[38185501523](https://github.com/shannonhecker/shannonhecker-protofolio-review/actions/runs/38185501523)
is running. Later source-art and zoom changes are in progress and are not covered
by this head. **Hold merge until those changes are finished, tested, pushed and
verified at the final exact head.** PM monitors and records evidence; root owns
implementation and release. No external award validation is claimed.

Status terms: **Implemented, release pending** is verified local work, not live.
**Previously live, final recheck** needs the final review. **Open** requires work.
Figma completion is distinct from website deployment.

Latest local checkpoint after 7057e7a: source-art/voice corrections and full-size
links are implemented. The decorative AI avatar was removed, resolving the old
hidden-state CSS regression; desktop/mobile visual checks passed. Check/build
and 149 tests passed in 56.8s before the final avatar/transcript cleanup; the final
rerun is active. New-head CI/live verification and actual final-review coverage
remain open. These implementation items no longer block on missing source work.

## Current scope and owners

| Request | Current status | Evidence / remaining work |
|---|---|---|
| Fifteen website personas match supplied template | Implemented, release pending | Final build and 149-test pass at 7057e7a; no invented technical ratings or participant facts |
| Thirty Figma persona cards match template | Done in Figma | Final upload/manifest and visual review complete; original content retained |
| One accent per persona, white base, clean cutouts | Implemented, release pending; Figma done | Single hue, no mixed pastel/tinted card surfaces; no multiply blending; four Deal portraits have clean cutouts |
| Five distinct website journeys | Implemented, release pending | ProductJourney/FxOriginalJourney; source-specific structures and accessible narrative |
| Ten desktop/mobile Figma journey layouts | Done in Figma | Final manifests and gap adjustments complete |
| Detailed decision maps for every product | Implemented, release pending | 21 choices in decision-evidence.json and AuthoredDecisions; rationale, alternatives, evidence, tradeoffs and status; remaining image claims below |
| Figma whole-page spacing/gaps after content sync | Done in Figma | Final page-gap manifests; original updated graphics preserved |
| Eight-file private interview voice review | Implemented, release pending | Final FX TWAP/study, Fusion sign-up and Deal import/sixty wording corrections applied; editable Figma text synced; no unsupported impact added |
| Deal original file and updated portfolio art | Implemented, release pending; Figma synced | Three unsupported alternative images hidden in web/Figma, written tradeoffs retained. Two smart-pricing PNGs replaced with exact original dialogs 1:24110 and 1:24564, labelled exploration; hashes and desktop/mobile review recorded |
| Full-size image zoom/readability | Implemented, final coverage/release pending | ProductCapture and Deal hero links added; Fusion phone original-image tap and native zoom manually verified. Remaining route coverage belongs to final review |
| Final whole-site UI/UX craft review | Open, after content/source work | All ten routes; details below |
| Final actual scroll-performance review | Open, after content/design | Reported late images; details below |
| Final exact-head CI, merge and production verification | Open | Earlier green head does not certify subsequent revisions |

## Shared UI and assets to recheck in the final review

These requests are implemented in prior releases or the current candidate. Do
not reopen settled direction; verify the final rendered and deployed states.

- All case content stays visible without accordions, including flow/data layers;
  keyboard and no-JavaScript reading remain usable.
- Consistent two-column case structure, nested rows, aligned Project status,
  compact labels and appropriate spacing at 1440/820/390/320px.
- Workflow rules above steps, arrows beside titles, separated journey phases
  without decorative vertical colour bars.
- Original product screens remain complete and readable, without unnecessary
  enlargement, blurry substitutions, duplicate shadows or unwanted caption bars.
- FX supplied data-layer SVG (source 305:336356), original journey artwork and
  decision loop retained; transparent surrounds and correct comparison framing.
- FX chart/compare/ticket composition uses real original vectors. Lower captures
  have clean edges; video has no extra top line; responsive screenshots keep padding.
- Home images, Fusion M3/M1 and Performance artwork, uoaui.ai art and persona
  graphics match current source mappings. Preserve original versus rebuild labels.
- Winking web/iOS screens and original art are integrated. Source inventory has
  339 files across weekly-superstar-tracker/ios/shared; local component captures
  use fictional Sample Family data and do not demonstrate backend synchronization.
- Mobile fullscreen game map fills usable space, has readable markers, supports
  swiping/tapping and returns to play correctly. Latest independent FX-phone and
  fullscreen-map visual checks passed; verify final deployed behavior too.

## Source-to-claim and graphic audit

For each material claim and graphic, record original source/node or revision,
current implementation, differences and correction or **unverified** status.
Figma shows design intent; a public rebuild does not prove historical production
behavior. Unknown research counts, outcomes and implementation rules stay unknown.

| Project | Required boundary | Current audit position |
|---|---|---|
| FX | Beta; NDA; public rebuild versus internal production | Source mappings and original vectors retained. Final claim/graphic reconciliation active; no bank screens, clients or invented adoption metrics |
| Fusion | Original designs and shipped work versus public rebuild | Current screens and specialist-from-start chronology retained. Final claim check must keep Analytics distinct from Data Manager and avoid attributing sales to design |
| uoaui.ai | Private alpha; implemented generation/export versus intended review practice | Corrected art/text remove unsupported forced review gates and measured-time claims. Final implementation/source reconciliation active |
| Winking Star | Actual web/iOS differences, sample versus real family data | WINKING-SOURCES.md records source revisions. First-use, offline/shared behavior and accessibility claims must be scoped to the evidenced platform |
| Deal Model | Original pricing/owner/approver evidence versus illustrative portfolio diagrams | Original inspected. Owner-written reasoning and actual iteration/rate states retained. Three unsupported alternative images hidden; two original smart-pricing dialogs restored as exploration. Source-art implementation block resolved locally; final deployed check pending |

Deal source nodes `1:19575` and `1:19659` support iteration creation and rate
validation; approver view `1:34619` supports comparison, comments and approval.
Unsupported 15%-Tier-B legal autorouting, missing-rate-card blocking and unmapped
column blocking were removed from local narrative. Journey return now refers to
TXN/SK rate review. Do not reintroduce these claims through old image lettering.

Decision coverage: 3 FX, 3 Fusion, 3 uoaui.ai, 6 Winking, 6 Deal. Each should
explain the problem, considered choices, evidence, rationale, consequences and
status. Scenario quotes/emotion curves are authored explorations, not participant
measurements. Original source art remains separate from newly readable explanations.

Audit documents: JOURNEY-RESEARCH.md, DECISION-AUDIT.md, VOICE-REVIEW.md,
WINKING-SOURCES.md and Figma sync/correction manifests. Their remaining factual
limits must survive the final review. Adjacent caveats alone do not verify a
contradictory graphic. Private prep is never published wholesale.

## Private voice-review sources

All eight files were confirmed present in `/Users/shannonhecker/Downloads/` and
reviewed. Final correction verification is active, not another request to reread
or publish private interview content.

- lseg-round-5-sai-speaker-notes.md
- lseg-round-5-sai-potukuchi-prep.md
- lseg-round-4-speaker-notes.md
- lseg-round-4-frank-higgs-prep.md
- lseg-round-3-speaker-notes.md
- lseg-round-3-jamie-coulson-prep.md
- lseg-round-2-paul-moreira-prep.md
- lseg-round-2-spoken-script.md

Check first-person voice, actual contribution/collaboration, chronology,
shipped/beta/alpha status and measured versus estimated impact. No participant
counts or metrics are inferred from interview shorthand.

## Final queue: whole-site craft, then scrolling, then release

After source-art/content and zoom changes, review as a designer, not only a test
runner. Iterate on concrete findings before closing delivery.

1. Inspect Home, Panel, FX, Fusion, uoaui.ai, Winking Star, Deal Model, Build,
   Privacy and 404. Check hierarchy, line lengths, spacing, alignment/navigation,
   project identity, useful media scale and transparent edges.
2. Review desktop/tablet/phone, light/dark, focus/keyboard, contrast, reduced
   motion, no-JavaScript content, links, full-size zoom and fullscreen map.
3. Review real desktop/mobile scrolling on every case. Record late images or
   blank media, lazy-load timing, decoding, SVG complexity, effects/shadows and
   animation behavior. Product-capture/hero trailing parallax was removed;
   text motion remains. Verify the result rather than assuming this resolves lag.
4. Verify the final exact commit with Astro check, production build, full browser
   suite, compiled API runtime, link checks and Lighthouse CI (95 minimum in every
   category on seven main routes × mobile/desktop). Manually check utility routes
   and bot-excluded App Store/LinkedIn links.
5. Record final PR/head, merge, deployment URL and production checks. PM does not
   merge. Mark overall completion only after source, implementation and live
   evidence agree, with any remaining factual limitations clearly documented.

Awwwards, Webby and FWA are the requested craft benchmark, not a certified award
or jury decision. Passing Lighthouse does not close visual or scroll review.

## Performance evidence and short release history

| Head / evidence | Result | Meaning |
|---|---|---|
| Main PR48 / 982ff55, CI38180336042 | FX mobile 84; LCP 4.43s; TBT 0; later routes not run | Historical failed gate |
| PR49 / 7d6c6bc, CI38182499828 | Build/check/API/browser/links passed; FX mobile 84, LCP 4.510s | Historical asset/persona checkpoint; superseded |
| PR49 / 2a2988d, CI38184120959 | All gates passed. Mobile 96–97, desktop 99–100; other categories 100 across 14 runs | Earlier verified candidate, not current persona revision |
| PR49 / 7057e7a, CI38185501523 | Local 149 tests / 58.9s and build passed; remote CI running | Current pushed candidate; later work still pending |

FX retains actual SVGs. Geometry compaction and load prioritization improved local
84 / LCP 4.5s to 95 / LCP 2.7s. Hero precision-three high-resolution mean channel difference
was below 0.005/255 at density 192; precision-eight data-layer output was pixel-identical.
Remote 2a2988d FX mobile scored 96. No rasterization, redrawing or lowered quality gate.

Diagnostics: `/private/tmp/fx-final-vectors-lh.json`,
`/private/tmp/portfolio-ci-pr49-38182499828/lh.json`,
`/private/tmp/pr49-2a2988d-ci.log`. Simulated LCP render-delay attribution differed
from the actual trace; unused SVG filter definitions were not active rendering
cost. Continue checking network/decode behavior for the separate scroll-lag report.
