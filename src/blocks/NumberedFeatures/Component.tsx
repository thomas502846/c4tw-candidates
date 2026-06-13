import React from 'react'

import { Media } from '@/components/Media'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type NumberedFeatureItem = {
  number: string
  title: string
  text: string
  image?: MediaDoc | string | number | null
  id?: string | null
}

export type NumberedFeaturesBlockProps = {
  blockType: 'numberedFeatures'
  eyebrow?: string | null
  items?: NumberedFeatureItem[] | null
}

/** 眉標：黃綠圓點 + 英文小標 */
const Eyebrow: React.FC<{ text: string }> = ({ text }) => (
  <p className="mb-4 flex items-center gap-2.5 text-base tracking-[0.1em] text-brand-muted">
    <span aria-hidden className="inline-block h-[15px] w-[15px] shrink-0 rounded-full bg-brand-highlight" />
    {text}
  </p>
)

/**
 * Home Service 01/02/03（Figma 231:804/807/808）
 * 奇數項（0,2…）＝左文右圖＋滿版米色帶（圖卡上緣突出帶外）；偶數項＝左圖右文白底
 */
export const NumberedFeaturesBlock: React.FC<NumberedFeaturesBlockProps> = ({ eyebrow, items }) => {
  if (!items || items.length === 0) return null

  return (
    <div data-block="numberedFeatures">
      {items.map((item, i) => {
        const surface = i % 2 === 0 // 米色帶
        const imageRight = i % 2 === 0 // 左文右圖

        const textCol = (
          <div className="md:w-[41%]">
            {i === 0 && eyebrow && <Eyebrow text={eyebrow} />}
            <div className="flex items-baseline gap-3">
              <span
                className="text-[40px] font-semibold leading-none tracking-tight text-brand-highlight md:text-[52px]"
                aria-hidden
              >
                {item.number}
              </span>
              <h2 className="text-[26px] font-bold tracking-[0.15em] text-brand-green md:text-4xl">
                {item.title}
              </h2>
            </div>
            <p className="mt-6 whitespace-pre-line text-justify text-base leading-[1.85] tracking-[0.1em] text-brand-ink">
              {item.text}
            </p>
          </div>
        )

        const imageCol = (
          <div className="md:w-[52%]">
            <div
              className={cn('overflow-hidden rounded-[30px] bg-[#D9D9D9]', {
                // 米色帶區的圖卡上緣突出帶外（Figma service1/3 交疊效果）
                'md:-mt-24': surface,
              })}
            >
              {item.image && typeof item.image === 'object' ? (
                <Media resource={item.image} imgClassName="aspect-[59/40] w-full object-cover" />
              ) : (
                <div className="aspect-[59/40] w-full" />
              )}
            </div>
          </div>
        )

        const inner = (
          <div
            className={cn('container flex max-w-[1240px] flex-col gap-10 md:items-center md:gap-16', {
              'md:flex-row': imageRight,
              'md:flex-row-reverse': !imageRight,
            })}
          >
            {textCol}
            {imageCol}
          </div>
        )

        return (
          <section
            key={item.id ?? i}
            className={cn(surface ? 'mt-24 bg-brand-surface py-14 md:py-16' : 'py-14 md:py-16')}
          >
            {/* 01~03 圖文進場 Fade UP（Tracy node 0:1）；底色帶（surface）不加效果 */}
            {surface ? inner : <ScrollReveal variant="up">{inner}</ScrollReveal>}
          </section>
        )
      })}
    </div>
  )
}
