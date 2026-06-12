'use client'

import React, { useEffect, useState } from 'react'

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

const SLIDE_INTERVAL_MS = 5000

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

  // 自動輪播（Tracy 6/11 定稿：多張 KV + 圓點指示）
  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <section
      className="relative -mt-32 h-[420px] w-full overflow-hidden md:h-[640px]"
      data-block="hero"
    >
      {/* 輪播底圖 */}
      {slides.map((item, i) => (
        <div
          aria-hidden={i !== active}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
            i === active ? 'opacity-100' : 'opacity-0',
          )}
          key={item.id ?? i}
        >
          <Media fill imgClassName="object-cover" priority={i === 0} resource={item.image} />
        </div>
      ))}
      {/* 全幅遮罩（Figma rgba(50,50,50,0.7)，取較透值保照片可辨） */}
      <div aria-hidden className="absolute inset-0 bg-[rgba(50,50,50,0.5)]" />

      {/* 中央標語 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-6 text-center text-white md:gap-6">
        {title && (
          <h1 className="text-[24px] font-bold leading-[1.7] tracking-[0.15em] md:text-[36px] md:leading-[60px]">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="max-w-[36rem] text-[15px] leading-[1.9] tracking-[0.1em] md:text-[17px]">
            {subtitle}
          </p>
        )}
        {cta?.label && cta?.url && (
          <a
            className="mt-1 inline-flex items-center gap-2 rounded-[30px] bg-brand-lime px-7 py-2.5 text-[16px] font-medium tracking-[0.1em] text-white transition-colors hover:bg-brand-primary md:text-[19px]"
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
