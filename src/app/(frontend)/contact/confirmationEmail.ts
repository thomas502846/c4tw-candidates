import { CONTACT_CATEGORIES } from './categories'

/**
 * 聯絡表單「自動確認信」（寄給填表人本人）。
 * 格式參考 c4twapp 的 inquiry_response.html／base.html，但內容改為「已收到、3–5 個工作天回覆」
 * 的致謝回條，並全數換成創照服務設計 Care For Taiwan 的品牌與聯絡資訊。
 *
 * 寄給填表人的信，reply-to 設為創照公開信箱（見 actions.ts），所以這裡不放「請勿回覆」。
 * 聯絡資訊與聯絡頁（ContactSection.tsx INFO）對齊，為單一真理來源。
 */

type Locale = 'zh-TW' | 'en'

// 創照對外聯絡資訊（同 ContactSection.tsx INFO；email footer 單一真理）
const CONTACT = {
  phone: '049-2526-611',
  email: 'carefortaiwan2022@gmail.com',
  lineLabel: '@564enhuc',
  lineUrl: 'https://lin.ee/xQ63Ufj',
  fbUrl: 'https://www.facebook.com/p/CFT-照顧學校-61571463056013/',
  address: {
    'zh-TW': '臺中市烏日區溪岸路8-3號',
    en: 'No. 8-3, Xi’an Rd., Wuri Dist., Taichung City, Taiwan',
  },
} as const

const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://carefortaiwan.com.tw').replace(
  /\/$/,
  '',
)
const LOGO_URL = `${SITE_URL}/logos/cft-logo-horizontal.png`

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function categoryLabels(categories: string[], locale: Locale): string {
  const map = new Map<string, string>(
    CONTACT_CATEGORIES.map((c) => [c.value, locale === 'en' ? c.en : c.zh]),
  )
  const labels = categories.map((c) => map.get(c) ?? c)
  return labels.join(locale === 'en' ? ', ' : '、')
}

const COPY = {
  'zh-TW': {
    subject: '【創照服務設計 Care For Taiwan】我們已收到您的諮詢',
    title: '我們已收到您的諮詢',
    greeting: (name: string) => `親愛的 ${name} 您好：`,
    intro: '感謝您透過 Care For Taiwan 官方網站與我們聯繫，我們已收到您的諮詢，摘要如下：',
    topicLabel: '想諮詢的服務',
    messageLabel: '您的訊息',
    reply: '我們將在 3–5 個工作天內與您聯繫；若有緊急需求，歡迎透過下方資訊直接與我們聯繫。',
    signoff: '創照服務設計 Care For Taiwan 團隊 敬上',
    footerIntro: '如需協助，歡迎透過以下方式與我們聯繫：',
    phoneLabel: '電話',
    emailLabel: '信箱',
    addressLabel: '地址',
    website: '官方網站',
    facebook: 'Facebook',
    copyright: '創照服務設計股份有限公司 Care For Taiwan．保留一切權利。',
    logoAlt: 'Care For Taiwan 創照服務設計',
  },
  en: {
    subject: '[Care For Taiwan] We have received your inquiry',
    title: 'We have received your inquiry',
    greeting: (name: string) => `Dear ${name},`,
    intro:
      'Thank you for reaching out through the Care For Taiwan website. We have received your inquiry. Here is a summary:',
    topicLabel: 'Topic',
    messageLabel: 'Your message',
    reply:
      'We will get back to you within 3 to 5 business days. For urgent matters, please contact us directly using the details below.',
    signoff: 'The Care For Taiwan team',
    footerIntro: 'If you need any help, you are welcome to contact us:',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    addressLabel: 'Address',
    website: 'Website',
    facebook: 'Facebook',
    copyright: 'Care For Taiwan Co., Ltd. All rights reserved.',
    logoAlt: 'Care For Taiwan',
  },
} satisfies Record<Locale, Record<string, unknown>>

export function buildConfirmationEmail(
  locale: Locale,
  data: { name: string; categories: string[]; message: string },
): { subject: string; html: string } {
  const t = COPY[locale]
  const name = escapeHtml(data.name)
  const topics = escapeHtml(categoryLabels(data.categories, locale)) || '—'
  const message = escapeHtml(data.message)
  const address = CONTACT.address[locale]

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${t.subject}</title>
</head>
<body style="margin:0;padding:0;width:100%;background-color:#F5F4F1;font-family:'PingFang TC','Noto Sans TC','Microsoft JhengHei',Arial,sans-serif;">
  <div style="width:100%;background-color:#F5F4F1;padding:24px 0;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center">
          <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
            <!-- Header -->
            <div style="background-color:#FAF8F5;padding:28px 24px;text-align:center;border-bottom:1px solid #ECE6DC;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <img src="${LOGO_URL}" alt="${t.logoAlt}" width="220" style="max-width:220px;height:auto;display:block;margin:0 auto;" />
              </a>
            </div>
            <!-- Body -->
            <div style="padding:32px 28px;color:#333333;font-size:16px;line-height:1.7;text-align:left;">
              <h1 style="margin:0 0 20px 0;font-size:20px;color:#6B7D62;">${t.title}</h1>
              <p style="margin:0 0 16px 0;">${t.greeting(name)}</p>
              <p style="margin:0 0 16px 0;">${t.intro}</p>
              <div style="background-color:#FAF8F5;border:1px solid #E3DCD2;border-radius:8px;padding:18px 22px;margin:20px 0;">
                <p style="margin:0 0 10px 0;"><strong>${t.topicLabel}：</strong>${topics}</p>
                <p style="margin:0;"><strong>${t.messageLabel}：</strong></p>
                <p style="margin:6px 0 0 0;white-space:pre-wrap;color:#4b5563;">${message}</p>
              </div>
              <p style="margin:0 0 24px 0;">${t.reply}</p>
              <p style="margin:0;color:#6B7D62;font-weight:600;">${t.signoff}</p>
            </div>
            <!-- Footer -->
            <div style="background-color:#F0EBE1;padding:24px;text-align:center;font-size:14px;color:#70685E;">
              <p style="margin:0 0 10px 0;">${t.footerIntro}</p>
              <p style="margin:2px 0;">${t.phoneLabel}：${CONTACT.phone}</p>
              <p style="margin:2px 0;">${t.emailLabel}：<a href="mailto:${CONTACT.email}" style="color:#6B7D62;text-decoration:none;">${CONTACT.email}</a></p>
              <p style="margin:2px 0;">LINE：<a href="${CONTACT.lineUrl}" style="color:#6B7D62;text-decoration:none;">${CONTACT.lineLabel}</a></p>
              <p style="margin:2px 0;">${t.addressLabel}：${address}</p>
              <p style="margin:12px 0 0 0;">
                <a href="${SITE_URL}" style="color:#6B7D62;text-decoration:none;">${t.website}</a> ｜
                <a href="${CONTACT.fbUrl}" style="color:#6B7D62;text-decoration:none;">${t.facebook}</a>
              </p>
              <p style="margin:12px 0 0 0;font-size:12px;color:#9A9389;">&copy; ${new Date().getFullYear()} ${t.copyright}</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`

  return { subject: t.subject, html }
}
