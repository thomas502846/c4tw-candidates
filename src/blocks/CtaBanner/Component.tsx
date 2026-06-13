import React from 'react'

import { cn } from '@/utilities/ui'
import { normalizeCtaHref } from '@/utilities/normalizeCtaHref'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type CtaBannerBlockProps = {
  blockType: 'ctaBanner'
  title: string
  subtitle?: string | null
  cta?: { label?: string | null; url?: string | null } | null
  background?: 'primary' | 'secondary' | 'muted' | 'dark' | null
}

// Figma 三綠輪替卡底：primary=果綠 9C9F33、secondary=灰綠 8BA98B、muted=暖米底、dark=亮綠 ADCB59（品牌不出深黑大面）
const cardClasses: Record<string, string> = {
  primary: 'bg-brand-primary text-white',
  secondary: 'bg-brand-green text-white',
  muted: 'bg-brand-surface text-brand-ink',
  dark: 'bg-brand-lime text-white',
}

const ArrowRight: React.FC = () => (
  <svg
    aria-hidden
    className="h-[18px] w-[18px] shrink-0 transition-transform group-hover:translate-x-1"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

export const CtaBannerBlock: React.FC<CtaBannerBlockProps> = ({
  title,
  subtitle,
  cta,
  background,
}) => {
  const bg = background ?? 'primary'
  // 指向聯絡頁的 CTA 在渲染層補 #sheet（不依賴 CMS DB，staging 直接生效）
  const ctaUrl = normalizeCtaHref(cta?.url)

  return (
    <section className="container" data-block="ctaBanner">
      <div className="relative">
        {/* 左上裝飾色塊 #DCD020（Tracy 6/11 定稿） */}
        <div
          aria-hidden
          className="absolute -left-2.5 -top-2.5 h-20 w-20 rounded-[26px] bg-brand-highlight md:-left-3 md:-top-3 md:h-24 md:w-24"
        />
        <div
          className={cn(
            'relative rounded-[30px] px-7 py-12 text-center md:px-16 md:py-16',
            cardClasses[bg],
          )}
        >
          <h2 className="text-[22px] font-bold leading-[1.6] tracking-[0.12em] md:text-[30px]">
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(
                'mx-auto mt-4 max-w-[40rem] text-[15px] leading-[1.9] tracking-[0.1em] md:text-[16px]',
                bg === 'muted' ? 'text-brand-ink/80' : 'text-white/90',
              )}
            >
              {subtitle}
            </p>
          )}
          {cta?.label && ctaUrl && (
            <a
              className={cn(
                'group mt-8 inline-flex items-center gap-2.5 rounded-[30px] px-8 py-2.5 text-[16px] font-medium tracking-[0.1em] shadow-sm transition-colors md:text-[19px]',
                // Tracy 定稿：CTA 按鈕白底 #FFFFFF、字 #212121
                bg === 'muted'
                  ? 'bg-brand-lime text-white hover:bg-brand-primary'
                  : 'bg-white text-brand-ink hover:bg-brand-surface',
              )}
              href={ctaUrl}
            >
              {cta.label}
              <ArrowRight />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
