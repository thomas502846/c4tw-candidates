import React from 'react'

import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { TimelineEvent } from '@/payload-types'

type TimelineItem = {
  date: string
  title: string
  description?: string | null
  id?: string | null
}

// 暫定型別：與 config.ts 對齊；payload-types 重新生成後可改用 generated type
export type TimelineBlockProps = {
  blockType: 'timeline'
  mode?: 'manual' | 'reference' | null
  items?: TimelineItem[] | null
  events?: (number | TimelineEvent)[] | null
  locale?: 'zh-TW' | 'en'
}

type Entry = { date: string; title: string; description?: string | null; key: string }

// Figma 創照歷程：中央直線 + 果綠節點，年份與事件 pill 左右交錯
const Row: React.FC<{ entry: Entry; index: number }> = ({ entry, index }) => {
  const eventOnRight = index % 2 === 0

  const year = (
    <p className="text-[15px] font-medium tracking-[0.1em] text-brand-primary md:text-[16px]">
      {entry.date}
    </p>
  )
  const pill = (
    <div className={cn('flex flex-col gap-1.5', eventOnRight ? 'items-start' : 'md:items-end')}>
      <span className="inline-block rounded-[30px] bg-brand-green px-6 py-1.5 text-[14px] font-medium leading-[1.7] tracking-[0.08em] text-white md:text-[16px]">
        {entry.title}
      </span>
      {entry.description && (
        <p
          className={cn(
            'max-w-[26rem] text-[13px] leading-[1.7] tracking-[0.05em] text-brand-muted md:text-[14px]',
            eventOnRight ? 'text-left' : 'md:text-right',
          )}
        >
          {entry.description}
        </p>
      )}
    </div>
  )

  return (
    <li className="relative">
      {/* 桌機：三欄（左內容｜節點｜右內容）交錯 */}
      <div className="hidden grid-cols-[1fr_44px_1fr] items-center md:grid">
        <div className={cn('flex', eventOnRight ? 'justify-end pr-6' : 'justify-end pr-6')}>
          {eventOnRight ? year : null}
          {!eventOnRight ? pill : null}
        </div>
        <div className="flex justify-center">
          <span aria-hidden className="h-[15px] w-[15px] rounded-full bg-brand-primary" />
        </div>
        <div className="flex justify-start pl-6">{eventOnRight ? pill : year}</div>
      </div>

      {/* 手機：單欄靠左 */}
      <div className="flex gap-4 md:hidden">
        <span
          aria-hidden
          className="mt-1.5 h-[13px] w-[13px] shrink-0 rounded-full bg-brand-primary"
        />
        <div className="flex flex-col gap-1.5">
          {year}
          <span className="inline-block self-start rounded-[30px] bg-brand-green px-5 py-1.5 text-[14px] font-medium leading-[1.7] tracking-[0.08em] text-white">
            {entry.title}
          </span>
          {entry.description && (
            <p className="text-[13px] leading-[1.7] tracking-[0.05em] text-brand-muted">
              {entry.description}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

const TimelineList: React.FC<{ entries: Entry[]; locale: 'zh-TW' | 'en' }> = ({
  entries,
  locale,
}) => (
  // 滿版暖米底（Figma history bg 1440×920）
  <section className="w-full bg-brand-surface py-14 md:py-20" data-block="timeline">
    {/* 區塊進場 Fade In（Tracy node 45:240）；底色帶不動，內容淡入 */}
    <ScrollReveal className="container">
      {/* 眉標 + 標題（暫硬寫，待 block config 增欄位後改 CMS 餵） */}
      <div className="mb-10 md:mb-14">
        <p className="flex items-center gap-2.5 text-[15px] tracking-[0.1em] text-brand-muted md:text-[16px]">
          <span aria-hidden className="inline-block h-[13px] w-[13px] rounded-full bg-brand-highlight" />
          History
        </p>
        <h2 className="mt-3 text-[28px] font-bold tracking-[0.1em] text-brand-green md:text-[40px]">
          {locale === 'en' ? 'Our Journey' : '創照歷程'}
        </h2>
      </div>

      <div className="relative">
        {/* 中軸直線（桌機）／左軸直線（手機） */}
        <span
          aria-hidden
          className="absolute bottom-1 left-[6px] top-1 w-[2px] bg-brand-primary/50 md:left-1/2 md:-translate-x-1/2"
        />
        <ol className="relative flex flex-col gap-10 md:gap-12">
          {entries.map((entry, i) => (
            <Row entry={entry} index={i} key={entry.key} />
          ))}
        </ol>
      </div>
    </ScrollReveal>
  </section>
)

export const TimelineBlock: React.FC<TimelineBlockProps> = ({
  mode,
  items,
  events,
  locale = 'zh-TW',
}) => {
  let entries: Entry[] = []

  if (mode === 'reference') {
    const docs = (events ?? []).filter(
      (event): event is TimelineEvent => typeof event === 'object' && event !== null,
    )
    entries = [...docs]
      .sort((a, b) => a.year - b.year || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((event) => ({
        date: String(event.year),
        title: event.title,
        description: event.description,
        key: String(event.id),
      }))
  } else {
    entries = (items ?? []).map((item, i) => ({
      date: item.date,
      title: item.title,
      description: item.description,
      key: item.id ?? String(i),
    }))
  }

  if (entries.length === 0) return null

  return <TimelineList entries={entries} locale={locale} />
}
