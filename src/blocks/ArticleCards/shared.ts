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
  } | null
} | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pickImage = (image: any): { url: string | null; alt: string | null } => {
  if (!image || typeof image !== 'object') return { url: null, alt: null }
  const media = image as MediaLike
  return {
    url: media?.sizes?.card?.url || media?.url || null,
    alt: media?.alt || null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeCaseStory = (doc: any): ArticleCardData => {
  const { url, alt } = pickImage(doc?.image)
  return {
    id: String(doc?.id ?? ''),
    title: doc?.title ?? '',
    excerpt: doc?.summary ?? null,
    imageUrl: url,
    imageAlt: alt,
    url: null,
    meta: null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeMediaCoverage = (doc: any): ArticleCardData => {
  const { url, alt } = pickImage(doc?.image)
  const date = doc?.date ? String(doc.date).slice(0, 10) : null
  return {
    id: String(doc?.id ?? ''),
    title: doc?.title ?? '',
    excerpt: doc?.excerpt ?? null,
    imageUrl: url,
    imageAlt: alt,
    url: doc?.url ?? null,
    meta: [doc?.outlet, date].filter(Boolean).join(' · ') || null,
  }
}

export const normalizeBySource = (
  source: 'case-stories' | 'media-coverage',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any,
): ArticleCardData =>
  source === 'case-stories' ? normalizeCaseStory(doc) : normalizeMediaCoverage(doc)
