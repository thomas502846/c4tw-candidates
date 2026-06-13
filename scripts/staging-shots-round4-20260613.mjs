// 總 gate round4：staging 六頁 1440 全頁截圖（互動層完成後；靜態截圖，動效另記）
import { chromium } from '@playwright/test'

const BASE = process.env.BASE || 'http://52.78.36.24'
const OUT = '/home/thomas/c4twweb/docs/review-20260612'
const pages = ['home', 'about', 'care', 'training', 'school', 'contact']

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

for (const slug of pages) {
  const url = slug === 'home' ? `${BASE}/` : `${BASE}/${slug}`
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  // 滾到底觸發 lazy load + ScrollReveal 進場（靜態截圖會落在最終可見態），再回頂
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0
      const t = setInterval(() => {
        y += 800
        window.scrollTo(0, y)
        if (y >= document.body.scrollHeight) {
          clearInterval(t)
          resolve()
        }
      }, 120)
    })
  })
  await page.waitForTimeout(900)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/staging-round4-${slug}.png`, fullPage: true })
  console.log(`shot: ${slug}`)
}
await browser.close()
