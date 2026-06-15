import { chromium } from '@playwright/test'
import fs from 'node:fs'

const OUT = '/tmp/c4tw-audit'
fs.mkdirSync(OUT, { recursive: true })

const BASE = 'http://localhost:3000'
const PAGES = [
  { slug: 'home', path: '/' },
  { slug: 'about', path: '/about' },
  { slug: 'care', path: '/care' },
  { slug: 'training', path: '/training' },
  { slug: 'school', path: '/school' },
  { slug: 'contact', path: '/contact' },
]
const WIDTHS = [375, 768]

const browser = await chromium.launch()
const report = {}

async function autoScroll(page) {
  // scroll through whole doc in steps to trigger IntersectionObserver / lazy imgs
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    const h = document.body.scrollHeight
    for (let y = 0; y <= h; y += Math.round(window.innerHeight * 0.6)) {
      window.scrollTo(0, y)
      await sleep(120)
    }
    window.scrollTo(0, document.body.scrollHeight)
    await sleep(300)
    window.scrollTo(0, 0)
    await sleep(150)
  })
}

async function measure(page, vw) {
  return await page.evaluate((vw) => {
    const doc = document.documentElement
    const pageOverflow = Math.max(0, doc.scrollWidth - doc.clientWidth)
    const offenders = []
    const all = document.querySelectorAll('body *')
    for (const el of all) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      const cs = getComputedStyle(el)
      if (cs.position === 'fixed' || cs.visibility === 'hidden' || cs.display === 'none') continue
      // element pushes past the right viewport edge
      if (r.right > vw + 1.5 && r.left < vw) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && el.className.toString().slice(0, 60)) || '',
          right: Math.round(r.right),
          width: Math.round(r.width),
          left: Math.round(r.left),
          text: (el.textContent || '').trim().slice(0, 40),
        })
      }
    }
    // stuck-invisible: inline opacity 0 with real size & in document flow (broken ScrollReveal)
    const stuck = []
    for (const el of all) {
      const r = el.getBoundingClientRect()
      if (r.width < 20 || r.height < 20) continue
      const cs = getComputedStyle(el)
      if (parseFloat(cs.opacity) < 0.05 && cs.display !== 'none' && cs.visibility !== 'hidden') {
        stuck.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && el.className.toString().slice(0, 50)) || '',
          text: (el.textContent || '').trim().slice(0, 40),
        })
      }
    }
    // dedupe offenders by cls+text, keep widest
    const seen = new Map()
    for (const o of offenders) {
      const k = o.tag + o.cls + o.text
      if (!seen.has(k) || seen.get(k).right < o.right) seen.set(k, o)
    }
    return { pageOverflow, offenders: [...seen.values()].sort((a, b) => b.right - a.right).slice(0, 12), stuck: stuck.slice(0, 10) }
  }, vw)
}

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  for (const p of PAGES) {
    const key = `${p.slug}@${w}`
    try {
      await page.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 45000 })
      await autoScroll(page)
      const m = await measure(page, w)
      await page.screenshot({ path: `${OUT}/${p.slug}-${w}.png`, fullPage: true })
      report[key] = m
      console.log(`${key}  overflow=${m.pageOverflow}px  offenders=${m.offenders.length}  stuck=${m.stuck.length}`)
    } catch (e) {
      report[key] = { error: String(e).slice(0, 200) }
      console.log(`${key}  ERROR ${String(e).slice(0, 120)}`)
    }
  }
  await ctx.close()
}

// menu-open capture (375)
try {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.click('button[aria-label="開啟選單"]')
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/home-menu-375.png`, fullPage: false })
  // expand a submenu
  const chev = page.locator('button[aria-label*="展開"], button:has(svg)').nth(1)
  console.log('menu-open captured')
  await ctx.close()
} catch (e) {
  console.log('menu capture ERROR', String(e).slice(0, 120))
}

fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2))
console.log('\n=== SUMMARY ===')
for (const [k, v] of Object.entries(report)) {
  if (v.error) { console.log(`${k}: ERROR`); continue }
  console.log(`${k}: overflow=${v.pageOverflow}px offenders=${v.offenders.length} stuck=${v.stuck.length}`)
}
await browser.close()
