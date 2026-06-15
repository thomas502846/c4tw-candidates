'use client'

import React, { useRef } from 'react'

import { cn } from '@/utilities/ui'

/**
 * StripArrows — 行動版照片輪播左右箭頭（Tracy 341:669「照片輪播 加上左右箭頭」）。
 * 不接管捲動容器的 ref（容器可能是 Parallax），改以 data-photostrip-scroll 屬性尋找最近的
 * 可橫向捲動帶，按一下捲約 0.8 個視寬。lg+ 桌機照片全展開、無需箭頭，故箭頭僅手機／平板顯示。
 */
const Chevron: React.FC<{ dir: 'left' | 'right' }> = ({ dir }) => (
  <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
    {dir === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
  </svg>
)

export const StripArrows: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const scroll = (dir: 1 | -1) => {
    const el = ref.current?.querySelector<HTMLElement>('[data-photostrip-scroll]')
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 320), behavior: 'smooth' })
  }

  const btn =
    'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-green shadow-[0_2px_8px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-colors hover:bg-white active:bg-white lg:hidden'

  return (
    <div className="relative" ref={ref}>
      {children}
      <button aria-label="上一張照片" className={cn(btn, 'left-3')} onClick={() => scroll(-1)} type="button">
        <Chevron dir="left" />
      </button>
      <button aria-label="下一張照片" className={cn(btn, 'right-3')} onClick={() => scroll(1)} type="button">
        <Chevron dir="right" />
      </button>
    </div>
  )
}

export default StripArrows
