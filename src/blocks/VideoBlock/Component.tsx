'use client'

import React, { useState } from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type VideoBlockProps = {
  blockType: 'videoBlock'
  videoUrl?: string | null
  poster?: MediaDoc | string | number | null
}

/** 從 YouTube 連結取出 video id（watch?v= / youtu.be / shorts / embed） */
function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  )
  return m ? m[1] : null
}

/**
 * Home 影片區（82:233，1440×660）：滿版 16:9 + 中央圓形播放鈕
 * （125px circle stroke #ADCB59 透明底 + 同色 outline 三角）
 */
export const VideoBlockBlock: React.FC<VideoBlockProps> = ({ videoUrl, poster }) => {
  const [playing, setPlaying] = useState(false)
  const ytId = videoUrl ? youtubeId(videoUrl) : null

  if (playing && videoUrl) {
    return (
      <section
        className="relative aspect-video w-full bg-black md:aspect-[24/11]"
        data-block="videoBlock"
      >
        {ytId ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
            title="影片"
          />
        ) : (
          <video autoPlay className="absolute inset-0 h-full w-full" controls src={videoUrl} />
        )}
      </section>
    )
  }

  return (
    <section
      className="relative aspect-video w-full overflow-hidden bg-[#D9D9D9] md:aspect-[24/11]"
      data-block="videoBlock"
    >
      {poster && typeof poster === 'object' && (
        <Media
          resource={poster}
          imgClassName="absolute inset-0 h-full w-full object-cover"
          className="absolute inset-0"
        />
      )}
      {videoUrl && (
        <button
          aria-label="播放影片"
          className="absolute inset-0 flex items-center justify-center"
          onClick={() => setPlaying(true)}
          type="button"
        >
          <svg
            aria-hidden
            className="h-[80px] w-[80px] transition-transform hover:scale-105 md:h-[125px] md:w-[125px]"
            fill="none"
            viewBox="0 0 125 125"
          >
            <circle cx="62.5" cy="62.5" r="60" stroke="#ADCB59" strokeWidth="4" />
            <polygon
              points="52,42 88,62.5 52,83"
              stroke="#ADCB59"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          </svg>
        </button>
      )}
    </section>
  )
}
