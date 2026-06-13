'use client'

import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * ScrollReveal — 全站共用進場原語（Tracy 動效規格：Scroll Reveal 進場，最普遍 30 處）
 *
 * 行為（對齊 docs/figma/20260612/tracy-comments-effects.md）：
 * - 滑動至區塊時觸發一次（IntersectionObserver，觸發後即 unobserve，不重複播放）
 * - Opacity 0% → 100%，Duration 0.6s，ease-out
 * - variant：
 *     'in'   = 純淡入（Fade In，預設）
 *     'up'   = Fade UP，由下方上移（卡片、分頁）
 *     'down' = Fade DOWN，由上方下移（三文字框）
 * - delay：三文字框/多卡片可錯開（秒）
 *
 * 無障礙 / SSR 安全：
 * - 尊重 prefers-reduced-motion：reduce 時直接顯示、不位移、不過場
 * - 初始 hidden 狀態只在「JS 已掛載且非 reduce」時才套用 → 無 JS（含爬蟲、noscript）內容永遠可見，
 *   不會發生「沒跑 JS 內容整段消失」。實作上初始 mounted=false → 套 reveal-visible 樣式（顯示），
 *   掛載後若需要動畫才切到 hidden→visible。
 */

export type ScrollRevealVariant = 'in' | 'up' | 'down'

export interface ScrollRevealProps {
  children: React.ReactNode
  /** 進場變體：in=純淡入（預設）｜up=由下上移｜down=由上下移 */
  variant?: ScrollRevealVariant
  /** 錯開延遲（秒），給三文字框 / 多卡片用 */
  delay?: number
  /** 位移距離（px），僅 up/down 生效。預設 20 */
  offset?: number
  /** 算進場一次需要可見的比例 */
  threshold?: number
  /** 渲染容器標籤，預設 div */
  as?: React.ElementType
  className?: string
  /** 額外傳給容器的屬性（id、aria 等） */
  [key: string]: unknown
}

const DURATION_MS = 600
const ROOT_MARGIN = '0px 0px -10% 0px' // 略早觸發：底部往內縮，捲到接近時就播

function getInitialReduced(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function usePrefersReducedMotion(): boolean {
  // 同步初始化：client 首次 render 就知道 reduce，避免「掛載後到 effect 解析前」閃一下 opacity:0
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

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'in',
  delay = 0,
  offset = 20,
  threshold = 0.15,
  as,
  className,
  ...rest
}) => {
  const Tag = (as ?? 'div') as React.ElementType
  const ref = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()

  // mounted=false 時視為「已顯示」→ SSR / 無 JS 內容可見，不會消失
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (reduced) {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return

    // 不支援 IntersectionObserver 時直接顯示
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target) // 觸發一次即停
          }
        }
      },
      { threshold, rootMargin: ROOT_MARGIN },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted, reduced, threshold])

  // 進場前是否需要隱藏（位移）：只有「已掛載、非 reduce、尚未可見」才隱藏
  const hidden = mounted && !reduced && !visible

  const translate =
    variant === 'up'
      ? `translateY(${offset}px)`
      : variant === 'down'
        ? `translateY(-${offset}px)`
        : 'none'

  // transition / opacity 都以 mounted 為前提：SSR 與 client 首次 render 皆走 mounted=false 分支，
  // 確保 hydration 一致；reduced 同步初始化只在 mounted 後才影響輸出，故不造成 mismatch。
  // 全部用 longhand（transitionProperty/Duration/...），避免與 transitionDelay 混用 shorthand
  // 觸發 React 的 style-conflict warning。
  const animate = mounted && !reduced
  const style: React.CSSProperties = {
    opacity: hidden ? 0 : 1,
    transform: hidden ? translate : 'none',
    transitionProperty: animate ? 'opacity, transform' : undefined,
    transitionDuration: animate ? `${DURATION_MS}ms` : undefined,
    transitionTimingFunction: animate ? 'ease-out' : undefined,
    transitionDelay: animate && !hidden && delay ? `${delay}s` : undefined,
    willChange: hidden ? 'opacity, transform' : undefined,
  }

  return (
    <Tag ref={ref} className={cn(className)} style={style} {...rest}>
      {children}
    </Tag>
  )
}

export default ScrollReveal
