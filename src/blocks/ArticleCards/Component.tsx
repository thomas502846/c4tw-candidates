import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Media as MediaDoc } from '@/payload-types'

import ScrollReveal from '@/components/ScrollReveal'

import { ArticleCardsClient } from './Component.client'
import type { ArticleCardData } from './shared'
import { normalizeBySource } from './shared'

type ManualCard = {
  image?: MediaDoc | string | number | null
  title: string
  excerpt?: string | null
  url?: string | null
  id?: string | null
}

// 暫定型別：與 config.ts 對齊；payload-types 重新生成後可改用 generated type
export type ArticleCardsBlockProps = {
  blockType: 'articleCards'
  source?: 'case-stories' | 'media-coverage' | 'manual' | null
  batchSize?: number | null
  enableLoadMore?: boolean | null
  cards?: ManualCard[] | null
  /** 媒體報導（press）兩欄版型的右側眉標／標題（Figma about press 230:732） */
  eyebrow?: string | null
  heading?: string | null
  /** 媒體報導兩欄左側代表圖（590×400）；媒體報導項目本身無圖時用此 */
  leadImage?: MediaDoc | string | number | null
  locale?: 'zh-TW' | 'en'
}

const normalizeManualCard = (card: ManualCard, index: number): ArticleCardData => {
  const image = card.image && typeof card.image === 'object' ? card.image : null
  return {
    id: card.id ?? `manual-${index}`,
    title: card.title,
    excerpt: card.excerpt ?? null,
    imageUrl: image?.sizes?.card?.url || image?.url || null,
    imageAlt: image?.alt || null,
    url: card.url ?? null,
    meta: null,
  }
}

export const ArticleCardsBlock: React.FC<ArticleCardsBlockProps> = async ({
  source,
  batchSize,
  enableLoadMore,
  cards,
  eyebrow,
  heading,
  leadImage,
  locale = 'zh-TW',
}) => {
  const resolvedSource = source ?? 'manual'
  const limit = batchSize && batchSize > 0 ? batchSize : 3

  const leadImageDoc = leadImage && typeof leadImage === 'object' ? leadImage : null
  const leadImageUrl = leadImageDoc?.sizes?.card?.url || leadImageDoc?.url || null
  const leadImageAlt = leadImageDoc?.alt || null

  let initialCards: ArticleCardData[] = []
  let totalDocs = 0

  if (resolvedSource === 'manual') {
    initialCards = (cards ?? []).map(normalizeManualCard)
    totalDocs = initialCards.length
  } else {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: resolvedSource,
      depth: 1,
      limit,
      locale,
      overrideAccess: false,
      sort: resolvedSource === 'media-coverage' ? '-date' : '-createdAt',
    })
    initialCards = result.docs.map((doc) => normalizeBySource(resolvedSource, doc, locale))
    totalDocs = result.totalDocs
  }

  if (initialCards.length === 0) return null

  // 媒體報導（press）：滿版米色帶 #F7F7EB（Figma about press bg 52:198），兩欄版型置中
  if (resolvedSource === 'media-coverage') {
    return (
      <section className="w-full bg-brand-surface py-14 md:py-20" data-block="articleCards">
        {/* 區塊進場 Fade In（Tracy node 27:61）；底色帶不動，內容淡入 */}
        <ScrollReveal className="container">
          <ArticleCardsClient
            source={resolvedSource}
            initialCards={initialCards}
            totalDocs={totalDocs}
            batchSize={limit}
            enableLoadMore={enableLoadMore !== false}
            eyebrow={eyebrow ?? null}
            heading={heading ?? null}
            leadImageUrl={leadImageUrl}
            leadImageAlt={leadImageAlt}
            locale={locale}
          />
        </ScrollReveal>
      </section>
    )
  }

  return (
    // 區塊進場 Fade In（Tracy node 4:4/45:240/86:363：滑到觸發、0→100%、0.6s）
    <ScrollReveal as="section" className="container" data-block="articleCards">
      <ArticleCardsClient
        source={resolvedSource}
        initialCards={initialCards}
        totalDocs={totalDocs}
        batchSize={limit}
        enableLoadMore={enableLoadMore !== false}
        eyebrow={eyebrow ?? null}
        heading={heading ?? null}
        locale={locale}
      />
    </ScrollReveal>
  )
}
