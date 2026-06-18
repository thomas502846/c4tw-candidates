import React from 'react'

import { FramedImage } from '@/components/Media/FramedImage'
import { focalToTier } from '@/utilities/framePositionCss'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type PageHeaderBlockProps = {
  blockType: 'pageHeader'
  id?: string | null
  title: string
  eyebrow?: string | null
  image?: MediaDoc | string | number | null
  // Figma：About 用灰綠 #8BA98B；Care／Training 用亮綠 #ADCB59
  gradient?: 'sage' | 'lime' | null
  // 每裝置（手機／平板／電腦）焦點＋縮放；未設定時沿用下方舊版 focal
  framePos?: unknown
  // 舊版照片裁切位置（fallback）：重點（臉部）在上半部時用 top
  focal?: 'top' | 'center' | 'bottom' | null
}

/**
 * 內頁頁首 Banner（Figma master 30:136，1440×400）
 * 滿版照片 + 左→右綠面板漸層融入照片；文字壓左側白字。
 * Figma 漸層（to right）：實綠 0→51.9% → rgba(255,255,255,0.5) 71.6%（右側照片帶淡白霧、非透明）。
 * 照片維持滿版 object-cover（不收窄成右側窄欄，避免人物被擠壓變形）。
 * 手機綠面板覆蓋更大（窄螢幕照片偏右）；桌機覆蓋約一半。
 */
const GRAD = {
  sage: '#8BA98B',
  lime: '#ADCB59',
}
export const PageHeaderBlock: React.FC<PageHeaderBlockProps> = ({
  id,
  title,
  eyebrow,
  image,
  gradient,
  framePos,
  focal,
}) => {
  const hasImage = image && typeof image === 'object'
  const solid = GRAD[gradient ?? 'sage'] ?? GRAD.sage
  // 未設定每裝置位置時，三個裝置都沿用舊版 focal（center 人物多在照片中段，top 臉部偏上）。
  const fallbackTier = focalToTier(focal)
  const fallback = { mobile: fallbackTier, tablet: fallbackTier, desktop: fallbackTier }

  return (
    // 桌機把 banner 上緣收進 header 後（-mt-16）；手機 banner 較矮、標題靠上，
    // 故手機不上推，避免標題被 sticky header 蓋住裁切。
    <section
      className="relative h-[216px] overflow-hidden md:-mt-16 md:h-[400px]"
      data-block="pageHeader"
    >
      {hasImage ? (
        <>
          {/* 滿版照片，每裝置焦點＋縮放由 CMS 拖曳控制（fallback 舊版 focal） */}
          <FramedImage
            id={id ?? title}
            resource={image}
            framePos={framePos}
            defaults={fallback}
            className="absolute inset-0"
          />
          {/* 手機：綠面板覆蓋更大（左 ~50%），右側照片仍清楚可見 */}
          <div
            aria-hidden
            className="absolute inset-0 md:hidden"
            style={{
              background: `linear-gradient(to right, ${solid} 0%, ${solid} 50%, rgba(255,255,255,0.5) 78%)`,
            }}
          />
          {/* 桌機：對齊 Figma 30:136 漸層停點 */}
          <div
            aria-hidden
            className="absolute inset-0 hidden md:block"
            style={{
              background: `linear-gradient(to right, ${solid} 0%, ${solid} 51.9%, rgba(255,255,255,0.5) 71.6%)`,
            }}
          />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0" style={{ backgroundColor: solid }} />
      )}
      {/* 文字上下置中（Tracy 指定 banner 標題真正垂直置中） */}
      <div className="container relative flex h-full max-w-[1140px] flex-col justify-center gap-3.5">
        <h1 className="text-[32px] font-bold tracking-[0.1em] text-white md:text-[40px]">{title}</h1>
        {eyebrow && (
          <p className="text-[17px] font-medium uppercase tracking-[0.1em] text-white md:text-[19px]">
            {eyebrow}
          </p>
        )}
      </div>
    </section>
  )
}
