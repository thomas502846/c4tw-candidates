'use client'

import React, { useEffect, useRef, useState } from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後，改用 import type { HeroBlock as HeroBlockProps } from '@/payload-types'
export type HeroBlockProps = {
  blockType: 'hero'
  images?: { image: MediaDoc | string | number; id?: string | null }[] | null
  title?: string | null
  subtitle?: string | null
  cta?: { label?: string | null; url?: string | null } | null
}

// Tracy 規格（node 4:4 / 0:1）：自動輪播、右→左、3s、Slide 轉場、不放大、循環、手機左右滑
const SLIDE_INTERVAL_MS = 3000
const SWIPE_THRESHOLD_PX = 40

const ArrowRight: React.FC = () => (
  <svg
    aria-hidden
    className="h-5 w-5 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

export const HeroBlock: React.FC<HeroBlockProps> = ({ images, title, subtitle, cta }) => {
  const slides = (images ?? []).filter((item) => Boolean(item?.image))
  const [active, setActive] = useState(0)
  const touchStartX = useRef<number | null>(null)

  // 自動輪播（Tracy：右→左、3s、循環）；右→左＝track 往負向位移、active 遞增
  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [slides.length])

  // 手機左右滑切換
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || slides.length <= 1) return
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current
    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) {
      setActive((current) =>
        dx < 0
          ? (current + 1) % slides.length // 左滑→下一張
          : (current - 1 + slides.length) % slides.length, // 右滑→上一張
      )
    }
    touchStartX.current = null
  }

  return (
    <section
      className="relative -mt-16 h-[420px] w-full overflow-hidden md:h-[700px]"
      data-block="hero"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 輪播底圖：Slide 轉場（水平 track，translateX 隨 active 位移） */}
      <div
        className="absolute inset-0 flex h-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((item, i) => (
          <div
            aria-hidden={i !== active}
            className="relative h-full w-full shrink-0"
            key={item.id ?? i}
          >
            <Media fill imgClassName="object-cover" priority={i === 0} resource={item.image} />
          </div>
        ))}
      </div>
      {/* 全幅遮罩（Figma rgba(50,50,50,0.7)，取較透值保照片可辨） */}
      <div aria-hidden className="absolute inset-0 bg-[rgba(50,50,50,0.5)]" />

      {/* 中央標語：兩行同級 H2 樣式（Figma Bold 36 / lh 60 / tracking 5.4px，兩行置中壓圖） */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1 px-6 text-center text-white">
        {title && (
          <h1 className="text-[22px] font-bold leading-[1.9] tracking-[0.15em] md:text-[36px] md:leading-[60px]">
            {title}
            {subtitle && (
              <>
                <br />
                <span>{subtitle}</span>
              </>
            )}
          </h1>
        )}
        {cta?.label && cta?.url && (
          <a
            className="btn-cft btn-highlight mt-1 inline-flex items-center gap-2 rounded-[30px] px-7 py-2.5 text-[16px] font-medium tracking-[0.1em] md:text-[19px]"
            href={cta.url}
          >
            {cta.label}
            <ArrowRight />
          </a>
        )}
      </div>

      {/* 圓點指示 */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2.5 md:bottom-7">
          {slides.map((_, i) => (
            <button
              aria-label={`切換到第 ${i + 1} 張`}
              className={cn(
                'h-[11px] w-[11px] rounded-full transition-colors',
                i === active ? 'bg-white' : 'bg-white/45 hover:bg-white/70',
              )}
              key={i}
              onClick={() => setActive(i)}
              type="button"
            />
          ))}
        </div>
      )}
    </section>
  )
}
