// The four index rows, copy unchanged from the prototype. Used by the home
// index and by the next-case row at the end of each case page.
export const CASES = [
  {
    "href": "/fx",
    "peek": "fx-cover.jpg",
    "n": "01",
    "vt": "fx",
    "title": "FX execution analytics",
    "meta": "Barclays · 2025 to now · in beta. Five spreadsheets and a static chart became one chart a trader can act from.",
    "arrow": "Read →",
    "img": "fx-cover.jpg"
  },
  {
    "href": "/fusion",
    "peek": "fusion-cover.jpg",
    "n": "02",
    "vt": "fusion",
    "title": "Fusion analytics dashboard",
    "meta": "J.P. Morgan · 2023 to 2025 · shipped. Board-ready analytics on Salt, zero accessibility violations, opened to clients in phase two.",
    "arrow": "Read →",
    "img": "fusion-cover.jpg"
  },
  {
    "href": "/winking-star",
    "peek": "ws-marketing.jpg",
    "n": "03",
    "vt": "winking",
    "title": "Winking Star",
    "meta": "Solo · live on the App Store · v1.0.4. A warm, ad-free routine app for families. Designed, built and shipped by me.",
    "arrow": "Read →",
    "img": "ws-marketing.jpg"
  },
  {
    "href": "/uoaui",
    "peek": "fx-action.jpg",
    "n": "04",
    "vt": "ai",
    "title": "uoaui.ai and how I use AI",
    "meta": "Private alpha. A design platform on Claude that builds screens from real design systems, and where a designer still matters.",
    "arrow": "Read →",
    "img": "fx-action.jpg"
  }
] as const;

export type CaseRow = (typeof CASES)[number];
