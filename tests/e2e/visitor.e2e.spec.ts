import fs from 'node:fs'
import path from 'node:path'

import { test, expect } from '@playwright/test'

// 6 個落地頁（zh-TW 在 /，en 在 /en/）
const PAGE_PATHS = ['/', '/about', '/care', '/training', '/school', '/contact']

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'e2e/screenshots')

test.describe('訪客流：zh-TW 六頁', () => {
  for (const p of PAGE_PATHS) {
    test(`GET ${p} 200 且 h1 非空`, async ({ page }) => {
      const response = await page.goto(p)
      expect(response?.status()).toBe(200)
      // about 頁的 h1 是 sr-only（無 banner/hero 的 a11y fallback），驗非空文字而非 visible
      const h1 = page.locator('h1').first()
      await expect(h1).toHaveText(/\S/)
    })
  }
})

test.describe('訪客流：/home → / redirect', () => {
  test('/home 308 並落在 /', async ({ page, request }) => {
    // 直接打 HTTP 驗 308（不跟隨 redirect）
    const raw = await request.get('/home', { maxRedirects: 0 })
    expect(raw.status()).toBe(308)
    expect(raw.headers()['location']).toBe('/')

    // 瀏覽器跟隨後落在 /
    await page.goto('/home')
    expect(new URL(page.url()).pathname).toBe('/')
    await expect(page.locator('h1').first()).toBeVisible()
  })
})

test.describe('訪客流：en 六頁', () => {
  for (const p of PAGE_PATHS) {
    const enPath = p === '/' ? '/en' : `/en${p}`
    test(`GET ${enPath} 200 且 h1 非空`, async ({ page }) => {
      const response = await page.goto(enPath)
      expect(response?.status()).toBe(200)
      const h1 = page.locator('h1').first()
      await expect(h1).toHaveText(/\S/)
    })
  }
})

test.describe('語言切換', () => {
  // 語言切換連結在 desktop nav（lg 以上才顯示）
  test.use({ viewport: { width: 1440, height: 900 } })

  test('/ 的 EN 連結 → /en，/en 的中文連結 → /', async ({ page }) => {
    await page.goto('/')
    const enLink = page.getByRole('link', { name: 'EN', exact: true })
    await expect(enLink).toBeVisible()
    await expect(enLink).toHaveAttribute('href', '/en')
    await enLink.click()
    await page.waitForURL('**/en')
    expect(new URL(page.url()).pathname).toBe('/en')

    const zhLink = page.getByRole('link', { name: '中文', exact: true })
    await expect(zhLink).toBeVisible()
    await expect(zhLink).toHaveAttribute('href', '/')
    await zhLink.click()
    await page.waitForURL((url) => url.pathname === '/')
    expect(new URL(page.url()).pathname).toBe('/')
  })

  test('子頁切換保留路徑：/about ↔ /en/about', async ({ page }) => {
    await page.goto('/about')
    const enLink = page.getByRole('link', { name: 'EN', exact: true })
    await expect(enLink).toHaveAttribute('href', '/en/about')
    await enLink.click()
    await page.waitForURL('**/en/about')
    await expect(page.locator('h1').first()).toHaveText(/\S/)

    const zhLink = page.getByRole('link', { name: '中文', exact: true })
    await expect(zhLink).toHaveAttribute('href', '/about')
  })
})

test.describe('RWD 截圖', () => {
  const VIEWPORTS = [
    { width: 375, height: 812 },
    { width: 900, height: 1000 },
    { width: 1440, height: 900 },
  ]
  const TARGETS = [
    { path: '/', name: 'home' },
    { path: '/about', name: 'about' },
  ]

  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
  })

  for (const target of TARGETS) {
    for (const vp of VIEWPORTS) {
      test(`${target.path} @ ${vp.width}px`, async ({ page }) => {
        await page.setViewportSize(vp)
        await page.goto(target.path, { waitUntil: 'networkidle' })
        await expect(page.locator('h1').first()).toHaveText(/\S/)
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${target.name}-${vp.width}.png`),
          fullPage: true,
        })
      })
    }
  }
})
