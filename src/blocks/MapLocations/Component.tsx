import React from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type MapLocation = {
  name: string
  nameEn?: string | null
  id?: string | null
}

export type MapLocationsBlockProps = {
  blockType: 'mapLocations'
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  body?: string | null
  image?: MediaDoc | string | number | null
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
 * School 羅布森空間（Frame 179 341:639）：柔和水彩漸層底（白底＋淡綠/淡黃暈染）＋
 * 左欄文字＋右側在地地形插畫＋地圖 pin＋據點 label
 */
export const MapLocationsBlock: React.FC<MapLocationsBlockProps> = ({
  eyebrow,
  title,
  subtitle,
  body,
  image,
  locations,
}) => {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-20"
      data-block="mapLocations"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 12% 20%, rgba(202,243,217,0.55), transparent), radial-gradient(ellipse 55% 45% at 88% 75%, rgba(251,252,242,0.9), transparent), radial-gradient(ellipse 45% 40% at 70% 15%, rgba(226,242,236,0.6), transparent), #FFFFFF',
      }}
    >
      <div className="container flex max-w-[1240px] flex-col gap-12 md:flex-row md:items-center md:gap-16">
        {/* 左欄文字 */}
        <div className="md:w-[48%]">
          {eyebrow && <Eyebrow text={eyebrow} />}
          {title && (
            <h2 className="text-[26px] font-bold tracking-[0.15em] text-brand-green md:text-4xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 text-lg font-bold tracking-[0.1em] text-brand-ink md:text-[22px]">
              {subtitle}
            </p>
          )}
          {body && (
            <p className="mt-5 whitespace-pre-line text-justify text-base leading-[1.85] tracking-[0.1em] text-brand-ink">
              {body}
            </p>
          )}
        </div>

        {/* 右側地圖 + pin */}
        <div className="relative md:w-[52%]">
          {image && typeof image === 'object' ? (
            <Media resource={image} imgClassName="h-auto w-full object-contain" />
          ) : (
            <TerrainSvg />
          )}
          {(locations ?? []).map((location, i) => (
            <div
              className="absolute flex items-start gap-3"
              key={location.id ?? i}
              style={{ left: `${42 + i * 16}%`, top: `${38 + i * 12}%` }}
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
