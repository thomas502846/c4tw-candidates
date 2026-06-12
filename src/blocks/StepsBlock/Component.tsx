import React from 'react'

import { Media } from '@/components/Media'
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
  title?: string | null
  items?: StepItem[] | null
}

const StepIcon: React.FC<{ item: StepItem; className?: string; placeholderClass?: string }> = ({
  item,
  className,
  placeholderClass,
}) => {
  if (item.icon && typeof item.icon === 'object') {
    return (
      <span className={cn('block shrink-0 overflow-hidden', className)}>
        <Media resource={item.icon} imgClassName="h-full w-full object-contain" />
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
            <StepIcon className="h-7 w-7" item={item} />
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
          <StepIcon className="h-16 w-16 md:h-20 md:w-20" item={item} placeholderClass="border-brand-lime" />
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
  <div className="grid gap-6 md:grid-cols-3 md:gap-[46px]">
    {items.map((item, i) => (
      <div
        key={item.id ?? i}
        className="flex min-h-[141px] flex-col items-center justify-center gap-3 rounded-[30px] border-[1.5px] border-brand-primary px-8 py-7 text-center"
      >
        <svg
          aria-hidden
          className="h-9 w-9"
          fill="none"
          stroke="#9C9F33"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 40 40"
        >
          <path d="M20 6v26M10 23l10 10 10-10" />
        </svg>
        <p className="text-base leading-[1.7] tracking-[0.05em] text-brand-primary">
          {item.title}
          {item.title && item.text ? '，' : ''}
          {item.text}
        </p>
      </div>
    ))}
  </div>
)

export const StepsBlockBlock: React.FC<StepsBlockProps> = ({ variant, title, items }) => {
  if (!items || items.length === 0) return null
  const variants = { cardRow: CardRow, inline: Inline, outline: Outline } as const
  const Variant = variants[variant ?? 'cardRow'] ?? CardRow

  return (
    <section className="container max-w-[1240px]" data-block="stepsBlock">
      {title && (
        <h2 className="mb-10 text-center text-[24px] font-bold leading-[1.7] tracking-[0.1em] text-brand-ink md:text-[30px]">
          {title}
        </h2>
      )}
      <Variant items={items} />
    </section>
  )
}
