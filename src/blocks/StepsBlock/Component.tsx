import React from 'react'

import { Media } from '@/components/Media'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type StepItem = {
  icon?: MediaDoc | string | number | null
  title?: string | null
  text?: string | null
  id?: string | null
}

export type StepsBlockProps = {
  blockType: 'stepsBlock'
  variant?: 'cardRow' | 'inline' | 'outline' | null
  eyebrow?: string | null
  heading?: string | null
  title?: string | null
  body?: string | null
  footnote?: string | null
  items?: StepItem[] | null
}

const StepIcon: React.FC<{
  item: StepItem
  className?: string
  placeholderClass?: string
  fallbackSrc?: string
}> = ({ item, className, placeholderClass, fallbackSrc }) => {
  if (item.icon && typeof item.icon === 'object') {
    return (
      <span className={cn('block shrink-0 overflow-hidden', className)}>
        <Media resource={item.icon} imgClassName="h-full w-full object-contain" />
      </span>
    )
  }
  // 未上傳 icon 時落地 Figma 抽出線稿（eap-icon 263:421 / training 流程 285:497 拆件）
  if (fallbackSrc) {
    return (
      <span className={cn('block shrink-0 overflow-hidden', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="h-full w-full object-contain" src={fallbackSrc} />
      </span>
    )
  }
  return (
    <span aria-hidden className={cn('flex shrink-0 items-center justify-center', className)}>
      <span className={cn('h-1/2 w-1/2 rounded-full border-[3px]', placeholderClass ?? 'border-white/80')} />
    </span>
  )
}

const ArrowRightCircle: React.FC = () => (
  <span
    aria-hidden
    className="flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full bg-brand-lime/40 text-xl font-bold text-white"
  >
    →
  </span>
)

// EAP 三步驟綠圓內白線稿 icon（eap-icon 263:421 拆件）
const EAP_STEP_ICONS = ['/figma/eap-step-1.svg', '/figma/eap-step-2.svg', '/figma/eap-step-3.svg']

// Training 發展路徑三步驟線稿 icon（training 流程 285:497／icon-26~28）
const TRAINING_FLOW_ICONS = [
  '/figma/training-icon-26.svg',
  '/figma/training-icon-27.svg',
  '/figma/training-icon-28.svg',
]

/**
 * variant cardRow：Care EAP 三步驟（eap-icon 263:421）——一張整寬米色卡 #F7F7EB rounded-30，
 * 內含 3 步驟（圓形 #8BA98B icon → title Bold 19 → caption 14）＋步驟間淺綠圓箭頭
 */
const CardRow: React.FC<{ items: StepItem[] }> = ({ items }) => (
  <div className="flex flex-col gap-6 rounded-[30px] bg-brand-surface px-8 py-10 md:flex-row md:items-start md:justify-between md:gap-4 md:px-12">
    {items.map((item, i) => (
      <React.Fragment key={item.id ?? i}>
        {i > 0 && (
          <span className="hidden md:mt-4 md:block">
            <ArrowRightCircle />
          </span>
        )}
        <div className="flex flex-1 flex-col items-center gap-3 text-center md:max-w-[292px]">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green">
            <StepIcon className="h-7 w-7" fallbackSrc={EAP_STEP_ICONS[i]} item={item} />
          </span>
          {item.title && (
            <h3 className="text-[17px] font-bold tracking-[0.05em] text-brand-ink md:text-[19px]">
              {item.title}
            </h3>
          )}
          {item.text && (
            <p className="text-sm leading-[1.6] tracking-[0.03em] text-brand-ink/80">{item.text}</p>
          )}
        </div>
      </React.Fragment>
    ))}
  </div>
)

/**
 * variant inline：Training 發展路徑三步驟（support 區底部）——線稿 icon ~80 +
 * 下方 Bold 19 label，步驟間 #ADCB59 箭頭（無卡底）
 */
const Inline: React.FC<{ items: StepItem[] }> = ({ items }) => (
  <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10">
    {items.map((item, i) => (
      <React.Fragment key={item.id ?? i}>
        {i > 0 && (
          <span aria-hidden className="text-3xl font-bold text-brand-lime">
            <span className="hidden md:inline">→</span>
            <span className="md:hidden">↓</span>
          </span>
        )}
        <div className="flex flex-col items-center gap-3 text-center">
          <StepIcon
            className="h-16 w-16 md:h-20 md:w-20"
            fallbackSrc={TRAINING_FLOW_ICONS[i]}
            item={item}
            placeholderClass="border-brand-lime"
          />
          {item.title && (
            <h3 className="text-[17px] font-bold tracking-[0.1em] text-brand-ink md:text-[19px]">
              {item.title}
            </h3>
          )}
          {item.text && (
            <p className="text-sm leading-[1.6] tracking-[0.03em] text-brand-ink/80">{item.text}</p>
          )}
        </div>
      </React.Fragment>
    ))}
  </div>
)

/**
 * variant outline：Training 影響力三卡（impact 280:444）——transparent 底＋ #9C9F33 細邊框
 * rounded-30、頂部 ↓ icon、文字 #9C9F33 置中兩行
 */
const Outline: React.FC<{ items: StepItem[] }> = ({ items }) => (
  // Figma impact 280:444：2 卡並排（各 562、gap 16，容器 1140），#9C9F33 細框 rounded。
  // 卡內置中、由上而下：標題 → ↓ 箭頭 → 內文（皆 olive #9C9F33）。
  <div className="mx-auto grid max-w-[1140px] gap-6 md:grid-cols-2 md:gap-4">
    {items.map((item, i) => (
      <div
        key={item.id ?? i}
        className="flex min-h-[174px] flex-col items-center justify-center gap-3 rounded-[20px] border-[1.5px] border-brand-primary px-8 py-8 text-center"
      >
        {item.title && (
          <p className="text-[17px] font-medium tracking-[0.1em] text-brand-primary md:text-[18px]">
            {item.title}
          </p>
        )}
        <svg
          aria-hidden
          className="h-7 w-7"
          fill="none"
          stroke="#9C9F33"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 40 40"
        >
          <path d="M20 6v26M10 23l10 10 10-10" />
        </svg>
        {item.text && (
          <p className="whitespace-pre-line text-[15px] leading-[1.7] tracking-[0.05em] text-brand-primary md:text-base">
            {item.text}
          </p>
        )}
      </div>
    ))}
  </div>
)

export const StepsBlockBlock: React.FC<StepsBlockProps> = ({
  variant,
  eyebrow,
  heading,
  title,
  body,
  footnote,
  items,
}) => {
  if (!items || items.length === 0) return null
  const variants = { cardRow: CardRow, inline: Inline, outline: Outline } as const
  const Variant = variants[variant ?? 'cardRow'] ?? CardRow
  const hasHeader = eyebrow || heading || title || body
  // outline（training 培力價值 Frame 189）標題群組靠左；其餘變體維持置中。
  const leftAlign = variant === 'outline'

  return (
    <section className="container max-w-[1240px]" data-block="stepsBlock">
      {/* 區塊進場 Fade In（標題）＋ Fade UP／DOWN（步驟卡）（Tracy node 86:363/97:564） */}
      <ScrollReveal variant="in">
        {hasHeader && (
          <div className={cn('mb-10', leftAlign ? 'text-left' : 'text-center')}>
            {eyebrow && (
              // .fig 眉標：● dot + #757575
              <p
                className={cn(
                  'mb-3 flex items-center gap-2.5 text-base tracking-[0.1em] text-brand-muted',
                  leftAlign ? 'justify-start' : 'justify-center',
                )}
              >
                <span aria-hidden className="inline-block h-[15px] w-[15px] shrink-0 rounded-full bg-brand-highlight" />
                {eyebrow}
              </p>
            )}
            {heading && (
              // .fig 培力價值：Bold 40 / #8ba98b
              <h2 className="text-[26px] font-bold leading-[1.5] tracking-[0.1em] text-brand-green md:text-[40px] md:leading-[60px]">
                {heading}
              </h2>
            )}
            {title && (
              <p className="mt-3 text-lg font-medium leading-[1.6] tracking-[0.1em] text-brand-ink md:text-[22px]">
                {title}
              </p>
            )}
            {body && (
              <p
                className={cn(
                  'mt-4 max-w-3xl whitespace-pre-line text-base leading-[1.85] tracking-[0.1em] text-brand-ink',
                  leftAlign ? '' : 'mx-auto',
                )}
              >
                {body}
              </p>
            )}
          </div>
        )}
        <Variant items={items} />
        {footnote && (
          <p className="mx-auto mt-8 max-w-3xl whitespace-pre-line text-center text-base leading-[1.85] tracking-[0.1em] text-brand-ink">
            {footnote}
          </p>
        )}
      </ScrollReveal>
    </section>
  )
}
