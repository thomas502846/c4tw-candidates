import React from 'react'

import { Breadcrumb, type Crumb } from './Breadcrumb'

/**
 * 部落格頁首 Banner（Archive / Category / Single 共用）：灰綠底、白字，
 * eyebrow（英文小標）＋標題＋麵包屑。對齊 pageHeader 視覺語言。
 */
export const BlogBanner: React.FC<{
  title: string
  eyebrow?: string
  breadcrumb: Crumb[]
  subtitle?: string
}> = ({ title, eyebrow, breadcrumb, subtitle }) => (
  <section
    className="relative flex min-h-[216px] flex-col justify-center overflow-hidden bg-brand-green py-14 md:-mt-16 md:min-h-[360px] md:py-20"
    data-block="blogBanner"
  >
    {/* 微弧形/漸層點綴，避免大面積純色單調 */}
    <div
      aria-hidden
      className="absolute inset-0"
      style={{ background: 'linear-gradient(120deg, #8ba98b 0%, #9ca87f 60%, #adcb59 130%)' }}
    />
    <div className="container relative flex max-w-[1140px] flex-col gap-3.5 pt-6 md:pt-2">
      {eyebrow && (
        <p className="order-2 text-[15px] font-medium uppercase tracking-[0.2em] text-white/90 md:text-[17px]">
          {eyebrow}
        </p>
      )}
      <h1 className="order-1 text-[30px] font-bold tracking-[0.1em] text-white md:text-[42px]">
        {title}
      </h1>
      {subtitle && (
        <p className="order-3 max-w-[720px] text-[15px] leading-[1.8] tracking-[0.08em] text-white/90 md:text-[16px]">
          {subtitle}
        </p>
      )}
      <div className="order-4 mt-2">
        <Breadcrumb items={breadcrumb} />
      </div>
    </div>
  </section>
)
