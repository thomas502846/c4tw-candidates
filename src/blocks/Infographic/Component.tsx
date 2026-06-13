import React from 'react'

import { Media } from '@/components/Media'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type InfographicStat = { value: string; label: string; id?: string | null }
export type InfographicPhoto = { image?: MediaDoc | string | number | null; id?: string | null }
export type InfographicNode = {
  icon?: MediaDoc | string | number | null
  title: string
  text?: string | null
  id?: string | null
}

export type InfographicBlockProps = {
  blockType: 'infographic'
  variant?: 'venn' | 'ring' | 'radial' | null
  eyebrow?: string | null
  title?: string | null
  body?: string | null
  leftLabel?: string | null
  rightLabel?: string | null
  leftStats?: InfographicStat[] | null
  rightStats?: InfographicStat[] | null
  photos?: InfographicPhoto[] | null
  nodes?: InfographicNode[] | null
}

/* ---------------------------------------------------------------- */
/* Venn：兩大圓微交疊＋左右各 3 顆衛星數據圓（care 306:606 SVG 重現） */
/* ---------------------------------------------------------------- */

/** 是否含 CJK：ZH 內容才用 Figma baked 圖（圖內文字為中文）；EN 退回 code 向量版以保 i18n */
const hasCjk = (s?: string | null): boolean => Boolean(s && /[㐀-鿿豈-﫿]/.test(s))

/** 把長 label 折行成 tspan（衛星圓內小字）：zh 依字數切、含空白的 latin 文字依單字累積 */
function wrapLabel(label: string, maxChars = 6): string[] {
  const lines: string[] = []
  if (/\s/.test(label.trim())) {
    let line = ''
    for (const word of label.split(/\s+/)) {
      if (line && (line + ' ' + word).length > 12) {
        lines.push(line)
        line = word
      } else {
        line = line ? `${line} ${word}` : word
      }
    }
    if (line) lines.push(line)
  } else {
    for (let i = 0; i < label.length; i += maxChars) lines.push(label.slice(i, i + maxChars))
  }
  return lines.slice(0, 3)
}

/** 大圓標題：「個人生活影響」→ 主標「個人生活」＋字距拉開的「影響」副行（care 306:606） */
function splitImpactLabel(label: string): { main: string; sub?: string } {
  if (label.length > 2 && label.endsWith('影響')) {
    return { main: label.slice(0, -2), sub: '影響' }
  }
  return { main: label }
}

/** 衛星圓數值拆 runs：數字段大字、中文單位小字（如 13.3萬／前6個月／8+年） */
function valueRuns(value: string): { text: string; big: boolean }[] {
  const runs: { text: string; big: boolean }[] = []
  for (const ch of value) {
    const big = /[0-9.+%]/.test(ch)
    const last = runs[runs.length - 1]
    if (last && last.big === big) last.text += ch
    else runs.push({ text: ch, big })
  }
  return runs
}

/** 衛星圓：數值（大小字混排）置中＋下方 label 折行 */
const SatelliteText: React.FC<{
  cx: number
  cy: number
  value: string
  label: string
  color: string
}> = ({ cx, cy, value, label, color }) => {
  const lines = wrapLabel(label)
  const lineH = 15
  const valueY = cy - (lines.length * lineH) / 2 + 8
  return (
    <>
      <text fill={color} fontSize="28" fontWeight="700" textAnchor="middle" x={cx} y={valueY}>
        {valueRuns(value).map((run, i) => (
          <tspan fontSize={run.big ? 28 : 14} fontWeight={run.big ? 700 : 500} key={i}>
            {run.text}
          </tspan>
        ))}
      </text>
      <text fill={color} fontSize="12" textAnchor="middle" x={cx} y={valueY + 22}>
        {lines.map((line, li) => (
          <tspan dy={li === 0 ? 0 : lineH} key={li} x={cx}>
            {line}
          </tspan>
        ))}
      </text>
    </>
  )
}

/** 大圓標題＋「影響」副行 */
const BigCircleLabel: React.FC<{ x: number; label: string }> = ({ x, label }) => {
  const { main, sub } = splitImpactLabel(label)
  return (
    <>
      <text fill="#212121" fontSize="28" fontWeight="700" letterSpacing="4" textAnchor="middle" x={x} y={sub ? 282 : 290}>
        {main}
      </text>
      {sub && (
        <text fill="#212121" fontSize="17" fontWeight="500" letterSpacing="8" textAnchor="middle" x={x + 4} y={316}>
          {sub}
        </text>
      )}
    </>
  )
}

const SAT_LEFT = [
  { cx: 150, cy: 95 },
  { cx: 88, cy: 245 },
  { cx: 150, cy: 395 },
]
const SAT_RIGHT = [
  { cx: 712, cy: 95 },
  { cx: 774, cy: 245 },
  { cx: 712, cy: 395 },
]

const Venn: React.FC<{
  leftLabel?: string | null
  rightLabel?: string | null
  leftStats?: InfographicStat[] | null
  rightStats?: InfographicStat[] | null
}> = ({ leftLabel, rightLabel, leftStats, rightStats }) => (
  <svg
    aria-label={`${leftLabel ?? ''}／${rightLabel ?? ''} 痛點數據圖`}
    className="mx-auto h-auto w-full max-w-[822px]"
    role="img"
    viewBox="0 0 862 490"
  >
    {/* 右大圓（職場角色，淡青 無邊框） */}
    <circle cx="555" cy="245" fill="#ECF7F9" r="180" />
    {/* 左大圓（個人生活，米底＋亮綠細邊） */}
    <circle cx="318" cy="245" fill="#F7F7EB" r="155" stroke="#ADCB59" strokeWidth="2" />
    {/* 左圓 icon：房屋線稿 */}
    <g fill="none" stroke="#ADCB59" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5">
      <path d="M288 205l30-26 30 26M294 202v34h48v-34" />
    </g>
    {leftLabel && <BigCircleLabel label={leftLabel} x={318} />}
    {/* 右圓 icon：手提包線稿 */}
    <g fill="none" stroke="#5E8C8C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5">
      <rect height="34" rx="6" width="56" x="527" y="200" />
      <path d="M545 200v-8a10 10 0 0 1 20 0v8" />
    </g>
    {rightLabel && <BigCircleLabel label={rightLabel} x={555} />}
    {/* 衛星數據圓 */}
    {(leftStats ?? []).slice(0, 3).map((stat, i) => {
      const pos = SAT_LEFT[i]
      return (
        <g key={stat.id ?? `l${i}`}>
          <circle cx={pos.cx} cy={pos.cy} fill="#FFFFFF" r="64" stroke="#ADCB59" strokeWidth="2" />
          <SatelliteText color="#9C9F33" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} />
        </g>
      )
    })}
    {(rightStats ?? []).slice(0, 3).map((stat, i) => {
      const pos = SAT_RIGHT[i]
      return (
        <g key={stat.id ?? `r${i}`}>
          <circle cx={pos.cx} cy={pos.cy} fill="#ECF7F9" r="64" />
          <SatelliteText color="#5E8C8C" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} />
        </g>
      )
    })}
  </svg>
)

/* ---------------------------------------------------------------- */
/* Ring：#8BA98B 粗 donut＋4 照片圓（45° 對角，school 341:652）       */
/* ---------------------------------------------------------------- */

// 環帶中心半徑 ≈ 37%；45° 對角 → offset ≈ 26.2%
const RING_POS = [
  { left: '76.2%', top: '23.8%' }, // 右上
  { left: '76.2%', top: '76.2%' }, // 右下
  { left: '23.8%', top: '76.2%' }, // 左下
  { left: '23.8%', top: '23.8%' }, // 左上
]

const Ring: React.FC<{ photos?: InfographicPhoto[] | null }> = ({ photos }) => (
  <div className="relative mx-auto aspect-square w-full max-w-[470px]">
    {/* donut：Figma 真圖向量（school-ring-donut.svg / 55:257），even-odd 外466內226 #8BA98B */}
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full"
      fill="none"
      viewBox="0 0 466 466"
    >
      <path
        d="M233 0C361.682 0 466 104.318 466 233C466 361.682 361.682 466 233 466C104.318 466 0 361.682 0 233C0 104.318 104.318 0 233 0ZM232.539 119.724C170.233 119.724 119.724 170.233 119.724 232.539C119.724 294.846 170.233 345.355 232.539 345.355C294.846 345.355 345.355 294.846 345.355 232.539C345.355 170.233 294.846 119.724 232.539 119.724Z"
        fill="#8BA98B"
        fillRule="evenodd"
      />
    </svg>
    {(photos ?? []).slice(0, 4).map((photo, i) => (
      <div
        className="absolute h-[39%] w-[39%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#D9D9D9]"
        key={photo.id ?? i}
        style={RING_POS[i]}
      >
        {photo.image && typeof photo.image === 'object' && (
          <Media resource={photo.image} imgClassName="h-full w-full object-cover" />
        )}
      </div>
    ))}
  </div>
)

/* ---------------------------------------------------------------- */
/* Radial：4 顆米色大圓菱形排列（training 306:609，無中心圓）          */
/* ---------------------------------------------------------------- */

const RADIAL_POS = [
  { left: '50%', top: '26%' }, // 上
  { left: '26%', top: '50%' }, // 左
  { left: '74%', top: '50%' }, // 右
  { left: '50%', top: '74%' }, // 下
]

const NodeIcon: React.FC<{ node: InfographicNode }> = ({ node }) => {
  if (node.icon && typeof node.icon === 'object') {
    return (
      <span className="block h-12 w-12 md:h-14 md:w-14">
        <Media resource={node.icon} imgClassName="h-full w-full object-contain" />
      </span>
    )
  }
  return (
    <span aria-hidden className="flex h-12 w-12 items-center justify-center md:h-14 md:w-14">
      <span className="h-3/4 w-3/4 rounded-full border-[3px] border-brand-lime" />
    </span>
  )
}

const Radial: React.FC<{ nodes?: InfographicNode[] | null }> = ({ nodes }) => {
  const list = (nodes ?? []).slice(0, 4)
  return (
    <>
      {/* 桌機：菱形排列 */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-[560px] md:block">
        {list.map((node, i) => (
          <div
            className="absolute flex h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-full bg-brand-surface px-8 text-center"
            key={node.id ?? i}
            style={RADIAL_POS[i]}
          >
            <NodeIcon node={node} />
            <h3 className="text-lg font-bold tracking-[0.05em] text-brand-ink md:text-[20px]">{node.title}</h3>
            {node.text && <p className="text-[13px] leading-[1.5] text-brand-ink/80">{node.text}</p>}
          </div>
        ))}
      </div>
      {/* 行動版：2×2 圓角卡 */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {list.map((node, i) => (
          <div
            className="flex flex-col items-center gap-2 rounded-[30px] bg-brand-surface px-4 py-6 text-center"
            key={node.id ?? i}
          >
            <NodeIcon node={node} />
            <h3 className="text-base font-bold text-brand-ink">{node.title}</h3>
            {node.text && <p className="text-xs leading-[1.5] text-brand-ink/80">{node.text}</p>}
          </div>
        ))}
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- */
/* Block                                                              */
/* ---------------------------------------------------------------- */

const Eyebrow: React.FC<{ text: string }> = ({ text }) => (
  <p className="mb-4 flex items-center gap-2.5 text-base tracking-[0.1em] text-brand-muted">
    <span aria-hidden className="inline-block h-[15px] w-[15px] shrink-0 rounded-full bg-brand-highlight" />
    {text}
  </p>
)

/**
 * ring 變體（school 我們看見的問題）的內文逐行渲染：
 * 帶列點記號（・/•/－/「1.」）的行 → 記號照原文保留、導語（至第一個全形冒號）加粗；
 * 其餘行維持一般段落。文字本身逐字照 Sheet，不改寫。
 */
const RingBody: React.FC<{ body: string }> = ({ body }) => (
  <div className="space-y-3 text-base leading-[1.85] tracking-[0.1em] text-brand-ink">
    {body.split('\n').map((rawLine, i) => {
      const line = rawLine.trim()
      if (!line) return null
      const m = line.match(/^([・•－]|\d+\.)\s*([^：]+：)(.*)$/)
      if (m) {
        return (
          <p className="flex gap-1.5" key={i}>
            <span aria-hidden className="shrink-0">
              {m[1] === '－' || m[1] === '•' ? '・' : m[1]}
            </span>
            <span>
              <span className="font-bold">{m[2]}</span>
              {m[3]}
            </span>
          </p>
        )
      }
      return <p key={i}>{line}</p>
    })}
  </div>
)

export const InfographicBlock: React.FC<InfographicBlockProps> = (props) => {
  const { variant, eyebrow, title, body } = props
  const isRing = variant === 'ring'

  // ZH 版直接落地 Figma baked 設計圖（306:606 Venn／306:609 放射圖，含全部數據文字）；
  // EN 版圖內中文不適用，退回等價的 code 向量版（用 stats/nodes 文字重繪）。
  const figure = isRing ? (
    <Ring photos={props.photos} />
  ) : variant === 'radial' ? (
    hasCjk(props.nodes?.[0]?.title) ? (
      <img
        alt={props.title ?? '組織培力痛點放射圖'}
        className="mx-auto h-auto w-full max-w-[600px]"
        src="/figma/training-radial.png"
      />
    ) : (
      <Radial nodes={props.nodes} />
    )
  ) : hasCjk(props.leftLabel) ? (
    <img
      alt={`${props.leftLabel ?? ''}／${props.rightLabel ?? ''} 痛點數據圖`}
      className="mx-auto h-auto w-full max-w-[822px]"
      src="/figma/care-venn.png"
    />
  ) : (
    <Venn
      leftLabel={props.leftLabel}
      leftStats={props.leftStats}
      rightLabel={props.rightLabel}
      rightStats={props.rightStats}
    />
  )

  const hasText = Boolean(title || body)

  const inner = hasText ? (
    <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
      <div className="md:w-[45%]">
        {eyebrow && <Eyebrow text={eyebrow} />}
        {title && (
          <h2 className="mb-5 text-[26px] font-bold leading-[1.6] tracking-[0.15em] text-brand-green md:text-4xl md:leading-[1.65]">
            {title}
          </h2>
        )}
        {body &&
          (isRing ? (
            <RingBody body={body} />
          ) : (
            <p className={cn('whitespace-pre-line text-base leading-[1.85] tracking-[0.1em] text-brand-ink')}>
              {body}
            </p>
          ))}
      </div>
      <div className="md:w-[55%]">{figure}</div>
    </div>
  ) : (
    figure
  )

  // ring（school problem-bg 55:249）＝滿版米色帶；其餘變體維持白底 container
  if (isRing) {
    // 底色帶不加效果，僅內容進場 Fade In（Tracy：底色不加效果）
    return (
      <section className="bg-brand-surface py-14 md:py-24" data-block="infographic">
        <ScrollReveal as="div" variant="in" className="container max-w-[1240px]">
          {inner}
        </ScrollReveal>
      </section>
    )
  }

  return (
    <ScrollReveal as="section" variant="in" className="container max-w-[1240px]" data-block="infographic">
      {inner}
    </ScrollReveal>
  )
}
