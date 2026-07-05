'use client'

import React, { useState } from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaDoc } from '@/payload-types'

export type PostVideoBlockProps = {
  videoUrl?: string | null
  poster?: MediaDoc | string | number | null
}

function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  )
  return m ? m[1] : null
}

/** 文章內頁影片：封面＋播放鈕，點擊開 Lightbox（點背景或 X 關閉）。 */
export const PostVideoBlock: React.FC<PostVideoBlockProps> = ({ videoUrl, poster }) => {
  const [open, setOpen] = useState(false)
  if (!videoUrl) return null
  const ytId = youtubeId(videoUrl)
  return (
    <div className="my-8">
      <button
        aria-label="播放影片"
        className="group relative block aspect-video w-full overflow-hidden rounded-[16px] bg-[#D9D9D9]"
        onClick={() => setOpen(true)}
        type="button"
      >
        {poster && typeof poster === 'object' && (
          <Media resource={poster} imgClassName="h-full w-full object-cover" fill />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            aria-hidden
            className="h-[68px] w-[68px] transition-transform group-hover:scale-105 md:h-[88px] md:w-[88px]"
            fill="none"
            viewBox="0 0 125 125"
          >
            <circle cx="62.5" cy="62.5" fill="rgba(0,0,0,0.15)" r="60" stroke="#fff" strokeWidth="4" />
            <polygon fill="#fff" points="52,42 88,62.5 52,83" />
          </svg>
        </span>
      </button>
      {open && (
        <div
          aria-modal
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setOpen(false)}
          role="dialog"
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              aria-label="關閉"
              className="absolute -top-9 right-0 text-3xl leading-none text-white/90 transition-opacity hover:opacity-70 md:-right-2"
              onClick={() => setOpen(false)}
              type="button"
            >
              ×
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-[12px] bg-black shadow-2xl">
              {ytId ? (
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                  title="影片"
                />
              ) : (
                <video autoPlay className="h-full w-full" controls src={videoUrl} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
