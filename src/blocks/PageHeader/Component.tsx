import React from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type PageHeaderBlockProps = {
  blockType: 'pageHeader'
  title: string
  eyebrow?: string | null
  image?: MediaDoc | string | number | null
  // Figma：About 用灰綠 #8BA98B；Care／Training 用亮綠 #ADCB59
  gradient?: 'sage' | 'lime' | null
  // 照片裁切位置：重點（臉部）在上半部時用 top（如 care-banner 人物在上方）
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
const FOCAL = { top: 'object-top', center: 'object-center', bottom: 'object-bottom' }
export const PageHeaderBlock: React.FC<PageHeaderBlockProps> = ({
  title,
  eyebrow,
  image,
  gradient,
  focal,
}) => {
  const hasImage = image && typeof image === 'object'
  const solid = GRAD[gradient ?? 'sage'] ?? GRAD.sage
  // 滿版照片下預設 center（人物多在照片中段）；臉部偏上的照片才在 CMS 改「對齊上方」。
  const focalClass = FOCAL[focal ?? 'center'] ?? 'object-center'

  return (
    // 桌機把 banner 上緣收進 header 後（-mt-16）；手機 banner 較矮、標題靠上，
    // 故手機不上推，避免標題被 sticky header 蓋住裁切。
    <section
      className="relative h-[216px] overflow-hidden md:-mt-16 md:h-[400px]"
      data-block="pageHeader"
    >
      {hasImage ? (
        <>
          {/* 滿版照片（Figma 30:136：size-full object-bottom），不收窄、不變形 */}
          <Media
            resource={image}
            imgClassName={`absolute inset-0 h-full w-full max-w-none object-cover ${focalClass}`}
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
      {/* 文字垂直略偏上（Figma 約 38% 高度處）→ 以 pb 把置中點上推 */}
      <div className="container relative flex h-full max-w-[1240px] flex-col justify-center gap-3.5 pb-8 md:pb-20">
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
