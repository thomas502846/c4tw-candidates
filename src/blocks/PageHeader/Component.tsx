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
 * 左側實綠面板 +「斜切造型」漸層切入右側照片；文字壓左側白字。
 * Tracy RWD 註記：淺色底路徑造型「方向與桌機不同」→ 桌機/手機用不同漸層角度＋綠面板比例
 * （桌機 100deg、綠覆蓋 ~40%；手機 82deg、綠覆蓋 ~52%，方向相反、覆蓋更大）。
 */
const GRAD = {
  sage: { solid: '#8BA98B', rgb: '139,169,139' },
  lime: { solid: '#ADCB59', rgb: '173,203,89' },
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
  const g = GRAD[gradient ?? 'sage'] ?? GRAD.sage
  const focalClass = FOCAL[focal ?? 'bottom'] ?? 'object-bottom'

  return (
    <section className="relative -mt-16 h-[216px] overflow-hidden md:h-[400px]" data-block="pageHeader">
      {hasImage ? (
        <>
          <Media
            resource={image}
            imgClassName={`absolute inset-0 h-full w-full object-cover ${focalClass}`}
            className="absolute inset-0"
          />
          {/* 手機（Figma 376:791）：綠面板覆蓋左 ~50%，右半照片清楚可見、近垂直柔邊 */}
          <div
            aria-hidden
            className="absolute inset-0 md:hidden"
            style={{
              background: `linear-gradient(85deg, ${g.solid} 0%, ${g.solid} 46%, rgba(${g.rgb},0.5) 62%, rgba(${g.rgb},0) 78%)`,
            }}
          />
          {/* 桌機：較小綠覆蓋、斜邊偏另一方向 */}
          <div
            aria-hidden
            className="absolute inset-0 hidden md:block"
            style={{
              background: `linear-gradient(100deg, ${g.solid} 0%, ${g.solid} 40%, rgba(${g.rgb},0.4) 62%, rgba(${g.rgb},0) 82%)`,
            }}
          />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0 bg-brand-green" />
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
