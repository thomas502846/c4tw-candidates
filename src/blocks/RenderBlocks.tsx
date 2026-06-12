import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { ArticleCardsBlock } from '@/blocks/ArticleCards/Component'
import { AwardsBlock } from '@/blocks/Awards/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { CtaBannerBlock } from '@/blocks/CtaBanner/Component'
import { HeroBlock } from '@/blocks/Hero/Component'
import { LogoWallBlock } from '@/blocks/LogoWall/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { NewsTickerBlock } from '@/blocks/NewsTicker/Component'
import { QuoteBlock } from '@/blocks/Quote/Component'
import { StatsCardsBlock } from '@/blocks/StatsCards/Component'
import { TimelineBlock } from '@/blocks/Timeline/Component'
import { TwoColumnBlock } from '@/blocks/TwoColumn/Component'

export type Locale = 'zh-TW' | 'en'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<string, React.ComponentType<any>> = {
  archive: ArchiveBlock,
  articleCards: ArticleCardsBlock,
  awards: AwardsBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  ctaBanner: CtaBannerBlock,
  hero: HeroBlock,
  logoWall: LogoWallBlock,
  mediaBlock: MediaBlock,
  newsTicker: NewsTickerBlock,
  quote: QuoteBlock,
  statsCards: StatsCardsBlock,
  timeline: TimelineBlock,
  twoColumn: TwoColumnBlock,
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

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
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
