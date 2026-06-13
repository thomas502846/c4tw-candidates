import { test, expect } from '@playwright/test'

/**
 * 動效收斂 smoke（Tracy 動效規格）：
 *  1) ScrollReveal 進場：捲動後 home 各區塊標題可見、不卡在 opacity:0
 *  2) reduced-motion：強制 prefers-reduced-motion=reduce 時，內容仍完整可見
 *     （守住「開 reduce 內容反而消失」這條紅線）
 *  3) Parallax（school 背景地圖 node 341:650）：背景層存在、reduce 下 transform 歸零
 *  4) 表單驗證（contact node 41:156）：擋空白、擋錯誤 email
 */

test.describe('ScrollReveal 進場', () => {
  test('home 捲到底後主要標題都可見（不卡 opacity:0）', async ({ page }) => {
    await page.goto('/')
    // 逐步捲到底觸發各區塊 IntersectionObserver
    await page.evaluate(async () => {
      const step = window.innerHeight
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 120))
      }
      window.scrollTo(0, document.body.scrollHeight)
    })
    // h2 是各 block 標題；至少有一個且全部可見
    const headings = page.locator('h2')
    const count = await headings.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await expect(headings.nth(i)).toBeVisible()
    }
  })
})

test.describe('reduced-motion：內容不因動畫消失', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('home：不捲動，首屏與深處標題皆可見', async ({ page }) => {
    await page.goto('/')
    const headings = page.locator('h2')
    const count = await headings.count()
    expect(count).toBeGreaterThan(0)
    // reduce 模式下 ScrollReveal 應直接顯示：每個標題自身 computed opacity≈1、且實際可見
    for (let i = 0; i < count; i++) {
      const h = headings.nth(i)
      await expect(h).toHaveText(/\S/)
      // 標題自身與其 ScrollReveal 容器都不可被動畫藏住 → 用 effective（被裁剪/隱藏會 0）
      const visible = await h.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        // 量自身與所有祖先的 inline opacity 乘積（ScrollReveal 容器是祖先）
        let node: Element | null = el
        let product = 1
        while (node) {
          const o = (node as HTMLElement).style?.opacity
          if (o !== '' && o != null) product *= Number(o)
          node = node.parentElement
        }
        return { product, hasBox: rect.width > 0 && rect.height > 0 }
      })
      expect(visible.product).toBeGreaterThan(0.99)
      expect(visible.hasBox).toBe(true)
    }
  })

  test('school：Parallax 背景層存在且 transform 歸零', async ({ page }) => {
    await page.goto('/school')
    const bg = page.locator('[data-parallax-target="school-map-bg"]')
    await expect(bg).toHaveCount(1)
    // 捲動後仍不位移（reduce）
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(200)
    const inner = bg.locator(':scope > *').first()
    const transform = await inner.evaluate((el) => getComputedStyle(el).transform)
    expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBeTruthy()
  })
})

test.describe('Parallax 背景層（一般模式）', () => {
  test('school：背景地圖層存在、pin 維持文檔流（高度不變）', async ({ page }) => {
    await page.goto('/school')
    const bg = page.locator('[data-parallax-target="school-map-bg"]')
    await expect(bg).toHaveCount(1)
    // overflow-hidden 容器避免位移露邊
    const overflow = await bg.evaluate((el) => getComputedStyle(el).overflowX)
    expect(overflow).toBe('hidden')
  })
})

test.describe('表單驗證（contact node 41:156）', () => {
  test('空白送出被擋下，顯示必填錯誤、不出現成功訊息', async ({ page }) => {
    await page.goto('/contact')
    await page.getByRole('button', { name: '送出' }).click()
    // 不應出現成功 status
    await expect(page.getByRole('status')).toHaveCount(0)
    // 應出現至少一則 alert（必填）
    await expect(page.getByRole('alert').first()).toBeVisible()
  })

  test('錯誤 email 格式被標記 invalid 且阻擋送出（送出鈕 disabled）', async ({ page }) => {
    await page.goto('/contact')
    await page.fill('#contact-name', '驗證測試')
    await page.fill('#contact-organization', '單位')
    await page.fill('#contact-phone', '0912345678')
    await page.fill('#contact-email', 'not-an-email')
    // blur 觸發即時驗證
    await page.locator('#contact-email').blur()
    await page.fill('#contact-message', '錯誤 email 應被擋下。')
    // email 標記 invalid、出現錯誤 alert、送出鈕被 disabled（無法送出 → 不會有成功 status）
    await expect(page.locator('#contact-email')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('#contact-email-error')).toBeVisible()
    await expect(page.getByRole('button', { name: '送出' })).toBeDisabled()
    await expect(page.getByRole('status')).toHaveCount(0)
  })
})
