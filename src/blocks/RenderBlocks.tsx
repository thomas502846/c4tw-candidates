import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { ArticleCardsBlock } from '@/blocks/ArticleCards/Component'
import { AwardsBlock } from '@/blocks/Awards/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { CtaBannerBlock } from '@/blocks/CtaBanner/Component'
import { HeroBlock } from '@/blocks/Hero/Component'
import { IconFeaturesBlock } from '@/blocks/IconFeatures/Component'
import { InfographicBlock } from '@/blocks/Infographic/Component'
import { LogoWallBlock } from '@/blocks/LogoWall/Component'
import { MapLocationsBlock } from '@/blocks/MapLocations/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MissionCirclesBlock } from '@/blocks/MissionCircles/Component'
import { NewsTickerBlock } from '@/blocks/NewsTicker/Component'
import { NumberedFeaturesBlock } from '@/blocks/NumberedFeatures/Component'
import { PageHeaderBlock } from '@/blocks/PageHeader/Component'
import { PhotoStripBlock } from '@/blocks/PhotoStrip/Component'
import { PillarCardsBlock } from '@/blocks/PillarCards/Component'
import { QuoteBlock } from '@/blocks/Quote/Component'
import { StatsCardsBlock } from '@/blocks/StatsCards/Component'
import { StepsBlockBlock } from '@/blocks/StepsBlock/Component'
import { TabsBlockBlock } from '@/blocks/TabsBlock/Component'
import { TaCtaBlock } from '@/blocks/TaCta/Component'
import { TimelineBlock } from '@/blocks/Timeline/Component'
import { TwoColumnBlock } from '@/blocks/TwoColumn/Component'
import { VideoBlockBlock } from '@/blocks/VideoBlock/Component'

export type Locale = 'zh-TW' | 'en'

// 區塊錨點 id：由 block.title 推導，供頁內導流連結（如 care「我是企業HR」→ #企業EAP方案）對位。
// 規則＝去頭尾空白、空白轉連字號。ZH 標題（無空白）原樣保留＝`企業EAP方案`；
// EN 標題轉連字號＝`Corporate EAP Program` → `Corporate-EAP-Program`，與 seed 的 href 片段一致。
const anchorIdFromTitle = (title: unknown): string | undefined => {
  if (typeof title !== 'string') return undefined
  const trimmed = title.trim()
  if (!trimmed) return undefined
  return trimmed.replace(/\s+/g, '-')
}

// 滿版帶狀區塊（Figma 各 band 上下相接、留白由區塊內部 padding 控制）→ 不加 my-16 外距
const fullBleedBlocks = new Set([
  'hero',
  'newsTicker',
  'pageHeader',
  'numberedFeatures',
  'taCta',
  'videoBlock',
  'missionCircles',
  'photoStrip',
])

// 部分區塊「依 variant」才是滿版米色帶（school：infographic ring 我們看見的問題 ＋ iconFeatures roles 學員樣貌
// 在 Figma 共用同一條 problem-bg 米色帶）→ 去 my-16 讓上下兩帶相接、不留白縫。
const isFullBleed = (block: { blockType?: string; variant?: unknown }): boolean => {
  const { blockType, variant } = block
  if (blockType && fullBleedBlocks.has(blockType)) return true
  if (blockType === 'infographic' && variant === 'ring') return true
  if (blockType === 'iconFeatures' && variant === 'roles') return true
  return false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<string, React.ComponentType<any>> = {
  archive: ArchiveBlock,
  articleCards: ArticleCardsBlock,
  awards: AwardsBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  ctaBanner: CtaBannerBlock,
  hero: HeroBlock,
  iconFeatures: IconFeaturesBlock,
  infographic: InfographicBlock,
  logoWall: LogoWallBlock,
  mapLocations: MapLocationsBlock,
  mediaBlock: MediaBlock,
  missionCircles: MissionCirclesBlock,
  newsTicker: NewsTickerBlock,
  numberedFeatures: NumberedFeaturesBlock,
  pageHeader: PageHeaderBlock,
  photoStrip: PhotoStripBlock,
  pillarCards: PillarCardsBlock,
  quote: QuoteBlock,
  statsCards: StatsCardsBlock,
  stepsBlock: StepsBlockBlock,
  tabsBlock: TabsBlockBlock,
  taCta: TaCtaBlock,
  timeline: TimelineBlock,
  twoColumn: TwoColumnBlock,
  videoBlock: VideoBlockBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale?: Locale
}> = (props) => {
  const { blocks, locale = 'zh-TW' } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          // 區塊顯示開關：客戶在 CMS 取消勾選「在網站上顯示此區塊」即隱藏（內容仍保留）。
          // 用 === false 判斷，舊資料（無此欄位）預設仍顯示。
          if ((block as { enabled?: boolean }).enabled === false) {
            return null
          }

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // anchorId：頁內導流（TaCta 雙按鈕等）以 #title 捲動到對應區塊；scroll-mt 補 sticky header 高
              const anchorId = anchorIdFromTitle((block as { title?: unknown }).title)
              return (
                <div
                  className={
                    isFullBleed(block as { blockType?: string; variant?: unknown })
                      ? anchorId
                        ? 'scroll-mt-[88px] lg:scroll-mt-[120px]'
                        : undefined
                      : `my-16${anchorId ? ' scroll-mt-[88px] lg:scroll-mt-[120px]' : ''}`
                  }
                  id={anchorId}
                  key={index}
                >
                  <Block {...block} locale={locale} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
