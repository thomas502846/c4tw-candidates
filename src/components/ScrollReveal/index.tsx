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
 *
 * ⚠️ 防「瞬間 pop（不滑動）」的關鍵（與 news ticker 同類 bug）：
 *   若 hidden(opacity:0) 與 visible(opacity:1) 在 React 同一個 commit flush 落地（例如元素掛載時已在
 *   視窗內，mounted→true 與 IntersectionObserver 的 visible→true 合批），瀏覽器沒有「已 paint 的 from
 *   起始幀」可過渡 → opacity 直接 0→1 跳完，動畫不播。實證：同幀下 computed opacity 全程為 1，零中間態。
 *   解法：observer 觸發後不立即顯示，而是用 double requestAnimationFrame 等 hidden 幀先 paint 一幀，
 *   再切 visible。實證：worst-case 同幀 commit 也能抓到 opacity 0→1 的 20 個中間態。
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
  // inView：observer 觀測到進入視窗（純訊號，不直接決定顯示）
  const [inView, setInView] = useState(false)
  // visible：實際切到顯示態；只在 hidden 幀確定 paint 後（double rAF）才為 true，避免同幀 0→1 跳變
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (reduced) {
      setInView(true)
      return
    }
    const el = ref.current
    if (!el) return

    // 不支援 IntersectionObserver 時直接顯示
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target) // 觸發一次即停
          }
        }
      },
      { threshold, rootMargin: ROOT_MARGIN },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted, reduced, threshold])

  // inView → visible 的「延後一幀」橋接：
  // reduced 時直接顯示（不需要過渡，也不需要保證 from 幀）；
  // 非 reduced 時用 double rAF——先讓 hidden(opacity:0+位移) 幀 paint 一次，再切 visible，
  // 確保瀏覽器有可過渡的起始態，徹底消除「同幀 commit 直接跳到 1」的 pop。
  useEffect(() => {
    if (!inView) return
    if (reduced || typeof requestAnimationFrame === 'undefined') {
      setVisible(true)
      return
    }
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [inView, reduced])

  // 進場前是否需要隱藏（位移）：只有「已掛載、非 reduce、尚未可見」才隱藏
  const hidden = mounted && !reduced && !visible

  const translate =
    variant === 'up'
      ? `translateY(${offset}px)`
      : variant === 'down'
        ? `translateY(-${offset}px)`
        : 'none'

  // ⚠️ 關鍵：transition 不可與「opacity 變 0」同一個 commit 打開，否則瀏覽器會把
  //   上一個已 paint 的 opacity:1 當起點 → 動畫先往 0 跑、又被 visible 翻回 1，過渡被腰斬、看似 pop。
  //   正解：hidden 階段「無 transition」(opacity:0 瞬間定位、先 paint 一個乾淨的 from 幀)，
  //   只有切到 visible（要播 0→1）時才開 transition。如此瀏覽器一定有可過渡的起始態。
  const animate = mounted && !reduced
  const withTransition = animate && !hidden // 只有要顯示（播放）時才掛 transition
  const style: React.CSSProperties = {
    opacity: hidden ? 0 : 1,
    transform: hidden ? translate : 'none',
    transitionProperty: withTransition ? 'opacity, transform' : undefined,
    transitionDuration: withTransition ? `${DURATION_MS}ms` : undefined,
    transitionTimingFunction: withTransition ? 'ease-out' : undefined,
    transitionDelay: withTransition && delay ? `${delay}s` : undefined,
    willChange: hidden ? 'opacity, transform' : undefined,
  }

  return (
    <Tag ref={ref} className={cn(className)} style={style} {...rest}>
      {children}
    </Tag>
  )
}

export default ScrollReveal
