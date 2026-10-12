# Product media sizing and themes · 12 October 2026

The Winking Star hero collapsed to its min-content width because its centred grid item had auto margins without an explicit width. At a 390px viewport it occupied 117px of the available 350px. All project heroes now explicitly use their grid column; phone captures use the full available width without cropping.

`src/lib/adaptive-art.ts` lists the audited outer presentation layers for 22 compositions: eight case compositions, four individual Winking phones, and ten home gallery desktop/mobile compositions. The static `/art/transparent/` route applies the same treatment to their existing responsive derivatives. These layers have an explicit `fill="none"`, so the real page colour shows through in both light and dark mode. No SVG media query or theme propagation is required. The old `/art/adaptive/` paths remain available for cached pages; new URLs prevent reuse of the previous conditional image files.

## Correction after phone feedback

PR #50 used an SVG `prefers-color-scheme` rule that passed Chrome and current WebKit, but Shannon's iPhone in-app browser still showed the cream surround. A controlled Chromium regression with a dark page and light image-container colour scheme reproduced the failure. The correction removes those fills at build time instead. This also removes the cream/pastel presentation blocks in light mode, letting the white page show through.

Actual product UI backgrounds, phone frames, screenshots and illustrations keep their authored colours. Full-resolution links still open the untouched originals. No inversion, multiply filter, new raster encoding, generated artwork or Figma edits are involved. Raster-only screenshots with backgrounds inside the product remain intact; recolouring those would misrepresent the product.

Regression checks cover full hero width and page overflow at 320, 390, 430 and 820px across all five products; exact source recovery after restoring only audited fill attributes; and rendered background/phone-screen pixels when the site theme changes while the image container is forced to a light colour scheme. The focused media suite runs under both Chromium and iPhone-configured WebKit in CI. This is browser-engine coverage, not a claim of physical-device testing.
