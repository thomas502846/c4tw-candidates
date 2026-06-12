import React from 'react'

import styles from './Component.module.css'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type NewsTickerBlockProps = {
  blockType: 'newsTicker'
  items?:
    | {
        text: string
        url?: string | null
        enabled?: boolean | null
        id?: string | null
      }[]
    | null
  locale?: 'zh-TW' | 'en'
}

export const NewsTickerBlock: React.FC<NewsTickerBlockProps> = ({ items, locale = 'zh-TW' }) => {
  const enabledItems = (items ?? []).filter((item) => item.enabled !== false)

  if (enabledItems.length === 0) return null

  // 無縫循環：同一份清單 render 兩次，CSS 位移 -50%
  const loop = [...enabledItems, ...enabledItems]
  const duration = Math.max(18, enabledItems.length * 12)

  return (
    <aside
      aria-label={locale === 'en' ? 'Latest news' : '最新消息'}
      className="-mt-16 flex h-[64px] w-full items-center gap-5 overflow-hidden bg-brand-surface md:h-[80px]"
      data-block="newsTicker"
    >
      {/* 左側固定 label（Figma：#DCD020 pill） */}
      <span className="ml-4 shrink-0 rounded-[30px] bg-brand-highlight px-5 py-1.5 text-[14px] font-medium tracking-[0.1em] whitespace-nowrap text-brand-ink md:ml-12">
        {locale === 'en' ? 'NEWS' : '最新消息'}
      </span>

      <div className="relative flex-1 overflow-hidden">
        <div
          className={styles.track}
          style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
        >
          {loop.map((item, i) => (
            <span
              aria-hidden={i >= enabledItems.length}
              className="flex shrink-0 items-center text-[15px] tracking-[0.1em] whitespace-nowrap text-brand-ink md:text-[16px]"
              key={`${item.id ?? i}-${i}`}
            >
              {item.url ? (
                <a className="transition-colors hover:text-brand-primary" href={item.url}>
                  {item.text}
                </a>
              ) : (
                item.text
              )}
              <span aria-hidden className="px-6 text-brand-primary">
                ・
              </span>
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
