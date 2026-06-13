'use client'

import React, { useCallback, useState } from 'react'

import HoverZoomImage from '@/components/HoverZoomImage'
import ScrollReveal from '@/components/ScrollReveal'

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
  /** 媒體報導兩欄右側眉標／標題（Figma about press 230:732） */
  eyebrow?: string | null
  heading?: string | null
  /** 媒體報導兩欄左側代表圖（項目本身無圖時的 fallback） */
  leadImageUrl?: string | null
  leadImageAlt?: string | null
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
        // 照片 Hover 放大 110%（Tracy node 4:4/86:363；縮放跟卡片整體 hover→useParentGroup）
        <HoverZoomImage useParentGroup>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={card.imageAlt || card.title}
            className="h-[130px] w-full object-cover"
            loading="lazy"
            src={card.imageUrl}
          />
        </HoverZoomImage>
      ) : (
        <div aria-hidden className="h-[130px] w-full bg-brand-surface" />
      )}
      {/* 文章標題 hover/press 變色 #adcb59（Tracy node 4:4） */}
      <h3 className="line-clamp-2 text-justify text-[17px] font-medium leading-[28px] tracking-[0.1em] text-brand-ink transition-colors group-hover:text-brand-lime group-active:text-brand-lime md:text-[19px]">
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
  // group：照片 hover 放大 + 標題 hover 變色都綁在卡片整體 hover
  const cardClassName =
    'group flex flex-col gap-4 rounded-[30px] bg-white p-6 shadow-[4px_4px_3.5px_rgba(139,169,139,0.5)] transition-shadow'

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

/**
 * 媒體報導列（Figma about press 230:732）：左側代表圖 + 右側報導清單。
 * 每列＝日期 + 標題（連結時整列可點）+ 媒體名（有才顯示），底線分隔。
 */
const CoverageRow: React.FC<{ card: ArticleCardData }> = ({ card }) => {
  const { tag, date } = splitMeta(card.meta)
  const body = (
    <>
      <div className="flex items-baseline gap-4">
        {date && (
          <time className="w-[92px] shrink-0 text-[14px] font-medium tracking-[0.08em] text-brand-primary md:text-[15px]">
            {date.replaceAll('-', '/')}
          </time>
        )}
        <span className="flex-1 text-justify text-[16px] font-medium leading-[1.7] tracking-[0.06em] text-brand-ink md:text-[18px]">
          {card.title}
        </span>
      </div>
      {tag && (
        <span className="mt-1 block pl-[108px] text-[13px] tracking-[0.08em] text-brand-muted">
          {tag}
        </span>
      )}
    </>
  )
  const cls = 'block border-b border-brand-surface py-5 first:pt-0'
  return card.url && card.url !== '#' ? (
    <a
      className={`${cls} transition-colors hover:text-brand-primary`}
      href={card.url}
      {...(card.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  )
}

const CoverageList: React.FC<{
  cards: ArticleCardData[]
  hasMore: boolean
  loading: boolean
  loadMore: () => void
  eyebrow?: string | null
  heading?: string | null
  leadImageUrl?: string | null
  leadImageAlt?: string | null
  locale: 'zh-TW' | 'en'
}> = ({ cards, hasMore, loading, loadMore, eyebrow, heading, leadImageUrl, leadImageAlt, locale }) => {
  // 左圖：優先用區塊指定的代表圖，否則取最新一則有圖的報導
  const cardLead = cards.find((c) => c.imageUrl)
  const leadUrl = leadImageUrl || cardLead?.imageUrl || null
  const leadAlt = leadImageAlt || cardLead?.imageAlt || cardLead?.title || null
  return (
    <div className="grid items-start gap-10 md:grid-cols-[590fr_550fr] md:gap-[60px]">
      {/* 左側代表圖 590×400（Figma about press 230:732） */}
      {leadUrl && (
        <div className="md:sticky md:top-28 md:self-start">
          {/* 照片懸浮放大同首頁（Tracy node 27:61） */}
          <HoverZoomImage wrapperClassName="rounded-[30px] shadow-[4px_4px_3.5px_rgba(139,169,139,0.4)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={leadAlt || ''}
              className="aspect-[590/400] w-full object-cover"
              src={leadUrl}
            />
          </HoverZoomImage>
        </div>
      )}
      <div>
        {/* 右側眉標 Press（果綠圓點）+ H1 媒體報導（Figma about press） */}
        {(eyebrow || heading) && (
          <div className="mb-7">
            {eyebrow && (
              <p className="flex items-center gap-2.5 text-[15px] tracking-[0.1em] text-brand-highlight md:text-[16px]">
                <span
                  aria-hidden
                  className="inline-block h-[13px] w-[13px] rounded-full bg-brand-highlight"
                />
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="mt-3 text-[28px] font-bold tracking-[0.1em] text-brand-green md:text-[40px]">
                {heading}
              </h2>
            )}
          </div>
        )}
        <ul>
          {cards.map((card) => (
            <li key={card.id}>
              <CoverageRow card={card} />
            </li>
          ))}
        </ul>
        {hasMore && (
          <div className="mt-8 text-right">
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
    </div>
  )
}

export const ArticleCardsClient: React.FC<ArticleCardsClientProps> = ({
  source,
  initialCards,
  totalDocs,
  batchSize,
  enableLoadMore,
  eyebrow,
  heading,
  leadImageUrl,
  leadImageAlt,
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
        normalizeBySource(source, doc, locale),
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

  // 媒體報導＝左圖 + 右列表（Figma about press）；其餘來源＝卡片網格
  if (source === 'media-coverage') {
    return (
      <CoverageList
        cards={cards}
        eyebrow={eyebrow}
        hasMore={hasMore}
        heading={heading}
        leadImageAlt={leadImageAlt}
        leadImageUrl={leadImageUrl}
        loading={loading}
        loadMore={loadMore}
        locale={locale}
      />
    )
  }

  return (
    <div>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          // 卡片進場 Fade UP（Tracy node 4:4/45:240）；同列卡片錯開 delay
          <ScrollReveal delay={(i % 3) * 0.1} key={card.id} variant="up">
            <Card card={card} />
          </ScrollReveal>
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
