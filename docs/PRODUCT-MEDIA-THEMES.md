# Product media sizing and themes · 12 October 2026

The Winking Star hero collapsed to its min-content width because its centred grid item had auto margins without an explicit width. At a 390px viewport it occupied 117px of the available 350px. All project heroes now explicitly use their grid column; phone captures use the full available width without cropping.

`src/lib/adaptive-art.ts` lists the audited outer presentation layers for 22 compositions: eight case compositions, four individual Winking phones, and ten home gallery desktop/mobile compositions. The static `/art/adaptive/` route applies the same treatment to their existing responsive derivatives. Only those background layers lose their fill in dark mode, letting the actual page colour show through. Light mode retains the original presentation. The SVG media query follows the embedding page's `color-scheme`, so it responds to the site's explicit toggle, independent of the OS theme.

Actual product UI backgrounds, phone frames, screenshots and illustrations keep their authored colours. Full-resolution links still open the untouched originals. No inversion, multiply filter, new raster encoding, generated artwork or Figma edits are involved. Raster-only screenshots with backgrounds inside the product remain intact; recolouring those would misrepresent the product.

Regression checks cover full hero width and page overflow at 320, 390, 430 and 820px across all five products; exact source recovery after removing theme metadata; and rendered background/phone-screen pixels when the site theme changes against a light OS preference.
