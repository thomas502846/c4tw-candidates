'use server'

import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { CONTACT_CATEGORIES } from './categories'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const CATEGORY_ZH_LABELS: Record<string, string> = Object.fromEntries(
  CONTACT_CATEGORIES.map((c) => [c.value, c.zh]),
)

// --- 防濫用：同 IP 每分鐘最多 3 次（in-memory，單機部署足夠） ---
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 3
const rateLimitHits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()

  // 順手清掉過期的其他 IP 紀錄，避免 Map 無限長大
  if (rateLimitHits.size > 500) {
    for (const [key, hits] of rateLimitHits) {
      if (hits.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) rateLimitHits.delete(key)
    }
  }

  const recent = (rateLimitHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitHits.set(ip, recent)
    return true
  }
  recent.push(now)
  rateLimitHits.set(ip, recent)
  return false
}

async function getClientIp(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return h.get('x-real-ip') ?? 'unknown'
}

async function resolveRecipients(): Promise<string[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    const fromCms = (settings.inquiryRecipients ?? [])
      .map((row) => row.email)
      .filter((email): email is string => Boolean(email))
    if (fromCms.length > 0) return fromCms
  } catch (error) {
    console.error('[contact] 讀取 site-settings 收件信箱失敗，改用 fallback：', error)
  }
  const fallback = process.env.CONTACT_FALLBACK_TO
  return fallback ? fallback.split(',').map((s) => s.trim()).filter(Boolean) : []
}

async function resolveSender(): Promise<string> {
  try {
    const payload = await getPayload({ config: configPromise })
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings.sesSender) return settings.sesSender
  } catch {
    // fall through to default
  }
  return process.env.SES_FROM_ADDRESS ?? 'no-reply@mail.carefortaiwan.com.tw'
}

function buildEmailBody(data: {
  name: string
  email: string
  phone: string
  category: string
  message: string
  ip: string
}): string {
  const categoryLabel = CATEGORY_ZH_LABELS[data.category] ?? data.category
  return [
    '官網聯絡表單收到一則新訊息：',
    '',
    `姓名：${data.name}`,
    `Email：${data.email}`,
    `電話：${data.phone || '（未填）'}`,
    `詢問類別：${categoryLabel}`,
    '',
    '訊息內容：',
    data.message,
    '',
    '----',
    `送出時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}（台北時間）`,
    `來源 IP：${data.ip}`,
    '此信由 Care For Taiwan 官網系統自動寄出，直接回覆本信即可回覆填表人。',
  ].join('\n')
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const isEn = formData.get('locale') === 'en'

  const MSG = {
    success: isEn
      ? 'We have received your message and will get back to you within 3 business days.'
      : '我們已收到您的訊息，會在 3 個工作天內回覆您。',
    invalid: isEn
      ? 'Please fill in your name, email, and message, then submit again.'
      : '請填寫姓名、Email 和訊息內容後再送出。',
    invalidEmail: isEn
      ? 'The email format looks incorrect. Please check and submit again.'
      : 'Email 格式看起來不正確，請確認後再送出一次。',
    rateLimited: isEn
      ? 'Too many submissions. Please wait a minute and try again.'
      : '送出次數過於頻繁，請等 1 分鐘後再試一次。',
    failed: isEn
      ? 'Your message was not sent. Please try again later.'
      : '訊息沒有送出成功，請稍後再試一次。',
  }

  // 1. Honeypot：機器人填了隱藏欄位 → 假裝成功，不寄信
  const honeypot = (formData.get('website') ?? '').toString().trim()
  if (honeypot) {
    console.warn('[contact] honeypot 觸發，已忽略這筆送出')
    return { status: 'success', message: MSG.success }
  }

  // 2. Rate limit
  const ip = await getClientIp()
  if (isRateLimited(ip)) {
    return { status: 'error', message: MSG.rateLimited }
  }

  // 3. 欄位驗證
  const name = (formData.get('name') ?? '').toString().trim()
  const email = (formData.get('email') ?? '').toString().trim()
  const phone = (formData.get('phone') ?? '').toString().trim()
  const category = (formData.get('category') ?? '').toString().trim()
  const message = (formData.get('message') ?? '').toString().trim()

  if (!name || !email || !message || !category) {
    return { status: 'error', message: MSG.invalid }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: MSG.invalidEmail }
  }

  const body = buildEmailBody({ name, email, phone, category, message, ip })
  const subject = `【官網聯絡表單】${CATEGORY_ZH_LABELS[category] ?? category}－${name}`

  // 4. Dry run（E2E 測試用）：不真寄信，把 payload 印到 server log
  if (process.env.SES_DRY_RUN === 'true') {
    const recipients = await resolveRecipients()
    console.log('[contact] SES_DRY_RUN=true，略過實際寄信。payload：', {
      to: recipients,
      subject,
      body,
    })
    return { status: 'success', message: MSG.success }
  }

  // 5. 寄信
  try {
    const recipients = await resolveRecipients()
    if (recipients.length === 0) {
      console.error('[contact] 沒有任何收件信箱（site-settings 與 CONTACT_FALLBACK_TO 皆空）')
      return { status: 'error', message: MSG.failed }
    }

    const sender = await resolveSender()
    const ses = new SESv2Client({ region: process.env.AWS_REGION ?? 'ap-northeast-2' })

    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: `Care For Taiwan 官網 <${sender}>`,
        Destination: { ToAddresses: recipients },
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: subject, Charset: 'UTF-8' },
            Body: { Text: { Data: body, Charset: 'UTF-8' } },
          },
        },
      }),
    )

    return { status: 'success', message: MSG.success }
  } catch (error) {
    console.error('[contact] SES 寄信失敗：', error)
    return { status: 'error', message: MSG.failed }
  }
}
