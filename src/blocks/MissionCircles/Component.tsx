import React from 'react'

import { Media } from '@/components/Media'
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
 * variant band：About Vision 使命帶（34:88）——滿版照片底＋白字標語兩行＋
 * 三圓（外圈半透明 halo + 內實心圓 + 白字 label）
 */
const Band: React.FC<{
  slogan?: string | null
  backgroundImage?: MediaDoc | string | number | null
  circles: MissionCircle[]
}> = ({ slogan, backgroundImage, circles }) => (
  <section className="relative overflow-hidden py-16 md:py-24" data-block="missionCircles">
    {backgroundImage && typeof backgroundImage === 'object' ? (
      <Media
        resource={backgroundImage}
        imgClassName="absolute inset-0 h-full w-full object-cover"
        className="absolute inset-0"
      />
    ) : (
      <div aria-hidden className="absolute inset-0 bg-brand-green" />
    )}
    <div aria-hidden className="absolute inset-0 bg-black/40" />
    <div className="container relative max-w-[1240px]">
      {slogan && (
        <h2 className="whitespace-pre-line text-center text-xl font-bold leading-[1.9] tracking-[0.15em] text-white md:text-4xl md:leading-[1.7]">
          {slogan}
        </h2>
      )}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-[103px]">
        {circles.map((circle, i) => {
          const color = circleColors[i % circleColors.length]
          return (
            <div
              key={circle.id ?? i}
              className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full md:h-[260px] md:w-[260px]"
              style={{ backgroundColor: `${color}59` }} // 外圈半透明 halo（35%）
            >
              <div
                className="flex h-[80%] w-[80%] items-center justify-center rounded-full px-4 text-center"
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
    </div>
  </section>
)

/**
 * variant plain：Training「\ 與我們一起行動 /」（288:658）——白底置中標題＋
 * 實心圓 160px＋同色雙 chevron＋說明兩行
 */
const Plain: React.FC<{ title?: string | null; circles: MissionCircle[] }> = ({ title, circles }) => (
  <section className="py-16" data-block="missionCircles">
    <div className="container max-w-[1240px]">
      {title && (
        <h2 className="text-center text-[26px] font-bold tracking-[0.15em] text-brand-green md:text-4xl">
          {title}
        </h2>
      )}
      <div className="mt-12 flex flex-wrap items-start justify-center gap-10 md:gap-[117px]">
        {circles.map((circle, i) => {
          const color = circleColors[i % circleColors.length]
          return (
            <div className="flex w-[160px] flex-col items-center" key={circle.id ?? i}>
              <div
                className="flex h-[160px] w-[160px] items-center justify-center rounded-full px-5 text-center"
                style={{ backgroundColor: color }}
              >
                <span className="text-[17px] font-bold leading-[1.5] tracking-[0.1em] text-white md:text-[19px]">
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
    </div>
  </section>
)

export const MissionCirclesBlock: React.FC<MissionCirclesBlockProps> = ({
  variant,
  title,
  slogan,
  backgroundImage,
  circles,
}) => {
  if (!circles || circles.length === 0) return null
  if (variant === 'plain') return <Plain circles={circles} title={title} />
  return <Band backgroundImage={backgroundImage} circles={circles} slogan={slogan} />
}
