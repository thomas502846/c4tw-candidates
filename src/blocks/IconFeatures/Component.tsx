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
  variant?: 'cards' | 'pillars' | 'roles' | null
  heading?: string | null
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
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
          <ItemIcon className="h-12 w-12" fallbackSrc={PERSONAL_ICONS[i]} item={item} />
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

// School 學員角色 4 portrait 線稿（school TA 618:730 拆件，落地 public/figma）
const ROLE_ICONS = [
  '/figma/school-role-1.png',
  '/figma/school-role-2.png',
  '/figma/school-role-3.png',
  '/figma/school-role-4.png',
]

/**
 * variant roles：學員角色（Figma school TA 619:640）——置中 4 欄，icon 在上、
 * 標題（olive）、說明（灰）；上方一條「標題＋滿版細線」眉標。
 */
const Roles: React.FC<{ heading?: string | null; items: IconFeatureItem[] }> = ({
  heading,
  items,
}) => (
  <div>
    {heading && (
      <div className="mb-10 flex items-center gap-5 md:mb-12">
        <h2 className="shrink-0 text-[20px] font-medium tracking-[0.1em] text-brand-primary md:text-[24px]">
          {heading}
        </h2>
        <span className="h-px flex-1 bg-brand-primary/40" />
      </div>
    )}
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-[60px]">
      {items.map((item, i) => (
        <div className="flex flex-col items-center text-center" key={item.id ?? i}>
          {/* 白圓底（Figma Frame 191：200×194 #FFFFFF rounded-97，落在米色帶上才看得到）；
              內 icon 149/200 ≈ 74%，比原本 92px 放大貼齊設計 */}
          <div className="flex aspect-square w-full max-w-[200px] items-center justify-center rounded-full bg-white">
            <ItemIcon className="h-[74%] w-[74%]" fallbackSrc={ROLE_ICONS[i]} item={item} />
          </div>
          {/* H4 Noto Sans TC Medium 19 / lh28 / ls10% / #9C9F33 */}
          <h3 className="mt-5 text-[17px] font-medium leading-[1.5] tracking-[0.1em] text-brand-primary md:text-[19px] md:leading-[28px]">
            {item.title}
          </h3>
          {/* Body Noto Sans TC Regular 16 / lh29 / ls10% / 近黑 */}
          {item.text && (
            <p className="mt-2.5 text-sm leading-[1.8] tracking-[0.1em] text-brand-ink md:text-base md:leading-[29px]">
              {item.text}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
)

export const IconFeaturesBlock: React.FC<IconFeaturesBlockProps> = ({ variant, heading, items }) => {
  if (!items || items.length === 0) return null

  // roles（school TA 619:640）＝滿版米色帶 #F7F7EB，與上方「我們看見的問題」ring 帶相接成一條；
  // 白圓 icon 需落在米色底上才顯現（RenderBlocks 對 roles 去掉 my-16 讓兩帶貼齊）。
  if (variant === 'roles') {
    return (
      <section className="bg-brand-surface py-14 md:py-20" data-block="iconFeatures">
        <ScrollReveal as="div" variant="up" className="container max-w-[1140px]">
          <Roles heading={heading} items={items} />
        </ScrollReveal>
      </section>
    )
  }

  return (
    <section className="container max-w-[1140px]" data-block="iconFeatures">
      {/* 卡片進場 Fade UP（Tracy node 86:363：滑到觸發、0→100%、0.6s） */}
      <ScrollReveal variant="up">
        {variant === 'pillars' ? <Pillars items={items} /> : <Cards items={items} />}
      </ScrollReveal>
    </section>
  )
}
