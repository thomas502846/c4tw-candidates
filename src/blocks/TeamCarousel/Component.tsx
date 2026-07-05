'use client'

import React, { useCallback, useRef, useState } from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type TeamMember = {
  photo?: MediaDoc | string | number | null
  name: string
  role?: string | null
  bio?: string | null
  id?: string | null
}

export type TeamCarouselBlockProps = {
  blockType: 'teamCarousel'
  eyebrow?: string | null
  title?: string | null
  lead?: string | null
  members?: TeamMember[] | null
}

const Arrow: React.FC<{ dir: 'left' | 'right' }> = ({ dir }) => (
  <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
    {dir === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
  </svg>
)

export const TeamCarouselBlock: React.FC<TeamCarouselBlockProps> = ({
  eyebrow,
  title,
  lead,
  members,
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  const scrollByCard = (dir: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    // 一次捲一張卡（含間距）；卡寬取第一張實際寬度，退回 300
    const card = el.querySelector<HTMLElement>('[data-team-card]')
    const step = card ? card.offsetWidth + 24 : 300
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' })
  }

  if (!members || members.length === 0) return null

  return (
    <section className="container max-w-[1140px]" data-block="teamCarousel">
      <div className="mb-8 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div className="md:max-w-[62%]">
          {(eyebrow || title) && (
            <p className="mb-4 flex items-center gap-2.5 text-base tracking-[0.1em] text-brand-muted">
              <span aria-hidden className="inline-block h-[13px] w-[13px] shrink-0 rounded-full bg-brand-highlight" />
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-[28px] font-bold leading-[1.5] tracking-[0.1em] text-brand-green md:text-[40px] md:leading-[56px]">
              {title}
            </h2>
          )}
          {lead && (
            <p className="mt-4 whitespace-pre-line text-base leading-[1.85] tracking-[0.1em] text-brand-ink">
              {lead}
            </p>
          )}
        </div>
        {/* 左右箭頭（桌機）：手機直接橫滑 */}
        <div className="hidden shrink-0 gap-3 md:flex">
          {(['left', 'right'] as const).map((dir) => (
            <button
              aria-label={dir === 'left' ? '上一個' : '下一個'}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full border border-brand-green text-brand-green transition-colors',
                'hover:bg-brand-green hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-green',
              )}
              disabled={dir === 'left' ? atStart : atEnd}
              key={dir}
              onClick={() => scrollByCard(dir)}
              type="button"
            >
              <Arrow dir={dir} />
            </button>
          ))}
        </div>
      </div>

      {/* 橫滑軌（snap）：手機一次約 1.2 張露出、桌機約 3–4 張 */}
      <div
        className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={updateEdges}
        ref={trackRef}
      >
        {members.map((m, i) => (
          <article
            className="w-[240px] shrink-0 snap-start md:w-[268px]"
            data-team-card
            key={m.id ?? i}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[24px] bg-brand-surface">
              {m.photo && typeof m.photo === 'object' ? (
                <Media resource={m.photo} imgClassName="h-full w-full object-cover" fill />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-brand-green/40">
                  <svg aria-hidden className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </div>
            <h3 className="mt-4 text-[19px] font-bold tracking-[0.1em] text-brand-ink">{m.name}</h3>
            {m.role && (
              <p className="mt-1 text-[15px] font-medium tracking-[0.1em] text-brand-primary">{m.role}</p>
            )}
            {m.bio && (
              <p className="mt-2 whitespace-pre-line text-[14px] leading-[1.8] tracking-[0.05em] text-brand-ink/80">
                {m.bio}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
