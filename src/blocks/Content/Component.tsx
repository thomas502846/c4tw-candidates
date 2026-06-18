import React from 'react'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { FramedImage } from '@/components/Media/FramedImage'
import RichText from '@/components/RichText'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated ContentBlock type
export type ContentBlockProps = {
  blockType: 'content'
  id?: string | null
  eyebrow?: string | null
  title?: string | null
  align?: 'left' | 'center' | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  richText?: DefaultTypedEditorState | null
  image?: MediaDoc | string | number | null
  framePos?: unknown
  images?: { image: MediaDoc | string | number; id?: string | null; framePos?: unknown }[] | null
  imagePosition?: 'left' | 'right' | 'none' | 'belowCenter' | null
  // AIO 區（什麼是 AIO 整合照顧模式）滿版漸層底（Figma 654:498 aio-info 圖填底）
  background?: 'none' | 'aio' | null
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
  id: string | number | null | undefined
  images: NonNullable<ContentBlockProps['images']>
}> = ({ id, images }) => {
  const items = images.filter((it) => Boolean(it?.image))
  if (items.length === 0) return null
  const scope = id ?? 'content-collage'
  // object-contain 等效：FramedImage 預設 cover；以 zoom 0.99 讓整張縮入框內（contain 觀感）
  const containDefaults = {
    mobile: { x: 50, y: 50, zoom: 0.99 },
    tablet: { x: 50, y: 50, zoom: 0.99 },
    desktop: { x: 50, y: 50, zoom: 0.99 },
  }

  // 單張：用於 Figma 已合成好的拼貼圖（489×576，含圓角＋透明縫隙）——
  // 用原圖比例 object-contain 完整呈現，不裁切。
  if (items.length === 1) {
    return (
      <div className="relative aspect-[489/576] w-full overflow-hidden">
        <FramedImage
          defaults={containDefaults}
          framePos={items[0].framePos}
          id={items[0].id ?? `${scope}-0`}
          resource={items[0].image}
        />
      </div>
    )
  }

  // 多張（≥2，建議 3）：依 Figma 排列——主圖上方、第 2 張右下、第 3 張左下寬。
  // 用 12 欄 grid 做錯位；行高比例貼近 489×576 合成圖。
  const [first, second, third, ...rest] = items
  return (
    <div className="relative grid grid-cols-12 grid-rows-[repeat(10,minmax(0,1fr))] gap-3 aspect-[489/576] w-full">
      {/* 主圖：上方偏左、佔大面積 */}
      <div className="relative col-start-1 col-end-10 row-start-1 row-end-7 overflow-hidden rounded-[24px] shadow-[4px_4px_12px_rgba(139,169,139,0.35)]">
        <FramedImage
          framePos={first.framePos}
          id={first.id ?? `${scope}-0`}
          resource={first.image}
        />
      </div>
      {/* 第 2 張：右下、較小，與主圖下緣交錯 */}
      {second && (
        <div className="relative col-start-8 col-end-13 row-start-5 row-end-9 overflow-hidden rounded-[24px] shadow-[4px_4px_12px_rgba(139,169,139,0.35)]">
          <FramedImage
            framePos={second.framePos}
            id={second.id ?? `${scope}-1`}
            resource={second.image}
          />
        </div>
      )}
      {/* 第 3 張：左下、寬幅 */}
      {third && (
        <div className="relative col-start-1 col-end-9 row-start-7 row-end-11 overflow-hidden rounded-[24px] shadow-[4px_4px_12px_rgba(139,169,139,0.35)]">
          <FramedImage
            framePos={third.framePos}
            id={third.id ?? `${scope}-2`}
            resource={third.image}
          />
        </div>
      )}
      {/* 第 4 張以上：堆在第 3 張右側（少見，保底不爆版） */}
      {rest.length > 0 && (
        <div className="relative col-start-9 col-end-13 row-start-9 row-end-11 overflow-hidden rounded-[24px] shadow-[4px_4px_12px_rgba(139,169,139,0.35)]">
          <FramedImage
            framePos={rest[0].framePos}
            id={rest[0].id ?? `${scope}-3`}
            resource={rest[0].image}
          />
        </div>
      )}
    </div>
  )
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  id,
  eyebrow,
  title,
  align,
  ctaLabel,
  ctaUrl,
  richText,
  image,
  framePos,
  images,
  imagePosition,
  background,
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
    // belowCenter（AIO 區）：標題＋副標＋內文 + 下方圖片橫排。
    // 對齊由 align 決定：center（care，預設）置中；left（training 654:499）整段靠左。
    const leftAlign = align === 'left'
    // AIO 漸層底：脫離 container 撐滿視窗寬，內層再收回 1140 內容欄（Figma 654:498 滿版漸層帶）
    const aioBg = background === 'aio'
    return (
      <ScrollReveal
        as="section"
        className={cn(
          aioBg
            ? 'relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-cover bg-center py-16 md:py-24'
            : 'container max-w-[1140px]',
        )}
        data-block="content"
        style={aioBg ? { backgroundImage: "url('/figma/care-aio-bg.webp')" } : undefined}
      >
        <div className={cn(aioBg && 'container max-w-[1140px]')}>
        <div className={cn(leftAlign ? 'max-w-[1100px]' : 'mx-auto max-w-[860px] text-center')}>
          {title && (
            <div className="mb-6">
              <p className={cn('flex items-center gap-2.5', leftAlign ? 'justify-start' : 'justify-center')}>
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
                leftAlign
                  ? 'prose-p:text-justify prose-p:text-[15px] prose-p:leading-[1.85] prose-p:tracking-[0.1em] prose-p:text-brand-ink md:prose-p:text-[16px] md:prose-p:leading-[29px]'
                  : 'prose-p:text-center prose-p:text-[15px] prose-p:leading-[1.85] prose-p:tracking-[0.1em] prose-p:text-brand-ink md:prose-p:text-[16px] md:prose-p:leading-[29px]',
                // H3 副標：Medium 22 / lh35 / ls10%（! 蓋掉 prose :where(h3) 預設）
                leftAlign
                  ? 'prose-h3:text-left prose-h3:!text-[20px] prose-h3:!font-medium prose-h3:!tracking-[0.1em] prose-h3:text-brand-ink md:prose-h3:!text-[22px] md:prose-h3:!leading-[35px]'
                  : 'prose-h3:text-center prose-h3:!text-[20px] prose-h3:!font-medium prose-h3:!tracking-[0.1em] prose-h3:text-brand-ink md:prose-h3:!text-[22px] md:prose-h3:!leading-[35px]',
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
              <div
                className="relative aspect-[362/220] w-full overflow-hidden rounded-[30px] bg-[#D9D9D9]"
                key={it.id ?? i}
              >
                <FramedImage
                  framePos={it.framePos}
                  id={it.id ?? `${id ?? 'content'}-below-${i}`}
                  resource={it.image}
                />
              </div>
            ))}
          </div>
        )}
        </div>
      </ScrollReveal>
    )
  }

  return (
    // 標題、內文/圖文區塊進場 Fade In（Tracy node 0:1/45:240：滑到觸發、0→100%、0.6s）
    <ScrollReveal as="section" className="container" data-block="content">
      <div
        className={cn('flex gap-10', {
          // 單張側欄配圖（about 緣起、school 關於照顧學校）：行動版照片在文字上方（Figma 218:856 / 376:781）。
          // 拼貼圖（images[]，如首頁 About）維持文字在上、圖在下。
          'flex-col-reverse': showImage && collageItems.length === 0,
          'flex-col': !(showImage && collageItems.length === 0),
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
              <PhotoCollage id={id} images={collageItems} />
            ) : (
              <div className="relative aspect-[506/550] w-full overflow-hidden rounded-[30px]">
                <FramedImage id={id ?? 'content'} resource={image} framePos={framePos} />
              </div>
            )}
          </div>
        )}
      </div>
    </ScrollReveal>
  )
}
