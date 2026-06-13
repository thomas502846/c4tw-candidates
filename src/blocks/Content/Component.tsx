import React from 'react'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated ContentBlock type
export type ContentBlockProps = {
  blockType: 'content'
  title?: string | null
  richText?: DefaultTypedEditorState | null
  image?: MediaDoc | string | number | null
  imagePosition?: 'left' | 'right' | 'none' | null
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  title,
  richText,
  image,
  imagePosition,
}) => {
  const showImage = Boolean(image) && imagePosition !== 'none' && imagePosition != null

  return (
    // 標題、內文/圖文區塊進場 Fade In（Tracy node 0:1/45:240：滑到觸發、0→100%、0.6s）
    <ScrollReveal as="section" className="container" data-block="content">
      <div
        className={cn('flex flex-col gap-10', {
          'md:flex-row-reverse md:items-center md:gap-16': showImage && imagePosition === 'left',
          'md:flex-row md:items-center md:gap-16': showImage && imagePosition === 'right',
        })}
      >
        <div className={cn({ 'md:w-[55%]': showImage })}>
          {title && (
            <div className="mb-8">
              {/* 全站 pattern：圓點眉標 + H1 灰綠標題 */}
              <p aria-hidden className="flex items-center gap-2.5">
                <span className="inline-block h-[13px] w-[13px] rounded-full bg-brand-highlight" />
              </p>
              <h2 className="mt-3 text-[28px] font-bold tracking-[0.1em] text-brand-green md:text-[40px]">
                {title}
              </h2>
            </div>
          )}
          {richText && (
            <RichText
              className={cn(
                'prose-p:text-justify prose-p:text-[15px] prose-p:leading-[1.85] prose-p:tracking-[0.08em] prose-p:text-brand-ink md:prose-p:text-[16px] md:prose-p:leading-[29px]',
                'prose-headings:tracking-[0.1em] prose-headings:text-brand-ink',
                // 強調句（如緣起「如果..」）：richText 粗體 → 果綠 #9C9F33
                'prose-strong:font-medium prose-strong:text-brand-primary',
                'prose-a:text-brand-primary',
              )}
              data={richText}
              enableGutter={false}
            />
          )}
        </div>
        {showImage && (
          <div className="md:w-[45%]">
            <Media
              imgClassName="aspect-[506/550] w-full rounded-[30px] object-cover"
              resource={image}
            />
          </div>
        )}
      </div>
    </ScrollReveal>
  )
}
