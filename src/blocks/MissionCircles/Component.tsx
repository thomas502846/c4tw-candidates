import React from 'react'

import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type MissionCircle = {
  label: string
  description?: string | null
  id?: string | null
}

export type MissionCirclesBlockProps = {
  blockType: 'missionCircles'
  variant?: 'band' | 'plain' | null
  title?: string | null
  slogan?: string | null
  backgroundImage?: MediaDoc | string | number | null
  circles?: MissionCircle[] | null
}

// 三圓底色輪替（About Vision 取色：#DCD020 / #8BA98B / #ADCB59）
const circleColors = ['#DCD020', '#8BA98B', '#ADCB59']

/**
 * variant band：About Vision 使命帶（Figma 34:88 Vision-bg）——淺灰底（非深色照片）＋
 * 深色標語兩行＋三圓（外圈半透明 halo + 內實心圓 220/260 比例 + 白字 label）。
 * Figma 底為 #D9D9D9 淺灰；標語改深墨色以確保可讀（淺灰底白字對比不足）。
 */
const Band: React.FC<{
  slogan?: string | null
  circles: MissionCircle[]
}> = ({ slogan, circles }) => (
  <section className="bg-[#D9D9D9] py-16 md:py-24" data-block="missionCircles">
    <ScrollReveal as="div" variant="in" className="container max-w-[1240px]">
      {slogan && (
        // .fig H2：Bold 36 / lh60 固定 / ls15%。tablet(768) 36px 會把第二句擠出孤字「展。」，
        // 故 md(641–1024) 降到 30px、lg(≥1024) 才回 36px；text-balance-cjk 再保險防孤行。
        <h2 className="text-balance-cjk whitespace-pre-line text-center text-xl font-bold leading-[1.9] tracking-[0.15em] text-brand-ink md:text-[30px] md:leading-[48px] lg:text-4xl lg:leading-[60px]">
          {slogan}
        </h2>
      )}
      {/* mobile：直排（M-about.png 三圓直排）→ flex-wrap 置中堆疊。
          tablet(md 768)：縮圓 200 + gap-10，三圓同列剛好容納（3×200+2×40=680<704），避免 2+1 折行。
          desktop(lg ≥1024)：回設計 260 圓 + 103px gap 一排三圓。 */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:flex-nowrap md:gap-10 lg:gap-[103px]">
        {circles.map((circle, i) => {
          const color = circleColors[i % circleColors.length]
          return (
            <div
              key={circle.id ?? i}
              className="relative flex h-[200px] w-[200px] shrink-0 items-center justify-center rounded-full lg:h-[260px] lg:w-[260px]"
              style={{ backgroundColor: `${color}59` }} // 外圈半透明 halo（35%）
            >
              {/* Figma：260 frame 內 220 實心圓 → 85% */}
              <div
                className="flex h-[85%] w-[85%] items-center justify-center rounded-full px-4 text-center"
                style={{ backgroundColor: color }}
              >
                <span className="text-base font-bold tracking-[0.15em] text-white md:text-[19px]">
                  {circle.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollReveal>
  </section>
)

/**
 * variant plain：Training「\ 與我們一起行動 /」（288:658）——白底置中標題＋
 * 實心圓 160px＋同色雙 chevron＋說明兩行
 */
const Plain: React.FC<{ title?: string | null; circles: MissionCircle[] }> = ({ title, circles }) => (
  <section className="py-16" data-block="missionCircles">
    <ScrollReveal as="div" variant="in" className="container max-w-[1240px]">
      {title && (
        <h2 className="text-center text-[30px] font-bold leading-[1.4] tracking-[0.1em] text-brand-green md:text-[40px] md:leading-[60px]">
          {title}
        </h2>
      )}
      {/* 行動版單欄直鏈（M-training 288:658 mobile：大實心圓＋雙 chevron＋中介說明）；
          桌機 ≥md 維持原本橫向排列（flex-wrap、160px 圓、117px gap） */}
      <div className="mt-12 flex flex-col items-center gap-8 md:flex-row md:flex-wrap md:items-start md:gap-[117px]">
        {circles.map((circle, i) => {
          const color = circleColors[i % circleColors.length]
          return (
            <div className="flex w-full max-w-[260px] flex-col items-center md:w-[160px]" key={circle.id ?? i}>
              <div
                className="flex aspect-square w-[220px] items-center justify-center rounded-full px-5 text-center md:h-[160px] md:w-[160px]"
                style={{ backgroundColor: color }}
              >
                <span className="text-[19px] font-bold leading-[1.5] tracking-[0.1em] text-white md:text-[19px]">
                  {circle.label}
                </span>
              </div>
              <svg
                aria-hidden
                className="my-3 h-8 w-8"
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 32 32"
              >
                <path d="M8 8l8 7 8-7M8 17l8 7 8-7" />
              </svg>
              {circle.description && (
                <p
                  className={cn(
                    'text-center text-base leading-[1.7] tracking-[0.05em] text-brand-ink',
                  )}
                >
                  {circle.description}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </ScrollReveal>
  </section>
)

export const MissionCirclesBlock: React.FC<MissionCirclesBlockProps> = ({
  variant,
  title,
  slogan,
  circles,
}) => {
  if (!circles || circles.length === 0) return null
  if (variant === 'plain') return <Plain circles={circles} title={title} />
  return <Band circles={circles} slogan={slogan} />
}
