import { test, expect } from '@playwright/test'

/**
 * 聯絡表單（SES_DRY_RUN=true：server action 不真寄信，直接回成功）
 * 注意：action 有同 IP 每分鐘 3 次的 rate limit，本檔只送出 2 次（zh + en）。
 */
test.describe('聯絡表單', () => {
  test('/contact 填寫送出後顯示成功訊息', async ({ page }) => {
    await page.goto('/contact')

    await page.fill('#contact-name', 'E2E 測試')
    await page.fill('#contact-organization', 'E2E 測試單位')
    await page.fill('#contact-phone', '0912345678')
    await page.fill('#contact-email', 'e2e@example.com')
    await page.fill('#contact-message', '這是一則 E2E 自動化測試訊息（dry-run，不會真的寄信）。')
    // 想諮詢的服務＝checkbox 多選，預設皆未勾選，須至少勾一項才可送出
    await page.locator('input[name="category"]').first().check()

    await page.getByRole('button', { name: '送出' }).click()

    await expect(page.getByRole('status')).toContainText('訊息已送出')
    await expect(page.getByRole('status')).toContainText('我們已收到您的訊息')
  })

  test('/en/contact 填寫送出後顯示英文成功訊息', async ({ page }) => {
    await page.goto('/en/contact')

    await page.fill('#contact-name', 'E2E Tester')
    await page.fill('#contact-organization', 'E2E Test Org')
    await page.fill('#contact-phone', '0912345678')
    await page.fill('#contact-email', 'e2e-en@example.com')
    await page.fill('#contact-message', 'This is an automated E2E test message (dry-run).')
    // Topic = multi-select checkboxes, none checked by default; must check at least one
    await page.locator('input[name="category"]').first().check()

    await page.getByRole('button', { name: 'Send', exact: true }).click()

    await expect(page.getByRole('status')).toContainText('Message sent')
    await expect(page.getByRole('status')).toContainText('We have received your message')
  })
})
