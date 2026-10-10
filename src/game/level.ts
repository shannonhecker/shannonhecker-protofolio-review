// Greybox level for tuning feel. Concept-agnostic: art and theme come later.
// Four beats, Hayashida's introduce, develop, twist, then a short run to the
// finish. Legend:
//   #  solid      =  one-way platform (jump up through, land on top)
//   o  collectible    ^  hazard (one hit, knockback)
//   P  spawn      C  checkpoint      F  finish
// 17 rows × 32px = 544px; the bottom row sits just below the 540px view.

export const LEVEL = [
  '                                                                                                    ',
  '                                                                                                    ',
  '                                                                                                    ',
  '                                                                                                    ',
  '                                                                          o                         ',
  '                                                       o   o            ====                        ',
  '                                                      ===  ===                                      ',
  '                                    o                                ====        o                  ',
  '                                   ===           o                                ==                F',
  '                     o                          ===        ====   ====                        o    ##',
  '                    ===        o                                                  o   o      ==   ###',
  '           o                  ===     o    =====                                             ##   ###',
  '          ===           o                ===                  o                            ####   ###',
  '  P     o           C  ===         C            ^^      ^^   C     ^^                 C  o #####   ###',
  '###########   ##########   ######################  ####  ##################    ##################   ',
  '###########   ##########   ######################  ####  ##################    ##################   ',
  '###########   ##########   ######################  ####  ##################    ##################   ',
];

export type Tile = '#' | '=' | ' ';

export function parse(rows: string[]) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const tiles: Tile[][] = [];
  const items: { x: number; y: number; kind: 'o' | '^' | 'C' | 'F' }[] = [];
  let spawn = { x: 0, y: 0 };
  for (let y = 0; y < h; y++) {
    tiles[y] = [];
    for (let x = 0; x < w; x++) {
      const c = rows[y][x] ?? ' ';
      tiles[y][x] = c === '#' || c === '=' ? c : ' ';
      if (c === 'P') spawn = { x, y };
      if (c === 'o' || c === '^' || c === 'C' || c === 'F') items.push({ x, y, kind: c });
    }
  }
  return { w, h, tiles, items, spawn };
}
