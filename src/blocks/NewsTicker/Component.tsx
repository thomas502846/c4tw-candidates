'use client'

import React, { useEffect, useRef, useState } from 'react'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type NewsTickerBlockProps = {
  blockType: 'newsTicker'
  items?:
    | {
        text: string
        url?: string | null
        enabled?: boolean | null
        id?: string | null
      }[]
    | null
  locale?: 'zh-TW' | 'en'
}

// Tracy 規格（node 4:4）：垂直輪播 Vertical News Slider — 每則停留 5 秒、向上滑動切換、無限循環。
// 切換時長：暫放慢到 1.2s 方便觀察；確認無誤後可調回 0.5~0.65s。
//
// 設計：純 tick 推導（不用 index、不用 onAnimationEnd）。
//  - tick T 時：上列 = 前一則、下列 = 第 T 則；軌道 key=T → 每輪掛「全新 DOM 節點」，
//    CSS keyframe 必從頭跑（持久節點重複套同名 animation 不會重啟 → 第二輪起 flash，這是 PC/Edge 看到的根因）。
//  - 動畫 forwards 停在 -50%（顯示第 T 則）；下一輪 remount 從 translateY(0) 起、上列正好也是第 T 則 → 視覺連續、不跳。
const HOLD_MS = 5000
const SLIDE_MS = 1200

export const NewsTickerBlock: React.FC<NewsTickerBlockProps> = ({ items, locale = 'zh-TW' }) => {
  const enabledItems = (items ?? []).filter((item) => item.enabled !== false)
  const [tick, setTick] = useState(0)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (enabledItems.length <= 1) return
    const id = setInterval(() => setTick((t) => t + 1), HOLD_MS)
    return () => clearInterval(id)
  }, [enabledItems.length])

  if (enabledItems.length === 0) return null

  const len = enabledItems.length
  const animating = tick > 0 && !reduced.current
  const cur = enabledItems[tick % len]
  const prev = enabledItems[(tick - 1 + len) % len]
  const next = enabledItems[(tick + 1) % len]
  // 動畫時：上列=前一則滑出、下列=本則滑入；靜態時（首載 / reduced）：上列=本則、下列=下一則
  const rows = animating ? [prev, cur] : [cur, next]

  const renderText = (item: { text: string; url?: string | null }) =>
    item.url ? (
      <a className="transition-colors hover:text-brand-primary" href={item.url}>
        {item.text}
      </a>
    ) : (
      item.text
    )

  return (
    <aside
      aria-label={locale === 'en' ? 'Latest news' : '最新消息'}
      aria-live="polite"
      className="flex h-[64px] w-full items-center gap-5 overflow-hidden bg-brand-surface md:h-[80px]"
      data-block="newsTicker"
    >
      {/* 左側固定 label（Figma 110:346 / 10:17：#ADCB59 pill 白字） */}
      <span className="ml-4 shrink-0 rounded-[30px] bg-brand-lime px-5 py-1.5 text-[14px] font-medium tracking-[0.1em] whitespace-nowrap text-white md:ml-12 md:text-[16px]">
        {locale === 'en' ? 'NEWS' : '最新消息'}
      </span>

      {/* key=tick → 每輪全新節點，動畫保證從頭跑 */}
      <div className="relative h-full flex-1 overflow-hidden">
        <div
          key={tick}
          className="absolute inset-x-0 top-0 flex flex-col"
          style={animating ? { animation: `news-roll-up ${SLIDE_MS}ms ease forwards` } : undefined}
        >
          {rows.map((item, row) => (
            <span
              aria-hidden={row === 1}
              className="flex h-[64px] items-center text-[16px] font-medium leading-[28px] tracking-[0.1em] whitespace-nowrap text-brand-ink md:h-[80px] md:text-[19px]"
              key={row}
            >
              {renderText(item)}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
