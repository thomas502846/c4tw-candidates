'use client'

import React, { useEffect, useRef, useState } from 'react'

// Venn 衛星圓數值 Count Up（care 痛點數據：13.3萬／8+年／6成／45歲／5倍／前6個月）。
// 只動畫「數字片段」（big=true 的 run），中文單位（萬／年／成／歲／倍／前…個月）原樣保留。
// 滑入視窗後播放、約 1.5s、ease-out；尊重 reduced-motion → 直接定格終值。
type Run = { text: string; big: boolean }

// 把一個數字片段（可能含小數／+／%）解析成「可遞增的數值 + 原樣前後綴」。
// 例：'13.3' → {num:13.3, decimals:1}；'8+' → {num:8, suffix:'+'}；'前6' 走 big=false 不會進來。
const parseRun = (text: string): { num: number; decimals: number; prefix: string; suffix: string } | null => {
  const m = text.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!m) return null
  const numStr = m[2]
  const num = Number(numStr)
  if (Number.isNaN(num)) return null
  const dot = numStr.indexOf('.')
  return {
    num,
    decimals: dot >= 0 ? numStr.length - dot - 1 : 0,
    prefix: m[1] ?? '',
    suffix: m[3] ?? '',
  }
}

export const CountUpRuns: React.FC<{
  runs: Run[]
  bigSize: number
  smallSize: number
}> = ({ runs, bigSize, smallSize }) => {
  // 進度 0→1，套用到所有 big run 的數值
  const [progress, setProgress] = useState(0)
  const ref = useRef<SVGTSpanElement | null>(null)
  const playedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      setProgress(1)
      playedRef.current = true
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || playedRef.current) return
        playedRef.current = true
        const duration = 1500
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
          setProgress(eased)
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {runs.map((run, i) => {
        const parsed = run.big ? parseRun(run.text) : null
        const display = parsed
          ? `${parsed.prefix}${(parsed.num * progress).toFixed(parsed.decimals)}${parsed.suffix}`
          : run.text
        return (
          <tspan
            fontSize={run.big ? bigSize : smallSize}
            fontWeight={run.big ? 700 : 500}
            key={i}
            ref={i === 0 ? ref : undefined}
          >
            {display}
          </tspan>
        )
      })}
    </>
  )
}
