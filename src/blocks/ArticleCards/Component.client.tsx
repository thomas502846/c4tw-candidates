'use client'

import React, { useCallback, useState } from 'react'

import type { ArticleCardData } from './shared'
import { normalizeBySource } from './shared'

type CollectionSource = 'case-stories' | 'media-coverage'

export type ArticleCardsClientProps = {
  source: CollectionSource | 'manual'
  /** 首批卡片（manual 模式時為全部卡片） */
  initialCards: ArticleCardData[]
  /** collection 模式：總筆數，用來判斷還有沒有更多 */
  totalDocs: number
  batchSize: number
  enableLoadMore: boolean
  locale: 'zh-TW' | 'en'
}

/** meta 形如「聯合報 · 2024-06-20」→ 拆成分類 pill + 果綠日期 */
const splitMeta = (meta?: string | null): { tag: string | null; date: string | null } => {
  if (!meta) return { tag: null, date: null }
  const parts = meta.split(' · ')
  if (parts.length === 1) {
    // 只有一段：長得像日期就當日期，否則當分類
    return /^\d{4}/.test(parts[0]) ? { tag: null, date: parts[0] } : { tag: parts[0], date: null }
  }
  return { tag: parts[0] || null, date: parts[1] || null }
}

// Figma 卡片新設計：白底 rounded-30、綠色系陰影、分類 pill、圖片區、兩行標題
const Card: React.FC<{ card: ArticleCardData }> = ({ card }) => {
  const { tag, date } = splitMeta(card.meta)

  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        {tag ? (
          <span className="inline-block max-w-full truncate rounded-[30px] bg-brand-lime px-5 py-1 text-[13px] font-medium tracking-[0.1em] text-white md:text-[14px]">
            {tag}
          </span>
        ) : (
          <span aria-hidden />
        )}
        {date && (
          <time className="shrink-0 text-[13px] font-medium tracking-[0.1em] text-brand-primary md:text-[14px]">
            {date.replaceAll('-', '/')}
          </time>
        )}
      </div>
      {card.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={card.imageAlt || card.title}
          className="h-[130px] w-full object-cover"
          loading="lazy"
          src={card.imageUrl}
        />
      ) : (
        <div aria-hidden className="h-[130px] w-full bg-brand-surface" />
      )}
      <h3 className="line-clamp-2 text-justify text-[17px] font-medium leading-[28px] tracking-[0.1em] text-brand-ink md:text-[19px]">
        {card.title}
      </h3>
      {card.excerpt && (
        <p className="line-clamp-2 text-[14px] leading-[1.8] tracking-[0.05em] text-brand-muted">
          {card.excerpt}
        </p>
      )}
    </>
  )

  // Figma 217:601：drop-shadow 4px 4px 3.5px rgba(139,169,139,0.5) 綠色系陰影
  const cardClassName =
    'flex flex-col gap-4 rounded-[30px] bg-white p-6 shadow-[4px_4px_3.5px_rgba(139,169,139,0.5)] transition-shadow'

  if (card.url) {
    return (
      <a
        className={`${cardClassName} hover:shadow-[4px_4px_10px_rgba(139,169,139,0.6)]`}
        href={card.url}
        {...(card.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {body}
      </a>
    )
  }

  return <article className={cardClassName}>{body}</article>
}

export const ArticleCardsClient: React.FC<ArticleCardsClientProps> = ({
  source,
  initialCards,
  totalDocs,
  batchSize,
  enableLoadMore,
  locale,
}) => {
  // manual：一次拿到全部，前端分批顯示
  // collection：首批由 server 帶入，「載入更多」走 REST API 取下一批
  const [cards, setCards] = useState<ArticleCardData[]>(
    source === 'manual' ? initialCards.slice(0, batchSize) : initialCards,
  )
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const total = source === 'manual' ? initialCards.length : totalDocs
  const hasMore = enableLoadMore && cards.length < total

  const loadMore = useCallback(async () => {
    if (loading) return

    if (source === 'manual') {
      setCards(initialCards.slice(0, cards.length + batchSize))
      return
    }

    setLoading(true)
    try {
      const nextPage = page + 1
      const sort = source === 'media-coverage' ? '-date' : '-createdAt'
      const params = new URLSearchParams({
        limit: String(batchSize),
        page: String(nextPage),
        sort,
        depth: '1',
        locale,
      })
      const res = await fetch(`/api/${source}?${params.toString()}`)
      if (!res.ok) throw new Error(`Failed to load more: ${res.status}`)
      const data = await res.json()
      const nextCards: ArticleCardData[] = (data?.docs ?? []).map((doc: unknown) =>
        normalizeBySource(source, doc),
      )
      setCards((prev) => {
        const seen = new Set(prev.map((c) => c.id))
        return [...prev, ...nextCards.filter((c) => !seen.has(c.id))]
      })
      setPage(nextPage)
    } catch (_err) {
      // 載入失敗時不中斷頁面，按鈕維持可重試
    } finally {
      setLoading(false)
    }
  }, [loading, source, initialCards, cards.length, batchSize, page, locale])

  if (cards.length === 0) return null

  return (
    <div>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card card={card} key={card.id} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-10 text-right">
          {/* Figma「載入更多...」：ink 18 Medium underline */}
          <button
            className="text-[16px] font-medium tracking-[0.15em] text-brand-ink underline underline-offset-4 transition-colors hover:text-brand-primary disabled:opacity-50 md:text-[18px]"
            disabled={loading}
            onClick={loadMore}
            type="button"
          >
            {loading
              ? locale === 'en'
                ? 'Loading…'
                : '載入中…'
              : locale === 'en'
                ? 'Load more...'
                : '載入更多...'}
          </button>
        </div>
      )}
    </div>
  )
}
