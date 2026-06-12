import React from 'react'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type TwoColumnItem = {
  image?: MediaDoc | string | number | null
  title: string
  text?: string | null
  id?: string | null
}

export type TwoColumnBlockProps = {
  blockType: 'twoColumn'
  direction?: 'imageLeft' | 'imageRight' | null
  variant?: 'standard' | 'hero' | null
  background?: 'none' | 'surface' | null
  eyebrow?: string | null
  image: MediaDoc | string | number
  title?: string | null
  richText?: DefaultTypedEditorState | null
  cta?: { label?: string | null; url?: string | null } | null
  items?: TwoColumnItem[] | null
  itemsStyle?: 'iconCards' | 'steps' | 'pillars' | 'grid' | 'pathway' | null
}

/* ---------------------------------------------------------------- */
/* 共用小元件（Figma 全站 patterns）                                   */
/* ---------------------------------------------------------------- */

/** 眉標：黃綠圓點 + 英文小標（title1/2/3 component） */
const Eyebrow: React.FC<{ text: string }> = ({ text }) => (
  <p className="mb-4 flex items-center gap-2.5 text-base tracking-[0.1em] text-brand-muted">
    <span aria-hidden className="inline-block h-[15px] w-[15px] shrink-0 rounded-full bg-brand-highlight" />
    {text}
  </p>
)

/** pill CTA 按鈕：rounded-30 綠底白字 + 箭頭 */
const PillCta: React.FC<{ label: string; url: string }> = ({ label, url }) => (
  <a
    className="inline-flex items-center gap-2.5 rounded-[30px] bg-brand-lime px-7 py-2.5 text-[17px] font-medium tracking-[0.1em] text-white transition-colors hover:bg-brand-primary"
    href={url}
  >
    {label}
    <span aria-hidden className="text-xl leading-none">→</span>
  </a>
)

/** 項目卡 icon：有上傳圖用圖，否則深淺綠輪替的圓 */
const ItemIcon: React.FC<{ item: TwoColumnItem; index: number; size?: string }> = ({
  item,
  index,
  size = 'h-16 w-16',
}) => {
  const fallbackBg = ['bg-brand-lime', 'bg-brand-primary', 'bg-brand-green'][index % 3]
  if (item.image && typeof item.image === 'object') {
    return (
      <span className={cn('block shrink-0 overflow-hidden rounded-full', size)}>
        <Media resource={item.image} imgClassName="h-full w-full object-cover" />
      </span>
    )
  }
  return (
    <span aria-hidden className={cn('flex shrink-0 items-center justify-center rounded-full', size, fallbackBg)}>
      <span className="h-1/3 w-1/3 rounded-full border-[3px] border-white/90" />
    </span>
  )
}

/* ---------------------------------------------------------------- */
/* 項目卡版型                                                         */
/* ---------------------------------------------------------------- */

const ItemsIconCards: React.FC<{ items: TwoColumnItem[] }> = ({ items }) => (
  <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
    {items.map((item, i) => (
      <div key={item.id ?? i} className="flex flex-col items-center gap-3 text-center">
        <ItemIcon item={item} index={i} />
        <h3 className="text-[17px] font-medium tracking-[0.1em] text-brand-ink">{item.title}</h3>
        {item.text && (
          <p className="text-sm leading-[1.7] tracking-[0.05em] text-brand-muted">{item.text}</p>
        )}
      </div>
    ))}
  </div>
)

const ItemsSteps: React.FC<{ items: TwoColumnItem[] }> = ({ items }) => (
  <div className="mt-14 flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-center">
    {items.map((item, i) => (
      <React.Fragment key={item.id ?? i}>
        {i > 0 && (
          <span aria-hidden className="self-center text-2xl font-bold text-brand-primary md:px-2">
            <span className="hidden md:inline">→</span>
            <span className="md:hidden">↓</span>
          </span>
        )}
        <div className="flex flex-1 flex-col items-center gap-3 rounded-[20px] border border-brand-primary/30 bg-white px-6 py-6 text-center">
          <ItemIcon item={item} index={i} size="h-14 w-14" />
          <h3 className="text-base font-medium tracking-[0.1em] text-brand-ink">{item.title}</h3>
          {item.text && <p className="text-sm leading-[1.7] text-brand-muted">{item.text}</p>}
        </div>
      </React.Fragment>
    ))}
  </div>
)

const pillarBgs = ['bg-brand-green', 'bg-brand-lime', 'bg-brand-primary', 'bg-brand-lime', 'bg-brand-green']

const ItemsPillars: React.FC<{ items: TwoColumnItem[] }> = ({ items }) => (
  <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:flex md:justify-center md:gap-5">
    {items.map((item, i) => (
      <div
        key={item.id ?? i}
        className={cn(
          'flex flex-col items-center gap-4 rounded-[30px] px-5 py-8 text-center text-white md:w-44 md:py-10',
          pillarBgs[i % pillarBgs.length],
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25">
          <ItemIcon item={item} index={i} size="h-9 w-9" />
        </span>
        <h3 className="text-[17px] font-bold tracking-[0.15em]">{item.title}</h3>
        {item.text && <p className="text-[13px] leading-[1.7] tracking-[0.05em] text-white/90">{item.text}</p>}
      </div>
    ))}
  </div>
)

const ItemsGrid: React.FC<{ items: TwoColumnItem[] }> = ({ items }) => (
  <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 md:gap-y-10">
    {items.map((item, i) => (
      <div key={item.id ?? i} className="flex flex-col">
        <div className="aspect-[4/3] overflow-hidden rounded-[30px] bg-[#D9D9D9]">
          {item.image && typeof item.image === 'object' && (
            <Media resource={item.image} imgClassName="h-full w-full object-cover" />
          )}
        </div>
        <h3 className="mt-4 inline-block text-[15px] font-medium tracking-[0.15em] text-brand-primary">
          {item.title}
        </h3>
        <span aria-hidden className="mt-1 block h-px w-full bg-brand-primary/30" />
        {item.text && (
          <p className="mt-2 text-sm leading-[1.7] tracking-[0.05em] text-brand-ink">{item.text}</p>
        )}
      </div>
    ))}
  </div>
)

/** School 培育路徑：高低交錯直立卡（深淺綠 + 子品牌深青綠輪替） */
const pathwayBgs = ['bg-brand-green', 'bg-[#578985]', 'bg-brand-primary', 'bg-brand-lime']

const ItemsPathway: React.FC<{ items: TwoColumnItem[] }> = ({ items }) => (
  <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
    {items.map((item, i) => (
      <div
        key={item.id ?? i}
        className={cn(
          'flex flex-col items-center gap-5 rounded-[30px] px-5 py-10 text-center text-white md:py-12',
          pathwayBgs[i % pathwayBgs.length],
          { 'md:mt-16': i % 2 === 1 },
        )}
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
          <ItemIcon item={item} index={i} size="h-12 w-12" />
        </span>
        <h3 className="text-xl font-bold tracking-[0.2em]">{item.title}</h3>
        {item.text && <p className="text-[13px] leading-[1.8] tracking-[0.05em] text-white/95">{item.text}</p>}
      </div>
    ))}
  </div>
)

const itemsComponents = {
  iconCards: ItemsIconCards,
  steps: ItemsSteps,
  pillars: ItemsPillars,
  grid: ItemsGrid,
  pathway: ItemsPathway,
} as const

/* ---------------------------------------------------------------- */
/* Block                                                              */
/* ---------------------------------------------------------------- */

export const TwoColumnBlock: React.FC<TwoColumnBlockProps> = ({
  direction,
  variant,
  background,
  eyebrow,
  image,
  title,
  richText,
  cta,
  items,
  itemsStyle,
}) => {
  const ItemsComponent = itemsComponents[itemsStyle ?? 'iconCards'] ?? ItemsIconCards
  const hasItems = Boolean(items && items.length > 0)

  const inner =
    variant === 'hero' ? (
      /* 大圖引言：大圖靠左 + 白色文字卡疊右下（care/training hero） */
      <div className="relative">
        <div
          className={cn('overflow-hidden rounded-[30px] md:w-[82%]', {
            'md:ml-auto': direction === 'imageRight',
          })}
        >
          <Media resource={image} imgClassName="aspect-[16/9] w-full object-cover" />
        </div>
        <div
          className={cn(
            'relative -mt-8 mx-4 rounded-[30px] bg-white px-7 py-6 shadow-[0_8px_30px_rgba(33,33,33,0.08)] md:absolute md:bottom-10 md:mx-0 md:mt-0 md:max-w-[46%] md:px-10 md:py-8',
            direction === 'imageRight' ? 'md:left-0' : 'md:right-0',
          )}
        >
          {eyebrow && <Eyebrow text={eyebrow} />}
          {title && (
            <h2 className="mb-3 text-xl font-bold leading-[1.7] tracking-[0.1em] text-[color:var(--page-accent,#8BA98B)]">
              {title}
            </h2>
          )}
          {richText && (
            <div className="text-[17px] font-medium leading-[2] tracking-[0.1em] text-brand-ink">
              <RichText data={richText} enableGutter={false} enableProse={false} />
            </div>
          )}
          {cta?.label && cta?.url && (
            <div className="mt-5">
              <PillCta label={cta.label} url={cta.url} />
            </div>
          )}
        </div>
      </div>
    ) : (
      /* 標準圖文二欄 */
      <>
        <div
          className={cn('flex flex-col gap-10 md:gap-16 lg:gap-20 md:items-center', {
            'md:flex-row': direction !== 'imageRight',
            'md:flex-row-reverse': direction === 'imageRight',
          })}
        >
          <div className="md:w-1/2">
            <div className="overflow-hidden rounded-[30px]">
              <Media resource={image} imgClassName="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
          <div className="md:w-1/2">
            {eyebrow && <Eyebrow text={eyebrow} />}
            {title && (
              <h2 className="mb-5 text-[26px] font-bold leading-[1.6] tracking-[0.15em] text-[color:var(--page-accent,#8BA98B)] md:text-4xl md:leading-[1.65]">
                {title}
              </h2>
            )}
            {richText && (
              <div className="text-base leading-[1.85] tracking-[0.1em] text-brand-ink [&_p+p]:mt-4">
                <RichText data={richText} enableGutter={false} enableProse={false} />
              </div>
            )}
            {cta?.label && cta?.url && (
              <div className="mt-8">
                <PillCta label={cta.label} url={cta.url} />
              </div>
            )}
          </div>
        </div>
        {hasItems && <ItemsComponent items={items as TwoColumnItem[]} />}
      </>
    )

  return (
    <section
      className={cn({ 'bg-brand-surface py-16 md:py-20': background === 'surface' })}
      data-block="twoColumn"
    >
      <div className="container max-w-[1240px]">{inner}</div>
      {variant === 'hero' && hasItems && (
        <div className="container max-w-[1240px]">
          <ItemsComponent items={items as TwoColumnItem[]} />
        </div>
      )}
    </section>
  )
}
