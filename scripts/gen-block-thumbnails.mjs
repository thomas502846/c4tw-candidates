// Generates schematic wireframe thumbnails (one per block slug) for the
// Payload "add block" picker, replacing Payload's generic placeholder.
// Output: public/block-thumbnails/<slug>.svg  (≈3:2, light neutral wireframe)
//
// Run: node scripts/gen-block-thumbnails.mjs
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/block-thumbnails')

// palette — neutral grays + one brand-green accent, reads on the white picker card
const BG = '#f3f4f6'
const BOX = '#dfe3e8'
const LINE = '#c4cad1'
const DARK = '#aab0b8'
const GREEN = '#8aa88a'

const W = 300
const H = 200

// primitive helpers
const r = (x, y, w, h, fill = BOX, rx = 4) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`
const c = (cx, cy, rad, fill = LINE) => `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}"/>`
const ln = (x, y, w, fill = LINE, h = 6) => r(x, y, w, h, fill, 3)
const tri = (cx, cy, s, fill = '#fff') =>
  `<polygon points="${cx - s},${cy - s} ${cx - s},${cy + s} ${cx + s},${cy}" fill="${fill}"/>`

// row of n evenly spaced cards inside [x..x+w]
const cards = (x, y, w, h, n, gap, draw) => {
  const cw = (w - gap * (n - 1)) / n
  let out = ''
  for (let i = 0; i < n; i++) out += draw(x + i * (cw + gap), y, cw, h, i)
  return out
}

// per-slug schematic
const S = {
  hero: () =>
    r(14, 14, 272, 172, BOX, 8) +
    ln(95, 80, 110, '#fff') +
    ln(110, 96, 80, '#fff') +
    r(120, 120, 60, 18, GREEN, 9),
  pageHeader: () =>
    r(14, 40, 272, 120, GREEN, 8) + r(14, 40, 10, 120, '#6f8a6f', 0) + ln(40, 90, 130, '#fff', 10) + ln(40, 110, 80, '#cfe0cf'),
  newsTicker: () => r(14, 88, 272, 24, BOX, 12) + c(34, 100, 6, GREEN) + ln(50, 97, 200),
  content: () =>
    ln(20, 50, 90, DARK, 10) + ln(20, 74, 130) + ln(20, 90, 130) + ln(20, 106, 100) + r(180, 50, 100, 100, BOX, 8),
  timeline: () => {
    let s = r(148, 20, 4, 160, LINE, 2)
    const ys = [40, 80, 120, 160]
    ys.forEach((y, i) => {
      s += c(150, y, 7, GREEN)
      s += i % 2 ? r(170, y - 14, 90, 28, BOX, 6) : r(40, y - 14, 90, 28, BOX, 6)
    })
    return s
  },
  statsCards: () =>
    cards(20, 60, 260, 80, 4, 12, (x, y, w, h) => r(x, y, w, h, BOX, 6) + ln(x + 10, y + 22, w - 20, DARK, 14) + ln(x + 12, y + 50, w - 30)),
  awards: () =>
    [0, 1, 2, 3].map((i) => ln(20, 50 + i * 26, 130)).join('') + r(180, 50, 100, 100, BOX, 8),
  articleCards: () =>
    cards(16, 50, 268, 110, 3, 12, (x, y, w) => r(x, y, w, 60, BOX, 6) + ln(x + 8, y + 72, w - 16, DARK) + ln(x + 8, y + 86, w - 30)),
  logoWall: () => cards(20, 80, 260, 40, 5, 12, (x, y, w, h) => r(x, y, w, h, BOX, 6)),
  quote: () =>
    `<text x="40" y="80" font-size="60" fill="${LINE}" font-family="Georgia">“</text>` +
    ln(70, 70, 170, DARK) + ln(80, 92, 150) + r(120, 130, 60, 12, LINE, 6),
  twoColumn: () => r(20, 45, 120, 110, BOX, 8) + ln(165, 60, 110, DARK, 10) + ln(165, 86, 110) + ln(165, 102, 110) + ln(165, 118, 70),
  numberedFeatures: () =>
    `<text x="24" y="78" font-size="38" font-weight="700" fill="${DARK}" font-family="Arial">01</text>` +
    ln(90, 56, 180, DARK) + ln(90, 78, 150) +
    `<text x="24" y="150" font-size="38" font-weight="700" fill="${LINE}" font-family="Arial">02</text>` +
    ln(90, 128, 180) + ln(90, 150, 120),
  taCta: () => cards(16, 50, 268, 110, 3, 12, (x, y, w, h) => r(x, y, w, h, BOX, 8) + r(x + w / 2 - 20, y + h - 26, 40, 14, GREEN, 7)),
  videoBlock: () => r(14, 24, 272, 152, BOX, 8) + c(150, 100, 28, '#fff') + tri(152, 100, 12, GREEN),
  missionCircles: () => cards(30, 70, 240, 60, 3, 24, (x, y, w, h) => c(x + w / 2, y + 30, 28, BOX)),
  iconFeatures: () =>
    cards(16, 50, 268, 110, 3, 12, (x, y, w, h) => r(x, y, w, h, BOX, 8) + c(x + w / 2, y + 32, 14, GREEN) + ln(x + 12, y + 62, w - 24) + ln(x + 16, y + 78, w - 40)),
  stepsBlock: () => {
    let s = ''
    s += cards(16, 70, 268, 60, 3, 24, (x, y, w, h) => r(x, y, w, h, BOX, 8) + ln(x + 12, y + 24, w - 24, DARK) + ln(x + 12, y + 40, w - 40))
    s += `<text x="105" y="106" font-size="22" fill="${DARK}">→</text><text x="197" y="106" font-size="22" fill="${DARK}">→</text>`
    return s
  },
  infographic: () => c(125, 100, 50, BOX) + c(185, 100, 50, DARK) + c(60, 60, 12, GREEN) + c(60, 140, 12, GREEN) + c(250, 60, 12, GREEN),
  tabsBlock: () =>
    cards(16, 30, 268, 24, 4, 8, (x, y, w, h, i) => r(x, y, w, h, i === 0 ? GREEN : BOX, 6)) + r(16, 64, 268, 120, BOX, 8),
  pillarCards: () => {
    const xs = [20, 88, 156, 224]
    const hs = [120, 90, 130, 100]
    const ys = [60, 80, 50, 75]
    return xs.map((x, i) => r(x, ys[i], 56, hs[i], i === 2 ? GREEN : BOX, 8)).join('')
  },
  mapLocations: () => r(40, 30, 220, 150, BOX, 10) + c(95, 80, 8, GREEN) + c(170, 110, 8, GREEN) + c(130, 150, 8, GREEN) + c(210, 70, 8, GREEN),
  photoStrip: () => cards(8, 60, 284, 80, 5, 6, (x, y, w, h) => r(x, y, w, h, BOX, 4)),
  ctaBanner: () => r(20, 60, 260, 80, BOX, 10) + ln(70, 84, 160, DARK, 10) + r(120, 112, 60, 16, GREEN, 8),
  cta: () => ln(24, 70, 150, DARK, 10) + ln(24, 92, 120) + ln(24, 108, 120) + r(200, 78, 70, 18, GREEN, 9) + r(200, 104, 70, 18, LINE, 9),
  mediaBlock: () => r(50, 30, 200, 130, BOX, 8) + ln(90, 170, 120),
  archive: () => [0, 1, 2, 3, 4].map((i) => ln(30, 44 + i * 26, 240)).join(''),
  banner: () => r(24, 70, 252, 60, BOX, 10) + c(48, 100, 12, GREEN) + ln(72, 90, 180) + ln(72, 106, 140),
  code: () =>
    r(24, 30, 252, 140, '#e7eaee', 8) + c(40, 46, 4, DARK) + c(54, 46, 4, DARK) + c(68, 46, 4, DARK) +
    [0, 1, 2, 3].map((i) => ln(40, 70 + i * 22, [120, 180, 90, 150][i])).join(''),
}

const svg = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
  `<rect width="${W}" height="${H}" rx="6" fill="${BG}"/>${inner}</svg>\n`

await mkdir(dir, { recursive: true })
let n = 0
for (const [slug, draw] of Object.entries(S)) {
  await writeFile(path.join(dir, `${slug}.svg`), svg(draw()))
  n++
}
console.log(`wrote ${n} thumbnails to ${dir}`)
