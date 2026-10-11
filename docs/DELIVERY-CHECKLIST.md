# Portfolio completion checklist

Current audit: 11 October 2026. This is the active checklist; older TASKS.md and
QUALITY.md entries describe historical releases, not proof of current completion.

Status definitions: **Live, recheck** means the build log records delivery but a
fresh final audit is still required. **Local** is not deployed. **Open** requires
work. Completion requires the source, rendered result and deployed result to agree.

## Shared layout and interaction

| Request | Status | Evidence / remaining check |
|---|---|---|
| Keep case sections visible; remove content accordions, including Read the flow and data layers | Live, recheck | Shared authored components; verify all five routes, keyboard and no-JS |
| Maintain consistent two-column case layout | Live, recheck | Case templates; inspect nested rows and product sections at 1440/820/390/320px |
| Reduce oversized or blurry screenshots; preserve full content | Live, recheck | Pic/ProductCapture, Figma source mappings; compare source and rendered dimensions |
| Remove redundant capture metadata, View full size and live-link caption bars | Live, recheck | ProductCapture; audit every case for remaining unwanted caption bars |
| Align Project status with surrounding content | Live, recheck | FX status row; inspect desktop and mobile |
| Put workflow rules above steps; align arrows with title row | Live, recheck | Flow and shared CSS; verify all variants |
| Remove vertical colour bars from journey phases; increase separation | Live, recheck | AuthoredJourney and FxOriginalJourney; recheck after new journey work |
| Tighten all persona typography to match site, keep updated colours/art | Local | PersonaCard and AuthoredPersonas; desktop/mobile reviewed, publish pending |
| Self-inspect craft to the requested awards-level benchmark | Open | No external award claim; complete visual, responsive, accessibility, motion and source audit |

## Assets and project content

| Request | Status | Evidence / remaining check |
|---|---|---|
| FX exact supplied data-layer SVG, no recreation | Live, recheck | public/art/fx-data-layers.svg and original source node 305:336356 |
| FX exact journey artwork, readable persona/scenario/stage text | Live; revision open | Original SVG retained; new product-specific journey research requested |
| FX decision loop transparent surrounding background | Live, recheck | Inspect source/export and rendered surface |
| FX comparison cards: remove extra image padding/background | Live, recheck | AuthoredDecisions and figma-sync browser checks |
| FX latest screenshots, comparison graphics and persona backgrounds | Live, recheck | docs/figma-fx-screenshot-sync.json; compare current Figma fills |
| FX screenshots without hard outlines/duplicate shadows; remove video top line | Live, recheck | ProductCapture and video styles, inspect all lower captures |
| FX overlap chart/compare/ticket with transparent foreground SVG panels | Live, recheck | Original exported vectors; keep real vectors, do not wrap raster for false sharpness |
| FX responsive screenshot padding | Live, recheck | Responsive capture group |
| Home latest Figma images/graphics | Live, recheck | Compare current home Figma to deployed gallery |
| Fusion updated screen graphics, M3/M1 originals | Partly live, local remainder | Five vector exports live; opening Performance selection and portraits local |
| uoaui.ai latest images/graphics | Live, recheck | Prior PR48 and source mapping; preserve current art |
| Winking Star current web/app screens and original artwork | Local | Original web components with fictional sample data; Figma iPhone screens, source asset inventory |
| Winking Star rethink workflow and product content; compare web/app | Local | CaseWinking and WinkingScreens; further journey revision requested |
| Find original code for Winking images | Located | weekly-superstar-tracker, weekly-superstar-ios, weekly-superstar-shared; 339 image inventory entries |
| Deal Model newly updated portfolio images | Open | Portfolio file frame 233:460, page 230:592; newly supplied on this turn |
| Deal Model original project review | Open | MhZ5D5sh8DZgOTYdLXX8It, node 0:1; inspect stages and image evidence |
| Deal Model repair broken Figma graphics using live site | Earlier repair, recheck | Six pairs repaired previously; compare new art before any edits |

## Source-to-claim and graphic audit: required for every project

Map each material claim and graphic to its original source, the relevant current
implementation state and the rendered case. Record source revision/node,
implemented behavior, differences, and the resulting correction or **unverified**
status. Figma depicts design intent; a public rebuild does not independently
prove the original production implementation. Visual consistency alone is not
completion of this audit.

| Project | Required cross-reference | Current status / evidence limits |
|---|---|---|
| FX | Original Figma UI/journey/data-layer nodes, current public rebuild code and UI, case narrative and graphics | Open final audit. NDA prohibits real internal screens. Confirm beta status and label rebuilds; do not infer internal usage/KPIs from a public rebuild. |
| Fusion | Original Fusion design and portfolio nodes, current dashboard rebuild/source, historical production narrative and exact graphics | Open final audit. Screen-sync mappings do not validate every production claim. Preserve original versus rebuild distinctions and specialist-from-start chronology. |
| uoaui.ai | Current builder/UI Kit implementation, original design/brand sources, portfolio mappings and claimed generation/inspection workflow | Open final audit. Private alpha; proposed validation and desired outcomes are not measured adoption or shipped client outcomes. |
| Winking Star | Web/iOS revisions, shared domain/tokens, platform flows, Figma screens, assets and case statements | Partial source audit in `WINKING-SOURCES.md`; full claim/graphic reconciliation open. Component captures with sample data do not prove live sync; web setup differs from iPhone Sample Family entry. |
| Deal Model | Updated portfolio frame `233:460`, original file `MhZ5D5sh8DZgOTYdLXX8It` node `0:1`, actual implementation/public source where available, case claims/graphics | Root inspecting original source. Claims not yet traced remain unverified; previously repaired images do not complete this audit. |

Close each row only when discrepancies are resolved or explicitly labelled,
including unsupported research counts, behavior, statuses, dates and impact
claims. Keep private source details in audit notes rather than public case copy.

## Distinct journeys: latest direction

Shared type and spacing remain consistent. The five journeys must communicate
different work, not repeat one emotion chart and phase-card template. Keep exact
original graphics as source material. Do not invent observations or measured emotions.

| Project | Proposed structure grounded in existing case | Status |
|---|---|---|
| FX | Order lifecycle with monitor/intervene/return loop and post-trade evidence | Research started; implementation open |
| Fusion | Data selection, analysis/refinement, presentation and reuse | Research started; implementation open |
| uoaui.ai | Designer/system exchanges with correction and inspection loops | Research started; implementation open |
| Winking Star | Parent/child/caregiver handoffs across first use, daily and weekly loops | Source reviewed; implementation open |
| Deal Model | Shared deal object, pricing iterations, approval gate and return path | Original-source inspection underway |

## Figma, game and voice

| Request | Status | Evidence / remaining check |
|---|---|---|
| Fix Figma padding and gaps after content sync, preserve updated graphics | Open final pass | uoaui spacing previously repaired; audit all desktop/mobile frames and exact asset fills |
| Sync readable journey treatment across projects in Figma | Earlier pass live; new revision open | Latest distinct-journey brief supersedes generic shared presentation |
| Mobile fullscreen game map fills available space with readable details | Live, recheck | Re-run real fullscreen/map interaction at phone sizes; source/test evidence required |
| Interview voice/content review from eight LSEG prep files | Queued | Read local Downloads files supplied 11 October; private reference only, never publish prep text wholesale |
| Verify entire site after edits | Open | Production build, Astro check, full browser suite, desktop/mobile inspection, links/assets and current release gates |
| Publish and verify live | Open | Current branch design/winking-product-refresh is not deployed |

## Current verification

- Local branch: `design/winking-product-refresh`, based on `982ff55` (PR #48).
  Worktree changes are not committed or deployed. No PR for this branch was
  present in the latest GitHub PR inventory.
- Astro check: root reports 0 errors, 0 warnings, 4 unused-symbol hints.
  Production build passes according to the root's current run.
- Previous browser run: 148 passed, 1 failed on a removed Winking carousel.
  The test now checks the visible iPhone flow and four screen figures with
  JavaScript disabled. The replacement run completed: **149 passed in 57.7s**,
  verified from `/private/tmp/portfolio-release-tests.log`. Later implementation
  changes require their own current checks.
- GitHub confirms PR #48 merged on 11 October at 22:25 UTC. Its main-branch
  CI run [38180336042](https://github.com/shannonhecker/shannonhecker-protofolio-review/actions/runs/38180336042)
  failed the Lighthouse gate: `/fx` mobile performance **84**, with the other
  three categories at 100. The required minimum is 95 per category. Root and
  Panel passed before the run stopped; later routes were not measured by that
  run. Merged is not proof of passing release gates or a verified deployment.
- Latest source audit confirms ten route files, including Deal Model. Final
  manual review must cover all ten; Lighthouse CI covers the seven main routes
  at both device presets. Check remaining utility routes manually.
- Release checks also include compiled API runtime, link CI and manual checks
  for bot-excluded App Store/LinkedIn links. Do not substitute browser test
  totals for these independent gates.

## PM completion blockers and closure evidence

1. Finish distinct product journeys and record source-to-diagram mappings for
   all five cases. Existing shared presentation is not acceptance of this new
   direction. Avoid inferred research participants, emotions or measured results.
2. Inspect the updated Deal Model portfolio frame `233:460` on page `230:592`
   and original file `MhZ5D5sh8DZgOTYdLXX8It`, node `0:1`, before deciding what
   artwork or narrative changes are needed. Prior repaired pairs are not proof
   that the newly supplied source has been incorporated.
3. Complete the eight-file private voice review below. All eight files were
   confirmed present locally; content review remains queued. Publish only
   approved case corrections, never private prep files or interview transcripts.
4. Reconcile final Figma layout/asset states after content changes. Preserve
   independently updated original artwork; no blanket replacement of frames.
5. Finish the sitewide design review at the **back of the queue**, resolve its
   findings, then record final commit, checks, PR, deployment URL and production
   spot checks. The failed FX performance gate must be resolved, not waived by
   an earlier score or a merge.

Current evidence limits remain explicit: FX is beta and its screens are public
rebuilds; uoaui.ai is private alpha; Fusion production work is distinguished from
its public rebuild; Winking web component captures use fictional sample data
and do not prove backend sync. Keep unsupported KPI/testing counts open in the
Revolut evidence audit rather than inventing values to fill the checklist.

## Private voice-review queue

All located in `/Users/shannonhecker/Downloads/`:

- lseg-round-5-sai-speaker-notes.md
- lseg-round-5-sai-potukuchi-prep.md
- lseg-round-4-speaker-notes.md
- lseg-round-4-frank-higgs-prep.md
- lseg-round-3-speaker-notes.md
- lseg-round-3-jamie-coulson-prep.md
- lseg-round-2-paul-moreira-prep.md
- lseg-round-2-spoken-script.md

Check first-person tone, concrete design decisions, personal contribution,
collaboration, project chronology, shipped/beta/alpha status, and measured versus
estimated outcomes. Capture corrections without revealing private interview material.

## Final queue item: whole-site UI/UX design review

Added explicitly at Shannon's request, after asset sync, distinct journeys,
interview voice/content review and Figma repairs. Review every route as a designer,
not only as a test runner. Iterate on findings before closing delivery.

- Home/panel, FX, Fusion, uoaui.ai, Winking Star, Deal Model, build, privacy and 404.
- Shared type hierarchy, line lengths, spacing rhythm, section alignment and navigation.
- Individual project identity and appropriate journey structures within the shared system.
- Original media fidelity, useful image scale, transparent surrounds and consistent edges.
- Desktop, tablet and phone composition; no clipped content or unintended overflow.
- Light/dark themes, keyboard focus, contrast, reduced motion and no-JavaScript content.
- Mobile fullscreen game map readability and touch interaction.
- Real production routes and assets after deployment, plus current release checks.

Awwwards, Webby and FWA are the requested craft benchmark. No award, jury approval
or external validation is claimed. Keep this item open until recorded visual
inspection and release evidence cover all requirements and remaining defects.
