import React from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

export type PostImageBlockProps = {
  image?: MediaDoc | string | number | null
  orientation?: 'horizontal' | 'vertical' | null
  caption?: string | null
}

/** 文章內頁單圖＋圖說：橫式 16:9 滿版 / 直式 3:5 寬 315px。照片不可點擊放大。 */
export const PostImageBlock: React.FC<PostImageBlockProps> = ({ image, orientation, caption }) => {
  if (!image || typeof image !== 'object') return null
  const vertical = orientation === 'vertical'
  return (
    <figure className={cn('my-8', vertical && 'mx-auto w-full max-w-[315px]')}>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-[16px] bg-brand-surface',
          vertical ? 'aspect-[3/5]' : 'aspect-video',
        )}
      >
        <Media resource={image} imgClassName="h-full w-full object-cover" fill />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-[14px] leading-[1.7] tracking-[0.05em] text-brand-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
