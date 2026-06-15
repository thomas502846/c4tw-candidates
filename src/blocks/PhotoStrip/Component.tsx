import React from 'react'

import HoverZoomImage from '@/components/HoverZoomImage'
import ScrollReveal from '@/components/ScrollReveal'
import Parallax from '@/components/Parallax'
import type { Media as MediaDoc } from '@/payload-types'

import { StripArrows } from './StripArrows.client'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type PhotoStripImage = { image?: MediaDoc | string | number | null; id?: string | null }

export type PhotoStripBlockProps = {
  blockType: 'photoStrip'
  parallax?: boolean | null
  images?: PhotoStripImage[] | null
}

/**
 * photoStrip（Figma photowall 85:287 / care 263:431，1620 寬出血、5 格各 360×266）——
 * 滿版照片橫帶。桌機等分排列、無間隙、左右微出血；照片 Hover 放大、區塊進場 Fade In。
 * parallax=true（care 263:431）：整帶比視窗略寬，捲動時橫向緩動視差。
 */
export const PhotoStripBlock: React.FC<PhotoStripBlockProps> = ({ images, parallax }) => {
  const list = (images ?? []).filter((p) => p.image && typeof p.image === 'object')
  if (list.length === 0) return null

  const cells = list.map((photo, i) => (
    <div
      className="aspect-[360/266] w-[70%] shrink-0 sm:w-[40%] md:w-0 md:flex-1"
      key={photo.id ?? i}
    >
      <HoverZoomImage
        resource={photo.image as MediaDoc}
        imgClassName="h-full w-full object-cover"
        wrapperClassName="h-full w-full"
      />
    </div>
  ))

  return (
    // 滿版出血：脫離 container，撐到視窗寬
    <ScrollReveal
      as="section"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden"
      data-block="photoStrip"
    >
      {/* 行動版／平板：可滑動帶＋左右箭頭（Tracy 341:669）；lg+ 桌機照片全展開、箭頭自動隱藏 */}
      <StripArrows>
        {parallax ? (
          // 桌機：橫向視差出血（帶寬 112%，緩慢橫移）；行動版：關視差、改可橫向滑動帶，
          // 讓 5 張照片都滑得到（否則第 3–5 張被 overflow-hidden 裁掉且無法觸及）。
          <Parallax
            axis="x"
            speed={0.12}
            maxOffset={90}
            desktopOnly
            className="flex overflow-x-auto lg:w-[112%] lg:overflow-x-visible"
            data-photostrip-scroll
          >
            {cells}
          </Parallax>
        ) : (
          // 桌機：等分多格無間隙；行動版：橫向捲動
          <div className="flex overflow-x-auto md:overflow-hidden" data-photostrip-scroll>
            {cells}
          </div>
        )}
      </StripArrows>
    </ScrollReveal>
  )
}

export default PhotoStripBlock
