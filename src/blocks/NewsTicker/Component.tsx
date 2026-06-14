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

// Tracy 規格（node 4:4）：垂直輪播 Vertical News Slider
// － 每則停留 5 秒、向上滑動切換下一則、無限循環
// 切換時長：Tracy 標 0.5s，實作取 0.8s（較順）。
// 用 CSS keyframes（非 transition）：明確 from→to，避免 transition 同幀無起點而「閃現不滑」。
const HOLD_MS = 5000
const SLIDE_MS = 650

export const NewsTickerBlock: React.FC<NewsTickerBlockProps> = ({ items, locale = 'zh-TW' }) => {
  const enabledItems = (items ?? []).filter((item) => item.enabled !== false)
  const [index, setIndex] = useState(0)
  const [rolling, setRolling] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (enabledItems.length <= 1) return
    const id = setInterval(() => {
      if (reduced.current) {
        setIndex((i) => (i + 1) % enabledItems.length)
        return
      }
      setRolling(true) // 觸發 keyframe：兩列一起向上滾動 100%
    }, HOLD_MS)
    return () => clearInterval(id)
  }, [enabledItems.length])

  if (enabledItems.length === 0) return null

  const current = enabledItems[index]
  const next = enabledItems[(index + 1) % enabledItems.length]

  const renderText = (item: { text: string; url?: string | null }) =>
    item.url ? (
      <a className="transition-colors hover:text-brand-primary" href={item.url}>
        {item.text}
      </a>
    ) : (
      item.text
    )

  // keyframe 結束 → 換到下一則並瞬間復位（此時 rolling=false，無 animation，不會閃）
  const onRollEnd = () => {
    setIndex((i) => (i + 1) % enabledItems.length)
    setRolling(false)
  }

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

      {/* 垂直輪播視窗：兩列堆疊，rolling 時整體向上滾動 100% 帶出下一則 */}
      <div className="relative h-full flex-1 overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 flex flex-col"
          onAnimationEnd={onRollEnd}
          style={
            rolling
              ? { animation: `news-roll-up ${SLIDE_MS}ms ease forwards` }
              : { transform: 'translateY(0)' }
          }
        >
          {[current, next].map((item, row) => (
            <span
              aria-hidden={row === 1}
              className="flex h-[64px] items-center text-[16px] font-medium leading-[28px] tracking-[0.1em] whitespace-nowrap text-brand-ink md:h-[80px] md:text-[19px]"
              key={`${item.id ?? row}-${index}-${row}`}
            >
              {renderText(item)}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
