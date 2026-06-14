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
  images?: { image: MediaDoc | string | number; id?: string | null }[] | null
  imagePosition?: 'left' | 'right' | 'none' | 'belowCenter' | null
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

/** Figma home About 230:803：3 張情境照錯位拼貼（489×576，含圓角＋陰影） */
const PhotoCollage: React.FC<{
  images: NonNullable<ContentBlockProps['images']>
}> = ({ images }) => {
  const items = images.filter((it) => Boolean(it?.image))
  if (items.length === 0) return null

  // 單張：退回一般大圖（與舊單 image 行為一致）
  if (items.length === 1) {
    return (
      <Media
        imgClassName="aspect-[506/550] w-full rounded-[30px] object-cover"
        resource={items[0].image}
      />
    )
  }

  // 多張（≥2，建議 3）：依 Figma 排列——主圖上方、第 2 張右下、第 3 張左下寬。
  // 用 12 欄 grid 做錯位；行高比例貼近 489×576 合成圖。
  const [first, second, third, ...rest] = items
  return (
    <div className="relative grid grid-cols-12 grid-rows-[repeat(10,minmax(0,1fr))] gap-3 aspect-[489/576] w-full">
      {/* 主圖：上方偏左、佔大面積 */}
      <div className="col-start-1 col-end-10 row-start-1 row-end-7">
        <Media
          imgClassName="h-full w-full rounded-[24px] object-cover shadow-[4px_4px_12px_rgba(139,169,139,0.35)]"
          resource={first.image}
        />
      </div>
      {/* 第 2 張：右下、較小，與主圖下緣交錯 */}
      {second && (
        <div className="col-start-8 col-end-13 row-start-5 row-end-9">
          <Media
            imgClassName="h-full w-full rounded-[24px] object-cover shadow-[4px_4px_12px_rgba(139,169,139,0.35)]"
            resource={second.image}
          />
        </div>
      )}
      {/* 第 3 張：左下、寬幅 */}
      {third && (
        <div className="col-start-1 col-end-9 row-start-7 row-end-11">
          <Media
            imgClassName="h-full w-full rounded-[24px] object-cover shadow-[4px_4px_12px_rgba(139,169,139,0.35)]"
            resource={third.image}
          />
        </div>
      )}
      {/* 第 4 張以上：堆在第 3 張右側（少見，保底不爆版） */}
      {rest.length > 0 && (
        <div className="col-start-9 col-end-13 row-start-9 row-end-11">
          <Media
            imgClassName="h-full w-full rounded-[24px] object-cover shadow-[4px_4px_12px_rgba(139,169,139,0.35)]"
            resource={rest[0].image}
          />
        </div>
      )}
    </div>
  )
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  eyebrow,
  title,
  align,
  ctaLabel,
  ctaUrl,
  richText,
  image,
  images,
  imagePosition,
}) => {
  const collageItems = (images ?? []).filter((it) => Boolean(it?.image))
  const hasMedia = collageItems.length > 0 || Boolean(image)
  // belowCenter（training/care「什麼是 AIO 解決方案？」mid1）：置中標題＋副標＋內文，
  // 下方一排等寬圖片橫排；非側欄圖文。
  const isBelowCenter = imagePosition === 'belowCenter'
  const showImage = hasMedia && imagePosition !== 'none' && imagePosition != null && !isBelowCenter
  // 置中：無側欄配圖（首頁「NEWS」眉標）或 belowCenter（AIO 區）皆置中
  const centered = align === 'center' && !showImage

  if (isBelowCenter) {
    // H2 置中 40px、richText（含 H3 副標 22/lh35）置中、body 16/lh29 置中；
    // 下方圖片橫排（≥2 張時等寬，桌機 3 欄）。文字逐字照 Sheet，不改寫。
    return (
      <ScrollReveal as="section" className="container max-w-[1240px]" data-block="content">
        <div className="mx-auto max-w-[860px] text-center">
          {title && (
            <div className="mb-6">
              <p className="flex items-center justify-center gap-2.5">
                <span aria-hidden className="inline-block h-[13px] w-[13px] rounded-full bg-brand-highlight" />
                {eyebrow && (
                  <span className="text-[14px] font-normal tracking-[0.1em] text-brand-muted md:text-[16px]">
                    {eyebrow}
                  </span>
                )}
              </p>
              <h2 className="mt-3 text-[30px] font-bold leading-[1.4] tracking-[0.1em] text-brand-green md:text-[40px] md:leading-[60px]">
                {title}
              </h2>
            </div>
          )}
          {richText && (
            <RichText
              className={cn(
                'prose-p:text-center prose-p:text-[15px] prose-p:leading-[1.85] prose-p:tracking-[0.1em] prose-p:text-brand-ink md:prose-p:text-[16px] md:prose-p:leading-[29px]',
                // H3 副標：Medium 22 / lh35 / ls10% 置中（! 蓋掉 prose :where(h3) 預設）
                'prose-h3:text-center prose-h3:!text-[20px] prose-h3:!font-medium prose-h3:!tracking-[0.1em] prose-h3:text-brand-ink md:prose-h3:!text-[22px] md:prose-h3:!leading-[35px]',
                'prose-strong:font-medium prose-strong:text-brand-primary',
              )}
              data={richText}
              enableGutter={false}
            />
          )}
        </div>
        {collageItems.length > 0 && (
          <div
            className={cn('mx-auto mt-12 grid max-w-[1100px] gap-6', {
              'sm:grid-cols-2 md:grid-cols-3': collageItems.length >= 3,
              'sm:grid-cols-2': collageItems.length === 2,
            })}
          >
            {collageItems.map((it, i) => (
              <Media
                imgClassName="aspect-[362/220] w-full rounded-[30px] bg-[#D9D9D9] object-cover"
                key={it.id ?? i}
                resource={it.image}
              />
            ))}
          </div>
        )}
      </ScrollReveal>
    )
  }

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
              <h2 className="mt-3 text-[28px] font-bold leading-[1.5] tracking-[0.1em] text-brand-green md:text-[40px] md:leading-[60px]">
                {title}
              </h2>
            </div>
          )}
          {richText && (
            <RichText
              className={cn(
                'prose-p:text-justify prose-p:text-[15px] prose-p:leading-[1.85] prose-p:tracking-[0.08em] prose-p:text-brand-ink md:prose-p:text-[16px] md:prose-p:leading-[29px]',
                'prose-headings:tracking-[0.1em] prose-headings:text-brand-ink',
                // H3 副標（.fig：從照顧一個人… Noto Sans TC Medium 22 / lh35 / ls10%=2.2px）：
                // prose 的 :where(h3) 會把 h3 蓋成 600＋字級/行高偏小，prose-h3: 變體 specificity
                // 不一定贏；加 ! 確保命中 type system H3 token（desktop 22/lh35/ls2.2px/medium）
                'prose-h3:!text-[20px] prose-h3:!font-medium prose-h3:!leading-[32px] prose-h3:!tracking-[0.1em] md:prose-h3:!text-[22px] md:prose-h3:!leading-[35px]',
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
            {collageItems.length > 0 ? (
              <PhotoCollage images={collageItems} />
            ) : (
              <Media
                imgClassName="aspect-[506/550] w-full rounded-[30px] object-cover"
                resource={image}
              />
            )}
          </div>
        )}
      </div>
    </ScrollReveal>
  )
}
