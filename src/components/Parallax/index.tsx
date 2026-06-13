'use client'

import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * Parallax — 背景視差原語（Tracy 動效規格：school 背景地圖 node 341:650）
 *
 * 行為（對齊 docs/figma/20260612/tracy-comments-effects.md）：
 * - 背景層隨頁面捲動以較慢速度位移（視差），產生「背景固定/緩動、內容正常往上滑」的層次感
 * - 區塊高度不變：位移只作用於這個包在 overflow-hidden 容器內的背景層，不撐開版面
 * - 觸發以 requestAnimationFrame 節流；只在元素接近視窗時計算
 *
 * 無障礙 / SSR 安全：
 * - 尊重 prefers-reduced-motion：reduce 時完全不位移（transform 維持 none），背景靜態可見
 * - 不支援 JS（爬蟲、noscript）時：初始即 transform none，背景靜態可見，內容不依賴 JS
 * - speed：位移強度（0 = 不動，0.3 = 背景走內容的 30% 距離；建議 0.15–0.35）
 *
 * 用法：把背景層當 children 包進來；外層需自帶 overflow-hidden（避免位移露出邊緣）。
 */

export interface ParallaxProps {
  children: React.ReactNode
  /** 視差強度，0=不動。預設 0.2 */
  speed?: number
  /** 最大位移上下限（px），避免極端視窗下露邊。預設 60 */
  maxOffset?: number
  /** 位移軸向：'y'（預設，背景上下緩動）或 'x'（橫向帶緩動，care photowall 263:431） */
  axis?: 'x' | 'y'
  as?: React.ElementType
  className?: string
  [key: string]: unknown
}

function getInitialReduced(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getInitialReduced)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.2,
  maxOffset = 60,
  axis = 'y',
  as,
  className,
  ...rest
}) => {
  const Tag = (as ?? 'div') as React.ElementType
  const ref = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const frame = useRef<number | null>(null)

  useEffect(() => {
    if (reduced) {
      // reduce：確保歸零（若先前曾位移）
      if (ref.current) ref.current.style.transform = ''
      return
    }
    const el = ref.current
    if (typeof window === 'undefined') return
    if (!el || typeof IntersectionObserver === 'undefined') return

    let active = false

    const update = () => {
      frame.current = null
      const node = ref.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      // 以元素中心相對視窗中心的距離計算位移：在視窗中央時 0
      const elCenter = rect.top + rect.height / 2
      const delta = elCenter - vh / 2
      let offset = -delta * speed
      if (offset > maxOffset) offset = maxOffset
      if (offset < -maxOffset) offset = -maxOffset
      node.style.transform =
        axis === 'x'
          ? `translate3d(${offset.toFixed(1)}px, 0, 0)`
          : `translate3d(0, ${offset.toFixed(1)}px, 0)`
    }

    const onScroll = () => {
      if (!active) return
      if (frame.current != null) return
      frame.current = window.requestAnimationFrame(update)
    }

    // 只在元素出現在視窗附近時掛 scroll，離開就拔，省效能
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          active = entry.isIntersecting
          if (active) update()
        }
      },
      { rootMargin: '100px 0px 100px 0px' },
    )
    io.observe(el)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current != null) window.cancelAnimationFrame(frame.current)
      if (el) el.style.transform = ''
    }
  }, [reduced, speed, maxOffset, axis])

  return (
    <Tag ref={ref} className={cn(className)} style={{ willChange: reduced ? undefined : 'transform' }} {...rest}>
      {children}
    </Tag>
  )
}

export default Parallax
