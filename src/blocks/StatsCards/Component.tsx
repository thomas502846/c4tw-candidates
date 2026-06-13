import React from 'react'

import ScrollReveal from '@/components/ScrollReveal'

import { StatsCardsClient } from './Component.client'

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
// 數字 Count Up 動態（Tracy node 27:61：進入視窗後播放、約 1.5s、ease-out）
export const StatsCardsBlock: React.FC<StatsCardsBlockProps> = ({ cards }) => {
  if (!cards || cards.length === 0) return null

  return (
    // 數據區塊進場 Fade In（Tracy node 27:61）；數字 Count Up 由 client 處理
    <ScrollReveal as="section" className="container" data-block="statsCards">
      <StatsCardsClient cards={cards} />
    </ScrollReveal>
  )
}
