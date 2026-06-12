import { test, expect } from '@playwright/test'

import { login, devAdmin } from '../helpers/login'

/**
 * 編輯流 smoke：seed 後 DB 已有 dev admin（pnpm seed 建立），不在測試裡另建帳號。
 */
test.describe('Admin smoke', () => {
  test('登入 dev admin 後 pages list 有 6 頁', async ({ page }) => {
    await login({ page, user: devAdmin })

    await page.goto('/admin/collections/pages')
    await expect(page).toHaveURL(/\/admin\/collections\/pages/)

    // Payload list view：table 一列一筆
    const rows = page.locator('table tbody tr')
    await expect(rows).toHaveCount(6)

    // 六個 slug 齊全（list view 連結帶 id 不帶 slug，改以 API 驗證內容）
    const res = await page.request.get('/api/pages?limit=20&depth=0')
    expect(res.status()).toBe(200)
    const data = await res.json()
    const slugs = (data.docs ?? []).map((d: { slug: string }) => d.slug).sort()
    expect(slugs).toEqual(['about', 'care', 'contact', 'home', 'school', 'training'])
  })
})
