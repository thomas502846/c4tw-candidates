import React from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type QuoteBlockProps = {
  blockType: 'quote'
  text: string
  attribution?: string | null
  photo?: MediaDoc | string | number | null
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({ text, attribution, photo }) => {
  return (
    <section className="container" data-block="quote">
      <figure className="mx-auto max-w-2xl text-center">
        {photo && (
          <div className="mx-auto mb-7 w-24">
            <Media
              imgClassName="aspect-square rounded-full object-cover ring-4 ring-brand-lime/40"
              resource={photo}
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
