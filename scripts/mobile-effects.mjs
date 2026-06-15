import { chromium } from '@playwright/test'

const BASE = 'http://localhost:3000'
const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 375, height: 800 },
  deviceScaleFactor: 2,
  hasTouch: true,
  isMobile: true,
})
const page = await ctx.newPage()
const log = (...a) => console.log(...a)

// ---------- 1. Sticky header ----------
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
const header = await page.evaluate(() => {
  const h = document.querySelector('header')
  if (!h) return { found: false }
  const cs = getComputedStyle(h)
  return { found: true, position: cs.position, top: cs.top, zIndex: cs.zIndex }
})
// scroll down, check header still visible at top
await page.evaluate(() => window.scrollTo(0, 1200))
await page.waitForTimeout(300)
const headerAfter = await page.evaluate(() => {
  const h = document.querySelector('header')
  const r = h.getBoundingClientRect()
  return { topAfterScroll: Math.round(r.top), visible: r.bottom > 0 }
})
log('1) STICKY HEADER:', JSON.stringify({ ...header, ...headerAfter }))
await page.evaluate(() => window.scrollTo(0, 0))

// ---------- 2. Hero carousel auto-advance + swipe ----------
await page.waitForTimeout(200)
const heroProbe = await page.evaluate(() => {
  // find a horizontal track inside hero: a flex child with translateX-able transform
  const candidates = [...document.querySelectorAll('[class*="shrink-0"]')].filter((el) => {
    const r = el.getBoundingClientRect()
    return r.width >= 300 && r.top < 700
  })
  const slide = candidates[0]
  const track = slide?.parentElement
  return {
    candidates: candidates.length,
    trackTransform: track ? getComputedStyle(track).transform : null,
    slideCount: track ? track.children.length : 0,
  }
})
const t0 = await page.evaluate(() => {
  const el = [...document.querySelectorAll('[class*="shrink-0"]')].find((e) => e.getBoundingClientRect().width >= 300 && e.getBoundingClientRect().top < 700)
  return el ? getComputedStyle(el.parentElement).transform : null
})
await page.waitForTimeout(4500) // wait for auto-advance (3-4s)
const t1 = await page.evaluate(() => {
  const el = [...document.querySelectorAll('[class*="shrink-0"]')].find((e) => e.getBoundingClientRect().width >= 300 && e.getBoundingClientRect().top < 700)
  return el ? getComputedStyle(el.parentElement).transform : null
})
log('2) HERO CAROUSEL:', JSON.stringify(heroProbe), '| transform t0->t1 changed:', t0 !== t1, `(${t0} -> ${t1})`)

// swipe test
let swipeChanged = false
try {
  const box = await page.evaluate(() => {
    const el = [...document.querySelectorAll('[class*="shrink-0"]')].find((e) => e.getBoundingClientRect().width >= 300 && e.getBoundingClientRect().top < 700)
    const r = el.getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
  })
  const before = t1
  await page.touchscreen.tap(box.x, box.y)
  // simulate swipe left
  await page.mouse.move(300, box.y)
  await page.evaluate(async (y) => {
    const el = document.elementFromPoint(300, y)
    function fire(type, x) {
      const t = new Touch({ identifier: 1, target: el, clientX: x, clientY: y })
      el.dispatchEvent(new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true, cancelable: true }))
    }
    fire('touchstart', 320)
    await new Promise((r) => setTimeout(r, 30))
    for (let x = 320; x >= 60; x -= 40) { fire('touchmove', x); await new Promise((r) => setTimeout(r, 20)) }
    fire('touchend', 60)
  }, box.y)
  await page.waitForTimeout(800)
  const after = await page.evaluate(() => {
    const el = [...document.querySelectorAll('[class*="shrink-0"]')].find((e) => e.getBoundingClientRect().width >= 300 && e.getBoundingClientRect().top < 700)
    return el ? getComputedStyle(el.parentElement).transform : null
  })
  swipeChanged = before !== after
} catch (e) {
  swipeChanged = 'err:' + String(e).slice(0, 60)
}
log('   HERO SWIPE changed transform:', swipeChanged)

// ---------- 3. NewsTicker vertical cycle ----------
const ticker0 = await page.evaluate(() => {
  const t = [...document.querySelectorAll('a, div')].find((e) => /陪出院|計畫|消息|歡迎/.test(e.textContent || '') && e.getBoundingClientRect().height < 80 && e.getBoundingClientRect().top < 700)
  return t ? (t.textContent || '').trim().slice(0, 30) : null
})
await page.waitForTimeout(5500)
const ticker1 = await page.evaluate(() => {
  const t = [...document.querySelectorAll('a, div')].find((e) => /陪出院|計畫|消息|歡迎|長者|照顧/.test(e.textContent || '') && e.getBoundingClientRect().height < 80 && e.getBoundingClientRect().top < 700)
  return t ? (t.textContent || '').trim().slice(0, 30) : null
})
log('3) NEWS TICKER:', JSON.stringify({ ticker0, ticker1, changed: ticker0 !== ticker1 }))

// ---------- 4. ScrollReveal real transition (not pop) ----------
// find a below-fold element currently at inline opacity 0
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(300)
const revealInfo = await page.evaluate(async () => {
  // collect elements with inline opacity:0 (hidden ScrollReveal), below the fold
  const hidden = [...document.querySelectorAll('*')].filter((el) => {
    const s = el.getAttribute('style') || ''
    if (!/opacity:\s*0\b/.test(s)) return false
    const r = el.getBoundingClientRect()
    return r.height > 30 && r.top > window.innerHeight
  })
  if (!hidden.length) return { hiddenCount: 0 }
  const target = hidden[0]
  const targetTop = target.getBoundingClientRect().top + window.scrollY
  // scroll it into view
  window.scrollTo(0, targetTop - 400)
  // sample opacity rapidly
  const samples = []
  for (let i = 0; i < 16; i++) {
    samples.push(Number(getComputedStyle(target).opacity).toFixed(2))
    await new Promise((r) => setTimeout(r, 50))
  }
  const nums = samples.map(Number)
  const intermediate = nums.filter((v) => v > 0.05 && v < 0.95).length
  return {
    hiddenCount: hidden.length,
    samples,
    sawIntermediate: intermediate > 0, // proof of real transition, not instant pop
    finalOpacity: nums[nums.length - 1],
  }
})
log('4) SCROLLREVEAL:', JSON.stringify(revealInfo))

// ---------- 5. Count-up on training stats ----------
await page.goto(BASE + '/training', { waitUntil: 'networkidle' })
const countup = await page.evaluate(async () => {
  // find number-looking text in a stats block, scroll to it, watch it change
  const numEls = [...document.querySelectorAll('*')].filter((el) => {
    const txt = (el.textContent || '').trim()
    return /^\d[\d,]*\+?$/.test(txt) && txt.length <= 8 && el.children.length === 0
  })
  if (!numEls.length) return { numbersFound: 0 }
  const el = numEls[numEls.length - 1]
  const top = el.getBoundingClientRect().top + window.scrollY
  window.scrollTo(0, top - 500)
  const seq = []
  for (let i = 0; i < 20; i++) {
    seq.push((el.textContent || '').trim())
    await new Promise((r) => setTimeout(r, 90))
  }
  const distinct = [...new Set(seq)]
  return { numbersFound: numEls.length, animated: distinct.length > 1, distinctValues: distinct.slice(0, 8), final: seq[seq.length - 1] }
})
log('5) COUNT-UP (training):', JSON.stringify(countup))

await browser.close()
log('\nDONE')
