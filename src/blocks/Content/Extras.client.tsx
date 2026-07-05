'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/* ---------------------------------------------------------------- */
/* 折疊區（首頁關於：「了解更多」下方「AIO整合照顧模式」點擊下拉）        */
/* Tracy Home 2026-06-22「點擊按鈕後下拉」。button 展開/收合下方內容。    */
/* children = server 端已渲染好的 RichText，client 只負責開合互動。      */
/* ---------------------------------------------------------------- */
const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    aria-hidden
    className={cn('h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out', open && 'rotate-180')}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const ContentAccordion: React.FC<{
  label: string
  children: React.ReactNode
  align?: 'left' | 'center' | 'right' | null
}> = ({ label, children, align }) => {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const measure = useCallback(() => {
    if (contentRef.current) setHeight(contentRef.current.scrollHeight)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, children])

  return (
    <div
      className={cn(
        'mt-6 flex flex-col',
        align === 'center' ? 'items-center' : align === 'right' ? 'items-end' : 'items-start',
      )}
    >
      <button
        aria-expanded={open}
        className="btn-cft btn-green inline-flex items-center gap-2.5 rounded-[30px] px-[25px] py-[7px] text-[17px] font-medium tracking-[0.06em] md:text-[19px]"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {label}
        <Chevron open={open} />
      </button>
      <div
        aria-hidden={!open}
        className="w-full overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
        style={{ maxHeight: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <div className="pt-6" ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* 語音播放按鈕（緣起：Tracy About 2026-06-22「點播放鍵、右方顯示剩餘時間」） */
/* ---------------------------------------------------------------- */
const fmtTime = (sec: number): string => {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const PlayIcon: React.FC = () => (
  <svg aria-hidden className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)
const PauseIcon: React.FC = () => (
  <svg aria-hidden className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
)

export const AudioButton: React.FC<{ src: string; label?: string }> = ({
  src,
  label = '聽語音',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      void a.play()
    } else {
      a.pause()
    }
  }

  const remaining = duration ? Math.max(0, duration - current) : 0

  return (
    <div className="inline-flex min-w-[220px] items-center gap-3 rounded-[30px] bg-brand-lime px-5 py-2.5 text-white">
      <button
        aria-label={playing ? '暫停' : '播放'}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 transition-colors hover:bg-white/35"
        onClick={toggle}
        type="button"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <span className="text-[15px] font-medium tracking-[0.06em] md:text-[17px]">{label}</span>
      <span className="ml-auto text-[14px] font-medium tabular-nums tracking-[0.02em] text-white/90">
        {fmtTime(remaining)}
      </span>
      <audio
        onEnded={() => {
          setPlaying(false)
          setCurrent(0)
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        preload="metadata"
        ref={audioRef}
        src={src}
      />
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* 影片按鈕（緣起：Tracy「按鈕呈現」；點擊開 Lightbox，沿用 VideoBlock 模式） */
/* ---------------------------------------------------------------- */
function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  )
  return m ? m[1] : null
}

export const VideoButton: React.FC<{ src: string; label?: string }> = ({
  src,
  label = '看影片',
}) => {
  const [open, setOpen] = useState(false)
  const ytId = youtubeId(src)
  return (
    <>
      <button
        className="btn-cft btn-highlight inline-flex items-center gap-2.5 rounded-[30px] px-5 py-2.5 text-[15px] font-medium tracking-[0.06em] md:text-[17px]"
        onClick={() => setOpen(true)}
        type="button"
      >
        <PlayIcon />
        {label}
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
                <video autoPlay className="h-full w-full" controls src={src} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* 緣起影音按鈕列：語音 + 影片並排（有才顯示） */
export const ContentMediaButtons: React.FC<{
  audioSrc?: string | null
  videoSrc?: string | null
  align?: 'left' | 'center' | null
}> = ({ audioSrc, videoSrc, align }) => {
  if (!audioSrc && !videoSrc) return null
  return (
    <div className={cn('mt-8 flex flex-wrap items-center gap-4', align === 'center' && 'justify-center')}>
      {audioSrc && <AudioButton src={audioSrc} />}
      {videoSrc && <VideoButton src={videoSrc} />}
    </div>
  )
}
