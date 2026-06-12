import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Media as MediaDoc } from '@/payload-types'

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
  locale = 'zh-TW',
}) => {
  const resolvedSource = source ?? 'manual'
  const limit = batchSize && batchSize > 0 ? batchSize : 3

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
    initialCards = result.docs.map((doc) => normalizeBySource(resolvedSource, doc))
    totalDocs = result.totalDocs
  }

  if (initialCards.length === 0) return null

  return (
    <section className="container" data-block="articleCards">
      <ArticleCardsClient
        source={resolvedSource}
        initialCards={initialCards}
        totalDocs={totalDocs}
        batchSize={limit}
        enableLoadMore={enableLoadMore !== false}
        locale={locale}
      />
    </section>
  )
}
