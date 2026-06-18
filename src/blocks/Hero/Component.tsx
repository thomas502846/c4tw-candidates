'use client'

import React, { useEffect, useRef, useState } from 'react'

import { FramedImage } from '@/components/Media/FramedImage'
import { cn } from '@/utilities/ui'
import { normalizeCtaHref } from '@/utilities/normalizeCtaHref'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後，改用 import type { HeroBlock as HeroBlockProps } from '@/payload-types'
type HeroSlide = {
  image: MediaDoc | string | number
  framePos?: unknown
  title?: string | null
  subtitle?: string | null
  cta?: { label?: string | null; url?: string | null } | null
  id?: string | null
}

export type HeroBlockProps = {
  blockType: 'hero'
  images?: HeroSlide[] | null
}

// Tracy 規格（node 4:4 / 0:1）：
// 照片＝由單張改輪播、每張停留 4 秒、自動切換、Slide 轉場、循環、手機左右滑
// 文字＝每張圖各自的文字，與圖一起滑動切換；進場 Fade Up（下往上 24px、淡入、Delay 0.3s、Duration 0.8s）
const SLIDE_INTERVAL_MS = 4000
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

export const HeroBlock: React.FC<HeroBlockProps> = ({ images }) => {
  const slides = (images ?? []).filter((item) => Boolean(item?.image))
  const [active, setActive] = useState(0)
  // 進場 Fade Up：mount 後一拍翻 true，觸發文字由下往上淡入（一次性）
  const [entered, setEntered] = useState(false)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), 50)
    return () => window.clearTimeout(id)
  }, [])

  // 自動輪播（Tracy：4s、循環、Slide）
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

  if (slides.length === 0) return null

  return (
    <section
      className="relative -mt-16 h-[420px] w-full overflow-hidden md:h-[700px]"
      data-block="hero"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 輪播軌道：圖＋文字同在一個 panel，整個 panel 一起 Slide（translateX 隨 active 位移） */}
      <div
        className="absolute inset-0 flex h-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((slide, i) => {
          const href = slide.cta?.url ? normalizeCtaHref(slide.cta.url) : undefined
          return (
            <div
              aria-hidden={i !== active}
              className="relative h-full w-full shrink-0 overflow-hidden"
              key={slide.id ?? i}
            >
              {/* 底圖：每裝置焦點＋縮放由 CMS 拖曳控制（滿版 banner，無 hover 放大） */}
              <FramedImage
                id={slide.id ?? i}
                resource={slide.image}
                framePos={slide.framePos}
                priority={i === 0 ? true : undefined}
                className="absolute inset-0"
              />
              {/* 全幅遮罩（Figma rgba(50,50,50)，取較透值保照片可辨；正式照進來後可再調淡） */}
              <div aria-hidden className="absolute inset-0 bg-[rgba(50,50,50,0.45)]" />

              {/* 此張的文字（與圖一起滑）；進場 Fade Up */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
                {slide.title && (
                  <h1
                    className={cn(
                      'text-[22px] font-bold leading-[1.9] tracking-[0.15em] md:text-[36px] md:leading-[60px]',
                      'transition-all duration-[800ms] ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100',
                      'delay-[300ms]',
                      entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
                    )}
                  >
                    {slide.title}
                    {slide.subtitle && (
                      <>
                        <br />
                        <span>{slide.subtitle}</span>
                      </>
                    )}
                  </h1>
                )}
                {slide.cta?.label && href && (
                  <a
                    className={cn(
                      'btn-cft btn-highlight mt-1 inline-flex items-center gap-2 rounded-[30px] px-7 py-2.5 text-[16px] font-medium tracking-[0.1em] md:text-[19px]',
                      'transition-all duration-[800ms] ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100',
                      'delay-[450ms]',
                      entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
                    )}
                    href={href}
                  >
                    {slide.cta.label}
                    <ArrowRight />
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 圓點指示 */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2.5 md:bottom-7">
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
