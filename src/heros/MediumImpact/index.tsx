import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

// 內頁 Banner（Figma symbol 30:136，1440×400）：
// 底圖照片滿版 + 左實右透漸層遮罩，頁名 H1 白字壓左側
export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="relative -mt-16 h-[240px] w-full overflow-hidden md:h-[400px]">
      {media && typeof media === 'object' && (
        <Media
          fill
          imgClassName="object-cover object-bottom"
          priority
          resource={media}
        />
      )}
      {/* 漸層遮罩：#8BA98B 51.9% → rgba(255,255,255,0.5) 71.6%（Figma 取值） */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, #8BA98B 51.923%, rgba(255, 255, 255, 0.5) 71.635%)',
        }}
      />
      <div className="container relative z-10 flex h-full flex-col justify-center gap-3 text-white">
        {richText && (
          <RichText
            className="[&_h1]:text-[30px] [&_h1]:font-bold [&_h1]:tracking-[0.1em] md:[&_h1]:text-[40px] [&_h2]:text-[28px] [&_h2]:font-bold [&_h2]:tracking-[0.1em] md:[&_h2]:text-[36px] [&_p]:mt-1 [&_p]:text-[16px] [&_p]:font-medium [&_p]:uppercase [&_p]:tracking-[0.1em] md:[&_p]:text-[19px] [&_*]:text-white"
            data={richText}
            enableGutter={false}
            enableProse={false}
          />
        )}
        {Array.isArray(links) && links.length > 0 && (
          <ul className="mt-2 flex gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
