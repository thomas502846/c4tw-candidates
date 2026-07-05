'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

export type PostGalleryBlockProps = {
  images?: { image: MediaDoc | string | number; id?: string | null }[] | null
}

const Chevron: React.FC<{ dir: 'left' | 'right' }> = ({ dir }) => (
  <svg aria-hidden className="h-7 w-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
    {dir === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
  </svg>
)

/** 文章內頁照片牆：3×3 縮圖、>9 張第 9 張「+N」、點擊開 Lightbox（左右切換、點背景/X 關閉）。 */
export const PostGalleryBlock: React.FC<PostGalleryBlockProps> = ({ images }) => {
  const items = (images ?? []).filter((it) => it?.image && typeof it.image === 'object')
  const [open, setOpen] = useState<number | null>(null)

  const total = items.length
  const tiles = items.slice(0, 9)
  const extra = total > 9 ? total - 9 : 0

  const close = useCallback(() => setOpen(null), [])
  const go = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + total) % total)),
    [total],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, go])

  if (total === 0) return null

  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {tiles.map((it, i) => {
          const showExtra = extra > 0 && i === 8
          return (
            <button
              aria-label={`開啟第 ${i + 1} 張照片`}
              className="group relative aspect-square w-full overflow-hidden rounded-[10px] bg-brand-surface"
              key={it.id ?? i}
              onClick={() => setOpen(i)}
              type="button"
            >
              <Media resource={it.image} imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" fill />
              {showExtra && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[28px] font-medium text-white">
                  +{extra}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {open !== null && (
        <div
          aria-modal
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={close}
          role="dialog"
        >
          <button
            aria-label="關閉"
            className="absolute right-5 top-5 text-4xl leading-none text-white/90 transition-opacity hover:opacity-70"
            onClick={close}
            type="button"
          >
            ×
          </button>
          {total > 1 && (
            <button
              aria-label="上一張"
              className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 md:left-8"
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
              type="button"
            >
              <Chevron dir="left" />
            </button>
          )}
          <div
            className={cn('relative flex max-h-[86vh] w-full max-w-4xl items-center justify-center')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[86vh] w-auto">
              <Media resource={items[open].image} imgClassName="max-h-[86vh] w-auto rounded-[8px] object-contain" />
            </div>
          </div>
          {total > 1 && (
            <button
              aria-label="下一張"
              className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 md:right-8"
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
              type="button"
            >
              <Chevron dir="right" />
            </button>
          )}
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[14px] tracking-[0.1em] text-white/80">
            {open + 1} / {total}
          </span>
        </div>
      )}
    </div>
  )
}
