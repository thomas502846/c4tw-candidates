import React from 'react'

import { FramedImage } from '@/components/Media/FramedImage'
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
  id?: string | null
  backgroundImageFramePos?: unknown
}

// 三圓底色輪替（About Vision 取色：#DCD020 / #8BA98B / #ADCB59）
const circleColors = ['#DCD020', '#8BA98B', '#ADCB59']

/**
 * Tracy：信念與價值的三圈，label 在第一個「-」之後要換行（如「培育-照顧的人」→
 * 培育 / 照顧的人）。拆首個 dash、捨去 dash 分兩行；無 dash 則整段單行輸出。
 */
const CircleLabel: React.FC<{ label: string }> = ({ label }) => {
  const i = label.indexOf('-')
  if (i === -1) return <>{label}</>
  return (
    <>
      {label.slice(0, i)}
      <br />
      {label.slice(i + 1)}
    </>
  )
}

/**
 * variant band：About Vision 使命帶（Figma 34:88 Vision-bg + 34:113）——
 * 滿版照片底（深色調）＋黑色 45% 遮罩＋白色標語兩行＋三圓
 * （Figma about-vision：外圈 40% 半透明同色 halo 260/200 ＋ 內圈實心同色 ~188/150、白字 Black label）。
 */
const Band: React.FC<{
  slogan?: string | null
  circles: MissionCircle[]
  backgroundImage?: MediaDoc | string | number | null
  id?: string | null
  backgroundImageFramePos?: unknown
}> = ({ slogan, circles, backgroundImage, id, backgroundImageFramePos }) => (
  <section className="relative overflow-hidden py-16 md:py-24" data-block="missionCircles">
    {/* 滿版照片底 + 深色遮罩（無圖則 fallback 深灰） */}
    {backgroundImage && typeof backgroundImage === 'object' ? (
      <>
        <FramedImage
          id={id ?? 'mission-bg'}
          resource={backgroundImage}
          framePos={backgroundImageFramePos}
        />
        <div aria-hidden className="absolute inset-0 bg-black/45" />
      </>
    ) : (
      <div aria-hidden className="absolute inset-0 bg-[#4C4C4C]" />
    )}
    <ScrollReveal as="div" variant="in" className="container relative z-10 max-w-[1140px]">
      {slogan && (
        // .fig H2：Bold 36 / lh60 固定 / ls15%，白字置中。tablet 降 30px 防孤字。
        <h2 className="text-balance-cjk whitespace-pre-line text-center text-xl font-bold leading-[1.9] tracking-[0.15em] text-white md:text-[30px] md:leading-[48px] lg:text-4xl lg:leading-[60px]">
          {slogan}
        </h2>
      )}
      {/* mobile 直排堆疊；tablet 縮 200 同列；desktop 260 圓 + 103px gap 一排三圓。 */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:flex-nowrap md:gap-10 lg:gap-[103px]">
        {circles.map((circle, i) => {
          const color = circleColors[i % circleColors.length]
          return (
            <div
              key={circle.id ?? i}
              className="relative flex h-[200px] w-[200px] shrink-0 items-center justify-center lg:h-[260px] lg:w-[260px]"
            >
              {/* 外圈：同色 40% 半透明 halo（填滿容器） */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: `${color}66` }}
              />
              {/* 內圈：同色實心 disc（~75% 直徑），白字置中 */}
              <span
                className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full px-4 text-center lg:h-[188px] lg:w-[188px]"
                style={{ backgroundColor: color }}
              >
                <span className="text-[18px] font-black tracking-[0.1em] text-white lg:text-[22px]">
                  <CircleLabel label={circle.label} />
                </span>
              </span>
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
    <ScrollReveal as="div" variant="in" className="container max-w-[1140px]">
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
                  <CircleLabel label={circle.label} />
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
  backgroundImage,
  id,
  backgroundImageFramePos,
}) => {
  if (!circles || circles.length === 0) return null
  if (variant === 'plain') return <Plain circles={circles} title={title} />
  return (
    <Band
      backgroundImage={backgroundImage}
      backgroundImageFramePos={backgroundImageFramePos}
      circles={circles}
      id={id}
      slogan={slogan}
    />
  )
}
