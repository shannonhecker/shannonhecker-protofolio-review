// Shannon's career, world by world. Sources: her CV (assets/CV_ShannonH.pdf on
// shannonhecker.com) and her own words in the build conversation. Keep these
// matching LinkedIn: the panel checks dates.
// 捷元電腦: 2010 (Shannon, "maybe it's 2010"; earlier she said 2012). Check LinkedIn.
export const JOURNEY = [
  { place: 'Kaohsiung 高雄', when: 'Growing up', line: 'Grew up by the sea in Kaohsiung, in the city by the park, on a motorbike most days.', href: null },
  { place: 'Ling Tung University', when: '2008 to 2010', line: 'BA in Digital Media Arts and Management, Taiwan.', href: null },
  { place: '捷元電腦', when: '2010', line: 'Web and visual designer, B2C.', href: null },
  { place: 'London Metropolitan University', when: '2015 to 2016', line: 'MA in Digital Media. The move to the UK.', href: null },
  { place: 'J.P. Morgan, London', when: 'June 2016 to 2025', line: 'Intern, Analyst, Senior Analyst, then Vice President, Product Design. UI and visual first, then UI and UX together. Fusion at the top.', href: '/fusion' },
  { place: 'Barclays, London', when: '2025 to now', line: 'Senior Product Designer, FX and MarketsOne.', href: '/fx' },
  { place: 'Next: AI', when: '2026 to now', line: 'uoaui.ai, an AI-native product I design and build. The model drafts, I decide.', href: '/uoaui' },
  { place: 'Winking Star', when: 'Bonus · 2026', line: 'A family routine app, designed and shipped solo on the App Store.', href: '/winking-star' },
] as const;

/** Which world each case page links to. */
export const CASE_WORLD: Record<string, number> = { '/fusion': 4, '/fx': 5, '/uoaui': 6, '/winking-star': 7 };
