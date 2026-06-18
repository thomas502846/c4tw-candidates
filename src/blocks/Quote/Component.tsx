import React from 'react'

import FramedImage from '@/components/Media/FramedImage'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type QuoteBlockProps = {
  blockType: 'quote'
  text: string
  attribution?: string | null
  photo?: MediaDoc | string | number | null
  id?: string | null
  framePos?: unknown
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({ text, attribution, photo, id, framePos }) => {
  return (
    <section className="container" data-block="quote">
      <figure className="mx-auto max-w-2xl text-center">
        {photo && (
          <div className="relative mx-auto mb-7 aspect-square w-24 overflow-hidden rounded-full ring-4 ring-brand-lime/40">
            <FramedImage
              className="rounded-full"
              id={id ?? 'quote'}
              resource={photo}
              framePos={framePos}
            />
          </div>
        )}
        <blockquote className="text-[20px] font-medium leading-[1.8] tracking-[0.12em] text-brand-green md:text-[26px]">
          <span aria-hidden className="mr-1 text-brand-highlight">
            「
          </span>
          {text}
          <span aria-hidden className="ml-1 text-brand-highlight">
            」
          </span>
        </blockquote>
        {attribution && (
          <figcaption className="mt-5 text-[14px] tracking-[0.15em] text-brand-muted md:text-[15px]">
            — {attribution}
          </figcaption>
        )}
      </figure>
    </section>
  )
}
