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
  eyebrow?: string | null
  title?: string | null
  align?: 'left' | 'center' | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  richText?: DefaultTypedEditorState | null
  image?: MediaDoc | string | number | null
  imagePosition?: 'left' | 'right' | 'none' | null
}

/** 「認識創照 →」綠 pill（Figma home About 230:803：bg #ADCB59、白字 19、rounded-30、右側箭頭） */
const ArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

export const ContentBlock: React.FC<ContentBlockProps> = ({
  eyebrow,
  title,
  align,
  ctaLabel,
  ctaUrl,
  richText,
  image,
  imagePosition,
}) => {
  const showImage = Boolean(image) && imagePosition !== 'none' && imagePosition != null
  // 置中只在無配圖時套用（如首頁「創照分享 / NEWS」眉標+標題置中）
  const centered = align === 'center' && !showImage

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
            <div className={cn('mb-8', { 'text-center': centered })}>
              {/* 全站 pattern：圓點眉標（黃綠）+ 英文小字（灰）+ H1 灰綠標題 */}
              <p className={cn('flex items-center gap-2.5', { 'justify-center': centered })}>
                <span
                  aria-hidden
                  className="inline-block h-[13px] w-[13px] rounded-full bg-brand-highlight"
                />
                {eyebrow && (
                  <span className="text-[14px] font-medium tracking-[0.15em] text-brand-muted md:text-[16px]">
                    {eyebrow}
                  </span>
                )}
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
          {ctaLabel && ctaUrl && (
            // Figma home About：靠右綠 pill「認識創照 →」（距文字 gap56）
            <div className="mt-14 flex justify-end">
              <a
                className="inline-flex items-center gap-2.5 rounded-[30px] bg-brand-lime px-[25px] py-[5px] text-[17px] font-medium tracking-[0.06em] text-white transition-opacity hover:opacity-90 md:text-[19px]"
                href={ctaUrl}
              >
                {ctaLabel}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
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
