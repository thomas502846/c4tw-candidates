import React from 'react'

import { Media } from '@/components/Media'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type IconFeatureItem = {
  icon?: MediaDoc | string | number | null
  title: string
  text?: string | null
  id?: string | null
}

export type IconFeaturesBlockProps = {
  blockType: 'iconFeatures'
  variant?: 'cards' | 'pillars' | null
  items?: IconFeatureItem[] | null
}

const ItemIcon: React.FC<{ item: IconFeatureItem; className?: string; fallbackSrc?: string }> = ({
  item,
  className,
  fallbackSrc,
}) => {
  if (item.icon && typeof item.icon === 'object') {
    return (
      <span className={cn('block shrink-0 overflow-hidden', className)}>
        <Media resource={item.icon} imgClassName="h-full w-full object-contain" />
      </span>
    )
  }
  // 未上傳 icon 時，落地 Figma 抽出的線稿向量（care-icon 258:640 / personal-icon 269:648 拆件）
  if (fallbackSrc) {
    return (
      <span className={cn('block shrink-0 overflow-hidden', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="h-full w-full object-contain" src={fallbackSrc} />
      </span>
    )
  }
  return (
    <span
      aria-hidden
      className={cn('flex shrink-0 items-center justify-center rounded-full bg-brand-lime/30', className)}
    >
      <span className="h-1/2 w-1/2 rounded-full border-[3px] border-brand-lime" />
    </span>
  )
}

// Care 運作 4 步驟線稿 icon（care-icon 258:640 拆件，落地 public/figma）
const CARE_STEP_ICONS = [
  '/figma/care-step-1-assess.svg',
  '/figma/care-step-2-design.svg',
  '/figma/care-step-3-connect.svg',
  '/figma/care-step-4-accompany.svg',
]

/**
 * variant cards：Care 運作步驟列（care-icon 258:640）——4 張米色 #F7F7EB 橫卡
 * （左 icon ~64 + 右 title Bold 19 / caption 14）
 */
const Cards: React.FC<{ items: IconFeatureItem[] }> = ({ items }) => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[30px]">
    {items.map((item, i) => (
      <div
        key={item.id ?? i}
        className="flex items-center gap-4 rounded-[30px] bg-brand-surface px-6 py-6 lg:min-h-[120px]"
      >
        <ItemIcon className="h-14 w-14 lg:h-16 lg:w-16" fallbackSrc={CARE_STEP_ICONS[i]} item={item} />
        <div>
          <h3 className="text-[17px] font-bold tracking-[0.05em] text-brand-ink lg:text-[19px]">
            {item.title}
          </h3>
          {item.text && (
            <p className="mt-1 text-sm leading-[1.5] tracking-[0.05em] text-brand-ink/80">{item.text}</p>
          )}
        </div>
      </div>
    ))}
  </div>
)

// Care 個人 AIO 五直卡：深淺綠輪替 #8BA98B / #ADCB59
const pillarBgs = ['bg-brand-green', 'bg-brand-lime']

// 個人 AIO 5 直卡白圓內線稿 icon（personal-icon 269:648 拆件）
const PERSONAL_ICONS = [
  '/figma/personal-1.svg',
  '/figma/personal-2.svg',
  '/figma/personal-3.svg',
  '/figma/personal-4.svg',
  '/figma/personal-5.svg',
]

/**
 * variant pillars：Care 個人 AIO 五直卡（personal-icon 269:648，卡 185×290）
 * 白色圓 icon → 白字 Bold 19 → 白字 Caption 14
 */
const Pillars: React.FC<{ items: IconFeatureItem[] }> = ({ items }) => (
  // 行動版（M-care 269:648）：單欄滿版、深淺綠交替的直卡；桌機維持並排 185px 卡
  <div className="flex flex-col gap-4 md:flex md:flex-row md:justify-center md:gap-4 lg:gap-[54px]">
    {items.map((item, i) => (
      <div
        key={item.id ?? i}
        className={cn(
          // 平板（md）：5 卡等分縮放填滿、不爆版；桌機（lg）：回到 Figma 固定 185px 卡
          'flex flex-col items-center gap-4 rounded-[30px] px-6 py-8 text-center md:min-w-0 md:flex-1 md:py-10 md:min-h-[290px] lg:w-[185px] lg:flex-none',
          pillarBgs[i % pillarBgs.length],
        )}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
          <ItemIcon className="h-9 w-9" fallbackSrc={PERSONAL_ICONS[i]} item={item} />
        </span>
        <h3 className="text-[17px] font-bold leading-[1.5] tracking-[0.05em] text-white md:text-[19px]">
          {item.title}
        </h3>
        {item.text && (
          <p className="text-sm leading-[1.6] tracking-[0.03em] text-white/95">{item.text}</p>
        )}
      </div>
    ))}
  </div>
)

export const IconFeaturesBlock: React.FC<IconFeaturesBlockProps> = ({ variant, items }) => {
  if (!items || items.length === 0) return null
  return (
    <section className="container max-w-[1240px]" data-block="iconFeatures">
      {/* 卡片進場 Fade UP（Tracy node 86:363：滑到觸發、0→100%、0.6s） */}
      <ScrollReveal variant="up">
        {variant === 'pillars' ? <Pillars items={items} /> : <Cards items={items} />}
      </ScrollReveal>
    </section>
  )
}
