import React from 'react'

/**
 * 內頁 Banner（Figma symbol 30:136，1440×400）
 * Care / Training / School 三頁專屬：底圖照片 + 左實右透漸層 + 白字標題。
 *
 * ⚠️ 文案與照片目前 hardcode（seed 尚無 banner 欄位）；
 *    待 banner 進 CMS 後改读 page 資料。Contact / About 由其他工作流接手。
 */

export type InnerBannerConfig = {
  /** 標題（zh / en 各自分行） */
  title: { 'zh-TW': string[]; en: string[] }
  /** 英文副標（H4 19 Medium） */
  subtitle: string
  /** 底圖（public/ 路徑） */
  photo: string
  /** 漸層底色（左側實色） */
  base: string
  /** 三頁專屬重點色（CSS var --page-accent，可選） */
  accent?: string
}

export const innerPageBanners: Record<string, InnerBannerConfig> = {
  care: {
    title: { 'zh-TW': ['AIO解決方案', '—家庭照顧服務'], en: ['AIO Solutions', '— Family Care Services'] },
    subtitle: 'AIO Solutions－Family Care Services',
    photo: '/banners/banner-care.jpg',
    base: '#ADCB59',
  },
  training: {
    title: { 'zh-TW': ['AIO解決方案', '—組織培力'], en: ['AIO Solutions', '— Organization Support'] },
    subtitle: 'AIO Solutions－Organization Support',
    photo: '/banners/banner-training.jpg',
    base: '#ADCB59',
  },
  school: {
    title: { 'zh-TW': ['關於照顧學校'], en: ['About the Care School'] },
    subtitle: 'ABOUT Care For Taiwan（CFT）',
    photo: '/banners/banner-school.jpg',
    base: '#8BA98B',
  },
}

export const InnerPageBanner: React.FC<{
  slug: string
  locale?: 'zh-TW' | 'en'
}> = ({ slug, locale = 'zh-TW' }) => {
  const config = innerPageBanners[slug]
  if (!config) return null

  const titleLines = config.title[locale] ?? config.title['zh-TW']

  return (
    <section className="relative h-[260px] w-full overflow-hidden md:h-[400px]" data-banner={slug}>
      {/* 底圖照片（右側可見） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.photo}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[70%_35%]"
        loading="eager"
      />
      {/* 左實右透漸層（master：51.9% 實色 → 71.6% 透） */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${config.base} 46%, ${config.base}b3 58%, ${config.base}00 76%)`,
        }}
      />
      <div className="relative z-10 mx-auto flex h-full max-w-[1240px] flex-col justify-center px-6 md:px-[50px]">
        <h1 className="text-[26px] font-bold leading-[1.5] tracking-[0.1em] text-white md:text-[40px]">
          {titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h1>
        {locale !== 'en' && (
          <p className="mt-3 text-sm font-medium tracking-[0.1em] text-white/95 md:text-[19px]">
            {config.subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
