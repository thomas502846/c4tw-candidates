import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

export type ContactLocale = 'zh-TW' | 'en'

/**
 * 聯絡頁是固定路由（不走 [slug]），但上方的介紹區塊仍由 CMS 的 contact page doc 管理。
 * 這裡查出該 doc 供 /contact 與 /en/contact 共用；表單本身不入 CMS（客戶定案）。
 */
export const queryContactPage = cache(async (locale: ContactLocale) => {
  const { isEnabled: draft } = await draftMode()

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      locale,
      where: {
        slug: {
          equals: 'contact',
        },
      },
    })
    return result.docs?.[0] || null
  } catch (error) {
    // CMS 讀不到時聯絡頁仍要能用（表單是固定的）
    console.error('[contact] 讀取 CMS contact page 失敗，僅渲染表單：', error)
    return null
  }
})
