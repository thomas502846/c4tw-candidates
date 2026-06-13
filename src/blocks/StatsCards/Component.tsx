import React from 'react'

import ScrollReveal from '@/components/ScrollReveal'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type StatsCardsBlockProps = {
  blockType: 'statsCards'
  cards?:
    | {
        number: string
        label: string
        suffix?: string | null
        id?: string | null
      }[]
    | null
}

// Figma About impact 數據列：白底無框、數字大字灰綠、下方 ink 標籤
export const StatsCardsBlock: React.FC<StatsCardsBlockProps> = ({ cards }) => {
  if (!cards || cards.length === 0) return null

  return (
    // 數據區塊進場 Fade In（Tracy node 27:61；Count Up 動態數字另列待辦，本輪先進場淡入）
    <ScrollReveal as="section" className="container" data-block="statsCards">
      <div className="mx-auto grid max-w-[1011px] grid-cols-2 gap-x-6 gap-y-10 py-6 md:grid-cols-4">
        {cards.map((card, i) => (
          <div className="text-center" key={card.id ?? i}>
            <p className="font-mono text-[32px] font-bold tracking-[0.08em] text-brand-green md:text-[40px]">
              {card.number}
              {card.suffix && (
                <span className="ml-1 align-baseline text-[18px] font-bold md:text-[22px]">
                  {card.suffix}
                </span>
              )}
            </p>
            <p className="mt-2 text-[15px] tracking-[0.1em] text-brand-ink md:text-[16px]">
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </ScrollReveal>
  )
}
