// Headless broken-image scan: 6 pages × (desktop 1440 + mobile 402).
// Flags any <img> with naturalWidth===0 after networkidle + full scroll (lazy-load + ScrollReveal).
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3000'
const SLUGS = ['', 'about', 'care', 'training', 'school', 'contact']
const ROUTES = []
for (const s of SLUGS) {
  ROUTES.push('/' + s)
  ROUTES.push('/en/' + s)
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
  { name: 'mobile', width: 402, height: 850, dsf: 2 },
]

async function scrollThrough(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0
      const step = () => {
        window.scrollTo(0, y)
        y += window.innerHeight * 0.8
        if (y < document.body.scrollHeight) {
          setTimeout(step, 120)
        } else {
          window.scrollTo(0, document.body.scrollHeight)
          setTimeout(resolve, 400)
        }
      }
      step()
    })
  })
}

const broken = []
const browser = await chromium.launch({ args: ['--no-sandbox'] })
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dsf,
  })
  for (const route of ROUTES) {
    const url = (route === '/' ? BASE + '/' : BASE + route).replace(/\/$/, route === '/' ? '/' : '')
    const page = await ctx.newPage()
    try {
      const resp = await page.goto(BASE + (route === '/' ? '' : route) + (route === '/' ? '/' : ''), {
        waitUntil: 'networkidle',
        timeout: 45000,
      })
      const status = resp ? resp.status() : 0
      await scrollThrough(page)
      await page.waitForTimeout(800)
      const imgs = await page.evaluate(() =>
        Array.from(document.images).map((im) => ({
          src: im.currentSrc || im.src,
          nw: im.naturalWidth,
          nh: im.naturalHeight,
        })),
      )
      const bad = imgs.filter((i) => i.nw === 0 && i.src && !i.src.startsWith('data:'))
      console.log(`[${vp.name}] ${route} status=${status} imgs=${imgs.length} broken=${bad.length}`)
      for (const b of bad) {
        broken.push({ viewport: vp.name, route, src: b.src })
        console.log(`    BROKEN: ${b.src}`)
      }
    } catch (e) {
      console.log(`[${vp.name}] ${route} ERROR ${e.message}`)
      broken.push({ viewport: vp.name, route, src: 'NAV_ERROR:' + e.message })
    } finally {
      await page.close()
    }
  }
  await ctx.close()
}
await browser.close()
console.log('---')
console.log('TOTAL_BROKEN=' + broken.length)
process.exit(broken.length === 0 ? 0 : 2)
