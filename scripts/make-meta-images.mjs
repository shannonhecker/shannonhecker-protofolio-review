// Generates the favicon set and the Open Graph image into public/.
// Run once with `node scripts/make-meta-images.mjs`; outputs are committed.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

// DECISION: a plain SH monogram in the page's ink colour until Shannon
// art-directs a mark. SVG favicons can't load web fonts, so it uses the
// system grotesk.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#161616"/><text x="32" y="42" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="28" letter-spacing="-1.5" fill="#ffffff">SH</text></svg>`;
await writeFile('public/favicon.svg', svg);
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
const png32 = await sharp(Buffer.from(svg)).resize(32, 32).png().toBuffer();
// Minimal single-image ICO wrapping the PNG.
const head = Buffer.alloc(22);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12);
head.writeUInt32LE(png32.length, 14); head.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([head, png32]));

// OG: the hero image, cropped to 1200x630 on the same focal point as the hero.
await sharp('src/assets/img/fx-cover.jpg').resize(1200, 630, { fit: 'cover', position: 'right' }).jpeg({ quality: 82, mozjpeg: true }).toFile('public/og.jpg');
console.log('ok');
