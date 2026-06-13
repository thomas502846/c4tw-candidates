'use client'

import React, { useEffect, useRef, useState } from 'react'

type StatCard = {
  number: string
  label: string
  suffix?: string | null
  id?: string | null
}

// 從 number 字串拆出可動畫的整數部分與其餘文字（如 "10" → 10；"1,200" → 1200）
const parseNumeric = (raw: string): { target: number | null; prefix: string; suffixText: string } => {
  const match = raw.match(/^(\D*)([\d,]+)(\D*)$/)
  if (!match) return { target: null, prefix: '', suffixText: '' }
  const target = Number(match[2].replaceAll(',', ''))
  if (Number.isNaN(target)) return { target: null, prefix: '', suffixText: '' }
  return { target, prefix: match[1] ?? '', suffixText: match[3] ?? '' }
}

const formatWithCommas = (n: number, hasComma: boolean): string =>
  hasComma ? n.toLocaleString('en-US') : String(n)

// Count Up 動態數字（Tracy node 27:61）：進入視窗後播放、約 1.5s、ease-out
const CountUpNumber: React.FC<{ card: StatCard }> = ({ card }) => {
  const { target, prefix, suffixText } = parseNumeric(card.number)
  const ref = useRef<HTMLParagraphElement | null>(null)
  const [value, setValue] = useState<number>(target ?? 0)
  const playedRef = useRef(false)
  const hasComma = card.number.includes(',')

  useEffect(() => {
    if (target == null) return
    const el = ref.current
    if (!el) return

    // 尊重使用者「減少動態」偏好：直接定格
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      setValue(target)
      playedRef.current = true
      return
    }

    setValue(0)
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
          setValue(Math.round(eased * target))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <p
      className="text-[32px] font-bold tracking-[0.08em] text-brand-green md:text-[40px]"
      ref={ref}
    >
      {target == null ? (
        card.number
      ) : (
        <>
          {prefix}
          {formatWithCommas(value, hasComma)}
          {suffixText}
        </>
      )}
      {card.suffix && (
        <span className="align-baseline text-[28px] font-bold md:text-[36px]">{card.suffix}</span>
      )}
    </p>
  )
}

export const StatsCardsClient: React.FC<{ cards: StatCard[] }> = ({ cards }) => (
  <div className="mx-auto grid max-w-[1011px] grid-cols-2 gap-x-6 gap-y-10 py-6 md:grid-cols-4">
    {cards.map((card, i) => (
      <div className="text-center" key={card.id ?? i}>
        <CountUpNumber card={card} />
        <p className="mt-2 text-[15px] tracking-[0.1em] text-brand-ink md:text-[16px]">
          {card.label}
        </p>
      </div>
    ))}
  </div>
)
