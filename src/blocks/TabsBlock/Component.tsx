'use client'

import React, { useState } from 'react'

import HoverZoomImage from '@/components/HoverZoomImage'
import { Media } from '@/components/Media'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

import { MAP_ICONS } from '@/blocks/PillarCards/icons'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type TabItem = {
  label: string
  image?: MediaDoc | string | number | null
  pills?: { text: string; id?: string | null }[] | null
  heading?: string | null
  subheading?: string | null
  body?: string | null
  featuresLabel?: string | null
  features?: { title: string; text?: string | null; id?: string | null }[] | null
  id?: string | null
}

export type TabsBlockProps = {
  blockType: 'tabsBlock'
  title?: string | null
  intro?: string | null
  tabs?: TabItem[] | null
}

/**
 * School 課程地圖 tabs（Frame 177 317:622）：
 * 4 顆等寬上圓角 tab（active bg #F7F7EB 綠字、inactive bg #8BA98B 白字）＋
 * 面板（bg #F7F7EB 下圓角）：大圖 → #9C9F33 pill 標籤列 → 標題 → 橄欖綠小標 →
 * 內文 → 分隔線 →「學習特色」→ 4 組（綠標題＋說明，組間細線）
 */
export const TabsBlockBlock: React.FC<TabsBlockProps> = ({ title, intro, tabs }) => {
  const [active, setActive] = useState(0)
  const list = tabs ?? []
  if (list.length === 0) return null
  const current = list[Math.min(active, list.length - 1)]

  return (
    <section className="container max-w-[1240px]" data-block="tabsBlock">
      {title && (
        // .fig 從學習到實踐…：Noto Sans TC Bold 40 / lh60 / ls10%
        <h2 className="text-center text-[24px] font-bold leading-[1.5] tracking-[0.1em] text-brand-green md:text-[40px] md:leading-[60px]">
          {title}
        </h2>
      )}
      {title && <hr className="mx-auto mt-6 border-brand-green/30" />}
      {intro && (
        // .fig 無論是剛接觸…：Noto Sans TC Medium 22 / lh35 / ls10%
        <p className="mt-6 whitespace-pre-line text-center text-[18px] font-medium leading-[1.6] tracking-[0.1em] text-brand-ink md:text-[22px] md:leading-[35px]">
          {intro}
        </p>
      )}

      {/* tab 列 — 分頁進場 Fade UP（Tracy node 97:564：分頁用 Fade UP、0→100%、0.6s） */}
      <ScrollReveal
        as="div"
        className="mt-12 grid grid-cols-2 gap-1 md:grid-cols-4"
        role="tablist"
        variant="up"
      >
        {list.map((tab, i) => (
          <button
            aria-selected={i === active}
            className={cn(
              'rounded-t-[20px] px-4 py-4 text-[17px] font-medium tracking-[0.1em] transition-colors md:text-[19px]',
              i === active
                ? 'bg-brand-surface text-brand-green'
                : 'bg-brand-green text-white hover:bg-brand-green/90',
            )}
            key={tab.id ?? i}
            onClick={() => setActive(i)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </ScrollReveal>

      {/* 面板 */}
      <div className="rounded-b-[30px] bg-brand-surface px-6 py-8 md:px-8 md:py-8" role="tabpanel">
        {/* 圖文卡照片 Hover 放大 110%（Tracy：圖文卡照片，自帶 group） */}
        {current.image && typeof current.image === 'object' ? (
          <HoverZoomImage wrapperClassName="rounded-[20px] bg-[#D9D9D9]">
            <Media resource={current.image} imgClassName="w-full object-cover" />
          </HoverZoomImage>
        ) : (
          <div className="overflow-hidden rounded-[20px] bg-[#D9D9D9]">
            <div className="aspect-[1075/590] w-full" />
          </div>
        )}

        {current.pills && current.pills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {current.pills.map((pill, i) => (
              <span
                className="rounded-[30px] bg-brand-primary px-5 py-1.5 text-sm font-medium tracking-[0.1em] text-white"
                key={pill.id ?? i}
              >
                {pill.text}
              </span>
            ))}
          </div>
        )}

        {current.heading && (
          <div className="mt-6 flex items-center gap-3.5">
            {/* 線稿 icon：依 tab index 對應四大地圖 fallback icon（書／房+心／證書／披風人物） */}
            {(() => {
              const TabIcon = MAP_ICONS[Math.min(active, list.length - 1) % MAP_ICONS.length]
              return <TabIcon className="h-10 w-10 shrink-0 md:h-11 md:w-11" />
            })()}
            {/* .fig 課程地圖（面板標題）：Noto Sans TC Bold 36 / lh60 / ls15% */}
            <h3 className="text-2xl font-bold leading-[1.4] tracking-[0.15em] text-brand-ink md:text-[36px] md:leading-[60px]">
              {current.heading}
            </h3>
          </div>
        )}
        {current.subheading && (
          // .fig 建立照顧知識…（面板小標）：Noto Sans TC Medium 22 / lh35 / ls10%
          <p className="mt-3 text-lg font-medium leading-[35px] tracking-[0.1em] text-brand-primary md:text-[22px]">
            {current.subheading}
          </p>
        )}
        {current.body && (
          <p className="mt-3 whitespace-pre-line text-base leading-[1.85] tracking-[0.1em] text-brand-ink">
            {current.body}
          </p>
        )}

        {current.features && current.features.length > 0 && (
          <>
            <hr className="mt-8 border-brand-green/25" />
            {current.featuresLabel && (
              <p className="mt-6 text-base font-bold tracking-[0.1em] text-brand-ink">
                {current.featuresLabel}
              </p>
            )}
            {/* Figma：每組特色帶左側細綠豎線（無組間橫線） */}
            <div className="mt-5 space-y-7">
              {current.features.map((feature, i) => (
                <div className="border-l-2 border-brand-lime pl-6" key={feature.id ?? i}>
                  <h4 className="text-base font-bold tracking-[0.1em] text-brand-primary">
                    {feature.title}
                  </h4>
                  {feature.text && (
                    <p className="mt-2 text-base leading-[1.85] tracking-[0.05em] text-brand-ink">
                      {feature.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile-only 次要地圖快速切換（cmt-09/cmt-10）：除 active 外其餘 tab 以堆疊綠按鈕呈現，
          底下置中提示字「↑ 點擊地圖查看課程特色 ↑」；此整段於 Desktop 隱藏 */}
      {list.length > 1 && (
        <div className="md:hidden">
          <div className="-space-y-2 pt-2">
            {list.map((tab, i) =>
              i === active ? null : (
                <button
                  className="block w-full rounded-b-[20px] bg-brand-green px-4 py-4 text-center text-[17px] font-medium tracking-[0.1em] text-white transition-colors hover:bg-brand-green/90"
                  key={tab.id ?? i}
                  onClick={() => setActive(i)}
                  type="button"
                >
                  {tab.label}
                </button>
              ),
            )}
          </div>
          <p className="mt-6 text-center text-base font-bold tracking-[0.1em] text-brand-ink">
            ↑ 點擊地圖查看課程特色 ↑
          </p>
        </div>
      )}
    </section>
  )
}
