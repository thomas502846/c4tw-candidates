// ArticleCards 共用：把 case-stories / media-coverage 文件正規化成卡片資料。
// server（首批）與 client（載入更多）都用同一份邏輯。

export type ArticleCardData = {
  id: string
  title: string
  excerpt?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  url?: string | null
  /** 補充資訊列，例如「聯合報 · 2024-06-20」 */
  meta?: string | null
}

type MediaLike = {
  url?: string | null
  alt?: string | null
  sizes?: {
    card?: { url?: string | null } | null
    hero?: { url?: string | null } | null
  } | null
} | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pickImage = (image: any): { url: string | null; alt: string | null } => {
  if (!image || typeof image !== 'object') return { url: null, alt: null }
  const media = image as MediaLike
  // 卡片顯示約 380×288（@2x≈760px）。原本優先 card(768×576) 變體，但該變體在
  // staging/S3 偶發未上傳 → -768x576 圖 HTTP 400 破圖（與 leadImage 同一坑）。
  // 改先取原圖 / hero，最後才退 card，確保所有斷點都有可用圖。
  return {
    url: media?.url || media?.sizes?.hero?.url || media?.sizes?.card?.url || null,
    alt: media?.alt || null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeCaseStory = (doc: any, locale: 'zh-TW' | 'en' = 'zh-TW'): ArticleCardData => {
  const { url, alt } = pickImage(doc?.image)
  // Figma 217:601 / care 案例分享：卡片左上分類 pill。case-stories 尚無分類欄位，
  // 以「文章分類」佔位（與設計稿一致），待客戶定義分類欄位後改抓真實值。
  const rawCategory = typeof doc?.category === 'string' ? doc.category.trim() : null
  const category = rawCategory || (locale === 'en' ? 'Category' : '文章分類')
  return {
    id: String(doc?.id ?? ''),
    title: doc?.title ?? '',
    excerpt: doc?.summary ?? null,
    imageUrl: url,
    imageAlt: alt,
    url: null,
    meta: category,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeMediaCoverage = (doc: any): ArticleCardData => {
  const { url, alt } = pickImage(doc?.image)
  const date = doc?.date ? String(doc.date).slice(0, 10) : null
  // 媒體名稱待客戶補齊前，collection 以「待補」佔位；對外不外露佔位字樣。
  const rawOutlet = typeof doc?.outlet === 'string' ? doc.outlet.trim() : null
  const outlet = rawOutlet && rawOutlet !== '待補' ? rawOutlet : null
  return {
    id: String(doc?.id ?? ''),
    title: doc?.title ?? '',
    excerpt: doc?.excerpt ?? null,
    imageUrl: url,
    imageAlt: alt,
    url: doc?.url ?? null,
    meta: [outlet, date].filter(Boolean).join(' · ') || null,
  }
}

export const normalizeBySource = (
  source: 'case-stories' | 'media-coverage',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any,
  locale: 'zh-TW' | 'en' = 'zh-TW',
): ArticleCardData =>
  source === 'case-stories' ? normalizeCaseStory(doc, locale) : normalizeMediaCoverage(doc)
