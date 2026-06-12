import React from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type PageHeaderBlockProps = {
  blockType: 'pageHeader'
  title: string
  eyebrow?: string | null
  image?: MediaDoc | string | number | null
}

/**
 * 內頁頁首 Banner（Figma master 30:136，1440×400）
 * 底圖照片 object-bottom 滿版 + 左實右透漸層（#8BA98B 52% → 透明 72%），文字壓左側
 */
export const PageHeaderBlock: React.FC<PageHeaderBlockProps> = ({ title, eyebrow, image }) => {
  const hasImage = image && typeof image === 'object'

  return (
    <section className="relative -mt-16 h-[260px] overflow-hidden md:h-[400px]" data-block="pageHeader">
      {hasImage ? (
        <>
          <Media
            resource={image}
            imgClassName="absolute inset-0 h-full w-full object-cover object-bottom"
            className="absolute inset-0"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, #8BA98B 51.9%, rgba(139,169,139,0.35) 71.6%, rgba(255,255,255,0.15) 100%)',
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
