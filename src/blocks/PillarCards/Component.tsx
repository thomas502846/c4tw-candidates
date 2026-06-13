import React from 'react'

import { Media } from '@/components/Media'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

import { MAP_ICONS } from './icons'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type PillarCard = {
  tag?: string | null
  icon?: MediaDoc | string | number | null
  titleMain: string
  titleSub?: string | null
  text?: string | null
  id?: string | null
}

export type PillarCardsBlockProps = {
  blockType: 'pillarCards'
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  intro?: string | null
  cards?: PillarCard[] | null
}

// School 四柱取色（304:605）：#8BA98B / #ADCB59 / #9C9F33 / #DCD020
const pillarBgs = ['bg-brand-green', 'bg-brand-lime', 'bg-brand-primary', 'bg-brand-highlight']

const Eyebrow: React.FC<{ text: string }> = ({ text }) => (
  <p className="mb-4 flex items-center gap-2.5 text-base tracking-[0.1em] text-brand-muted">
    <span aria-hidden className="inline-block h-[15px] w-[15px] shrink-0 rounded-full bg-brand-highlight" />
    {text}
  </p>
)

/**
 * School 人才培育系統（class 304:605）：頭部兩欄（左眉標+H1+粗體副標、右導言）＋
 * 4 直卡 264×444 高低交錯（偶數卡下移），卡後淡米色蛇形連接路徑
 */
export const PillarCardsBlock: React.FC<PillarCardsBlockProps> = ({
  eyebrow,
  title,
  subtitle,
  intro,
  cards,
}) => {
  if (!cards || cards.length === 0) return null

  return (
    <section className="container max-w-[1240px]" data-block="pillarCards">
      {/* 頭部兩欄 */}
      {(title || intro) && (
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="md:w-[52%]">
            {eyebrow && <Eyebrow text={eyebrow} />}
            {title && (
              <h2 className="text-[26px] font-bold tracking-[0.15em] text-brand-green md:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-lg font-bold tracking-[0.1em] text-brand-ink md:text-[22px]">
                {subtitle}
              </p>
            )}
          </div>
          {intro && (
            <p className="whitespace-pre-line text-base leading-[1.85] tracking-[0.1em] text-brand-ink md:w-[41%]">
              {intro}
            </p>
          )}
        </div>
      )}

      {/* 卡片區（蛇形路徑墊底） */}
      <div className="relative">
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1140 658"
        >
          {/* 淡米色粗折線蛇形路徑（Vector 2）：直角圓弧轉折串連四卡、z-index 在卡下 */}
          <path
            d="M132 180 V476 Q132 512 168 512 H388 Q424 512 424 476 V266 Q424 230 460 230 H680 Q716 230 716 266 V476 Q716 512 752 512 H1008"
            stroke="#F0EFDC"
            strokeLinecap="round"
            strokeWidth="56"
          />
        </svg>
        <div className="relative grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">
          {cards.slice(0, 4).map((card, i) => (
            // 卡片進場 Fade UP（Tracy node 97:564：卡片用 Fade UP、0→100%、0.6s）；四卡錯開 delay
            <ScrollReveal
              as="div"
              className={cn(
                'flex flex-col items-center gap-5 self-start rounded-[30px] px-5 py-9 text-center md:min-h-[444px]',
                pillarBgs[i % pillarBgs.length],
                { 'md:mt-[214px]': i % 2 === 1 },
              )}
              delay={i * 0.12}
              key={card.id ?? i}
              variant="up"
            >
              {card.tag && (
                <span className="rounded-[30px] border border-white bg-white px-4 py-1 text-sm font-medium tracking-[0.05em] text-brand-ink">
                  {card.tag}
                </span>
              )}
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white md:h-24 md:w-24">
                {card.icon && typeof card.icon === 'object' ? (
                  <span className="block h-12 w-12 md:h-14 md:w-14">
                    <Media resource={card.icon} imgClassName="h-full w-full object-contain" />
                  </span>
                ) : (
                  (() => {
                    const FallbackIcon = MAP_ICONS[i % MAP_ICONS.length]
                    return <FallbackIcon className="h-12 w-12 md:h-14 md:w-14" />
                  })()
                )}
              </span>
              <p className="text-white">
                <span className="text-[26px] font-bold tracking-[0.15em] md:text-[32px]">
                  {card.titleMain}
                </span>
                {card.titleSub && (
                  <span className="ml-1 text-base font-bold tracking-[0.1em]">{card.titleSub}</span>
                )}
              </p>
              {card.text && (
                <p className="text-sm leading-[1.7] tracking-[0.03em] text-white/95">{card.text}</p>
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
