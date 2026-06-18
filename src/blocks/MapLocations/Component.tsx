import React from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type MapLocation = {
  name: string
  nameEn?: string | null
  id?: string | null
}

export type MapSection = {
  heading: string
  text: string
  id?: string | null
}

export type MapLocationsBlockProps = {
  blockType: 'mapLocations'
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  intro?: string | null
  sections?: MapSection[] | null
  closing?: string | null
  storyUrl?: string | null
  image?: MediaDoc | string | number | null
  spaceImage?: MediaDoc | string | number | null
  locations?: MapLocation[] | null
}

const Eyebrow: React.FC<{ text: string }> = ({ text }) => (
  <p className="mb-4 flex items-center gap-2.5 text-base tracking-[0.1em] text-brand-muted">
    <span aria-hidden className="inline-block h-[15px] w-[15px] shrink-0 rounded-full bg-brand-highlight" />
    {text}
  </p>
)

/** 內建在地地形插畫（school 341:639：淡青溪流帶＋淡青水域＋米黃低多邊形山形） */
const TerrainSvg: React.FC = () => (
  <svg aria-hidden className="h-auto w-full" fill="none" viewBox="0 0 560 400">
    {/* 左上溪流帶 */}
    <path
      d="M-10 30 C 90 55 130 10 220 60 C 270 88 250 130 320 140"
      stroke="#CDE9F0"
      strokeLinecap="round"
      strokeWidth="26"
    />
    {/* 中央淡青水域／區域形狀 */}
    <path
      d="M120 160 C 180 120 320 110 390 160 C 450 203 440 280 370 310 C 290 344 170 330 120 280 C 80 240 75 192 120 160 Z"
      fill="#E2F2EC"
    />
    {/* 右緣米黃低多邊形山形 */}
    <path d="M420 320 L470 230 L505 290 L540 210 L585 320 Z" fill="#F8F5E3" />
    <path d="M455 330 L500 270 L545 330 Z" fill="#F1ECD2" />
  </svg>
)

const PinIcon: React.FC = () => (
  <svg aria-hidden className="h-[52px] w-[40px] drop-shadow-sm" fill="none" viewBox="0 0 40 52">
    <path
      d="M20 2 C 10 2 3 9.6 3 19 C 3 31 20 50 20 50 C 20 50 37 31 37 19 C 37 9.6 30 2 20 2 Z"
      fill="#4A5B52"
    />
    <circle cx="20" cy="19" fill="#FFFFFF" r="7" />
  </svg>
)

/**
 * School 羅布森空間（Figma school-cft space 341:650）：
 * - 滿版水彩地形底圖（image，含據點 pin baked）＋白色 30% 遮罩，背景隨視差緩動（Tracy cmt 62）。
 * - 左側 590px 文字欄：eyebrow → 標題(#8ba98b 40) → 副標(22) → 導語 → 帶 #9c9f33 小標的子段落 → 結語。
 * - 文字下方：場域照（590×400 radius30）→ 羅布森空間故事按鈕（#adcb59）。
 * - image 留空時 fallback 內建 TerrainSvg；locations 仍可選（底圖已 baked pin 時通常不需）。
 */
export const MapLocationsBlock: React.FC<MapLocationsBlockProps> = ({
  eyebrow,
  title,
  subtitle,
  intro,
  sections,
  closing,
  storyUrl,
  image,
  spaceImage,
  locations,
}) => {
  const hasBgImage = image && typeof image === 'object'
  return (
    <section
      className="relative overflow-x-clip"
      data-block="mapLocations"
      style={
        hasBgImage
          ? { backgroundColor: '#FFFFFF' }
          : {
              background:
                'radial-gradient(ellipse 60% 50% at 12% 20%, rgba(202,243,217,0.55), transparent), radial-gradient(ellipse 55% 45% at 88% 75%, rgba(251,252,242,0.9), transparent), radial-gradient(ellipse 45% 40% at 70% 15%, rgba(226,242,236,0.6), transparent), #FFFFFF',
            }
      }
    >
      {/* 背景地圖（Tracy 341:650「Parallax Background，區塊高度不變，內容文字正常往上滑動」）：
          地圖用 sticky 固定貼著視窗，內容正常往上滑過它，看起來像「地圖不動、文字往上滑」。
          -mb-[100vh] 抵銷 sticky 層自身高度 → 不增加捲動高度＝「區塊高度不變」；
          section 用 overflow-x-clip（非 overflow-hidden）裁掉左右出血又不破壞 sticky 垂直貼附。
          地圖覆蓋整塊，object-center：左側淡青水域落在文字後當淺藍底、右側臺中地形＋臺中溪尾 pin。
          純 CSS：無 JS／prefers-reduced-motion 下仍是固定背景，不會有位移動畫。 */}
      {hasBgImage ? (
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 -z-0 -mb-[100vh] h-[100vh] w-full overflow-hidden"
        >
          <Media
            className="absolute inset-0 h-full w-full"
            imgClassName="h-full w-full object-cover object-center"
            resource={image as MediaDoc}
          />
          <div className="absolute inset-0 bg-white/30" />
        </div>
      ) : (
        <div aria-hidden className="absolute right-0 top-10 -z-0 hidden w-[52%] md:block">
          <TerrainSvg />
        </div>
      )}

      <div className="relative z-10 py-16 md:py-24">
        <div className="container max-w-[1240px]">
          {/* 左側文字欄（590px） */}
          <div className="md:w-[590px]">
          {eyebrow && <Eyebrow text={eyebrow} />}
          {title && (
            // .fig 羅布森空間：Noto Sans TC Bold 40 / lh60 / ls10%
            <h2 className="text-[26px] font-bold leading-[1.5] tracking-[0.1em] text-brand-green md:text-[40px] md:leading-[60px]">
              {title}
            </h2>
          )}
          {subtitle && (
            // .fig 照顧學校的培訓場域：Noto Sans TC Medium 22 / lh35 / ls10%
            <p className="mt-4 text-lg font-medium leading-[35px] tracking-[0.1em] text-brand-ink md:text-[22px]">
              {subtitle}
            </p>
          )}
          {intro && (
            <p className="mt-5 whitespace-pre-line text-justify text-base leading-[29px] tracking-[0.1em] text-brand-ink">
              {intro}
            </p>
          )}
          {(sections ?? []).map((s, i) => (
            <div className="mt-5" key={s.id ?? i}>
              {/* .fig 子段小標：wasabi #9c9f33 Medium 19 */}
              <p className="text-[17px] font-medium leading-[29px] tracking-[0.1em] text-brand-primary md:text-[19px]">
                {s.heading}
              </p>
              <p className="mt-2 whitespace-pre-line text-justify text-base leading-[29px] tracking-[0.1em] text-brand-ink">
                {s.text}
              </p>
            </div>
          ))}
          {closing && (
            <p className="mt-5 text-justify text-base leading-[29px] tracking-[0.1em] text-brand-ink">
              {closing}
            </p>
          )}

          {/* 場域照（建物外觀） */}
          {spaceImage && typeof spaceImage === 'object' && (
            <div className="mt-12 overflow-hidden rounded-[30px]">
              <Media
                imgClassName="h-[260px] w-full object-cover md:h-[400px]"
                resource={spaceImage}
              />
            </div>
          )}

          {/* 羅布森空間故事按鈕（#adcb59，右對齊比照 Figma items-end） */}
          {storyUrl && (
            <div className="mt-8 flex md:mt-14 md:justify-end">
              <a
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-lime px-6 py-2 text-[18px] font-medium tracking-[0.15em] text-white transition-opacity hover:opacity-90"
                href={storyUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                羅布森空間故事 →
              </a>
            </div>
          )}
        </div>

        {/* baked pin 的底圖通常不需 code pin；無底圖且有 locations 時才畫 */}
        {!hasBgImage &&
          (locations ?? []).map((location, i) => (
            <div
              className="absolute hidden items-start gap-3 md:flex"
              key={location.id ?? i}
              style={{ right: `${8 + i * 16}%`, top: `${28 + i * 12}%` }}
            >
              <PinIcon />
              <div className="pt-1">
                <p className="text-base font-bold tracking-[0.05em] text-brand-ink">{location.name}</p>
                {location.nameEn && (
                  <p className="text-sm tracking-[0.03em] text-brand-muted">{location.nameEn}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
