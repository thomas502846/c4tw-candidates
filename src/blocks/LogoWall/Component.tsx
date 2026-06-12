import React from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type LogoWallBlockProps = {
  blockType: 'logoWall'
  source?: 'partners' | 'manual' | null
  partnerType?: string | null
  logos?:
    | {
        logo: MediaDoc | string | number
        name?: string | null
        url?: string | null
        id?: string | null
      }[]
    | null
}

export const LogoWallBlock: React.FC<LogoWallBlockProps> = ({ source, partnerType, logos }) => {
  return (
    <section className="container" data-block="logoWall">
      {source === 'partners' ? (
        <p className="text-sm text-brand-muted">
          {/* TODO 接線後：查詢 partners collection（type 篩選：{partnerType || '全部'}） */}
          夥伴 Logo 牆（篩選：{partnerType || '全部'}）
        </p>
      ) : (
        <ul className="flex flex-wrap items-center justify-center gap-5 md:gap-7">
          {(logos ?? []).map((item, i) => {
            const media = (
              <Media
                imgClassName="max-h-16 w-auto object-contain"
                resource={item.logo}
              />
            )
            return (
              <li
                className="flex h-24 w-40 items-center justify-center rounded-[20px] bg-white px-5 shadow-[2px_2px_8px_rgba(139,169,139,0.25)]"
                key={item.id ?? i}
              >
                {item.url ? (
                  <a aria-label={item.name ?? undefined} href={item.url}>
                    {media}
                  </a>
                ) : (
                  media
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
