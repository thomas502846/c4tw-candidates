import React from 'react'

import { Media } from '@/components/Media'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

import { CountUpRuns } from './CountUpRuns'

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

/** 把長 label 折行成 tspan（衛星圓內小字）：zh 依字數切、含空白的 latin 文字依單字累積。
 * Figma 86:363 衛星圓內 label 至多 2 行；超過則保留前 2 行（資料目前最長 9 字、2 行內可容）。*/
function wrapLabel(label: string, maxChars = 7): string[] {
  const lines: string[] = []
  if (/\s/.test(label.trim())) {
    let line = ''
    for (const word of label.split(/\s+/)) {
      if (line && (line + ' ' + word).length > 13) {
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
  return lines.slice(0, 2)
}

/** 大圓標題：「個人生活影響」→ 主標「個人生活」＋字距拉開的「影響」副行（care 306:606） */
function splitImpactLabel(label: string): { main: string; sub?: string } {
  if (label.length > 2 && label.endsWith('影響')) {
    return { main: label.slice(0, -2), sub: '影響' }
  }
  return { main: label }
}

/** 衛星圓數值拆 runs：數字段大字、中文單位小字（如 13.3萬／前6個月／45-49歲）。
 * 連字號／波浪號視為數字段的一部分（區間如 45-49 整段大字，對齊 Figma 86:363）。*/
function valueRuns(value: string): { text: string; big: boolean }[] {
  const runs: { text: string; big: boolean }[] = []
  for (const ch of value) {
    const big = /[0-9.+%~-]/.test(ch)
    const last = runs[runs.length - 1]
    if (last && last.big === big) last.text += ch
    else runs.push({ text: ch, big })
  }
  return runs
}

/** 衛星圓（Figma 86:363）：上方深色 label（≤2 行）＋下方大字數值（sage 綠，數字大／中文單位小）。
 * 字級依大圓尺寸縮放，確保整塊文字落在圓內、不壓字。bigSize/labelSize 由呼叫端按桌機/行動帶入。*/
const SatelliteText: React.FC<{
  cx: number
  cy: number
  value: string
  label: string
  color: string
  bigSize?: number
  labelSize?: number
}> = ({ cx, cy, value, label, color, bigSize = 26, labelSize = 12 }) => {
  const lines = wrapLabel(label)
  const labelLineH = labelSize + 3
  // 區塊高度＝label 多行 + 間距 + 數值高，整體垂直置中於圓心
  const blockH = lines.length * labelLineH + 8 + bigSize
  const labelTop = cy - blockH / 2 + labelSize
  const valueBaseline = labelTop + (lines.length - 1) * labelLineH + 8 + bigSize
  return (
    <>
      <text fill="#212121" fontSize={labelSize} fontWeight="500" textAnchor="middle" x={cx} y={labelTop}>
        {lines.map((line, li) => (
          <tspan dy={li === 0 ? 0 : labelLineH} key={li} x={cx}>
            {line}
          </tspan>
        ))}
      </text>
      <text fill={color} fontSize={bigSize} fontWeight="700" textAnchor="middle" x={cx} y={valueBaseline}>
        {/* 數字片段滑入視窗後 Count Up；中文單位（萬／年／成／歲／倍／個月）原樣小字保留 */}
        <CountUpRuns bigSize={bigSize} runs={valueRuns(value)} smallSize={Math.round(bigSize * 0.5)} />
      </text>
    </>
  )
}

/** 大圓標題＋「影響」副行 */
const BigCircleLabel: React.FC<{ x: number; label: string }> = ({ x, label }) => {
  const { main, sub } = splitImpactLabel(label)
  return (
    <>
      <text fill="#212121" fontSize="30" fontWeight="700" letterSpacing="4" textAnchor="middle" x={x} y={sub ? 250 : 240}>
        {main}
      </text>
      {sub && (
        <text fill="#212121" fontSize="18" fontWeight="500" letterSpacing="8" textAnchor="middle" x={x + 4} y={284}>
          {sub}
        </text>
      )}
    </>
  )
}

// Figma 86:363：兩大圓近等徑、重疊較深、衛星圓貼住外弧（非外撐）
const SAT_R = 62
const SAT_LEFT = [
  { cx: 219, cy: 68 }, // 左上
  { cx: 140, cy: 230 }, // 左
  { cx: 219, cy: 392 }, // 左下
]
const SAT_RIGHT = [
  { cx: 681, cy: 68 }, // 右上
  { cx: 760, cy: 230 }, // 右
  { cx: 681, cy: 392 }, // 右下
]

// 行動版（M-care 218:856）：兩大圓改垂直堆疊（個人生活在上、職場角色在下），
// 衛星圓貼外弧、數字放大可讀。viewBox 直式 460×820。
const M_BIG_R = 150
const M_TOP = { cx: 230, cy: 200 } // 個人生活影響（上）
const M_BOT = { cx: 230, cy: 580 } // 職場角色影響（下）
const M_SAT_R = 66
// 上圓衛星：左上、左、左下三顆貼外弧
const M_SAT_TOP = [
  { cx: 90, cy: 70 },
  { cx: 60, cy: 230 },
  { cx: 110, cy: 380 },
]
// 下圓衛星：右上、右、右下三顆貼外弧
const M_SAT_BOT = [
  { cx: 370, cy: 410 },
  { cx: 410, cy: 560 },
  { cx: 360, cy: 710 },
]

/** 行動版大圓標題（直式，字級加大） */
const MBigCircleLabel: React.FC<{ cx: number; cy: number; label: string }> = ({ cx, cy, label }) => {
  const { main, sub } = splitImpactLabel(label)
  return (
    <>
      <text fill="#212121" fontSize="32" fontWeight="700" letterSpacing="4" textAnchor="middle" x={cx} y={sub ? cy + 4 : cy + 12}>
        {main}
      </text>
      {sub && (
        <text fill="#212121" fontSize="20" fontWeight="500" letterSpacing="8" textAnchor="middle" x={cx + 4} y={cy + 40}>
          {sub}
        </text>
      )}
    </>
  )
}

const VennMobile: React.FC<{
  leftLabel?: string | null
  rightLabel?: string | null
  leftStats?: InfographicStat[] | null
  rightStats?: InfographicStat[] | null
}> = ({ leftLabel, rightLabel, leftStats, rightStats }) => (
  <svg
    aria-label={`${leftLabel ?? ''}／${rightLabel ?? ''} 痛點數據圖`}
    className="mx-auto h-auto w-full max-w-[440px] md:hidden"
    role="img"
    viewBox="0 0 460 820"
  >
    {/* 下大圓（職場角色，淡青底＋亮綠細邊，與上圓對稱；Figma 86:363） */}
    <circle cx={M_BOT.cx} cy={M_BOT.cy} fill="#ECF7F9" r={M_BIG_R} stroke="#ADCB59" strokeWidth="2" />
    {/* 上大圓（個人生活，米底＋亮綠細邊） */}
    <circle cx={M_TOP.cx} cy={M_TOP.cy} fill="#F7F7EB" r={M_BIG_R} stroke="#ADCB59" strokeWidth="2" />
    {/* 上圓 icon：房屋線稿 */}
    <g fill="none" stroke="#ADCB59" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5">
      <path d={`M${M_TOP.cx - 30} ${M_TOP.cy - 72}l30-26 30 26M${M_TOP.cx - 24} ${M_TOP.cy - 75}v34h48v-34`} />
    </g>
    {leftLabel && <MBigCircleLabel cx={M_TOP.cx} cy={M_TOP.cy} label={leftLabel} />}
    {/* 下圓 icon：手提包線稿 */}
    <g fill="none" stroke="#5E8C8C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5">
      <rect height="34" rx="6" width="56" x={M_BOT.cx - 28} y={M_BOT.cy - 75} />
      <path d={`M${M_BOT.cx - 10} ${M_BOT.cy - 75}v-8a10 10 0 0 1 20 0v8`} />
    </g>
    {rightLabel && <MBigCircleLabel cx={M_BOT.cx} cy={M_BOT.cy} label={rightLabel} />}
    {/* 上圓衛星數據圓 */}
    {(leftStats ?? []).slice(0, 3).map((stat, i) => {
      const pos = M_SAT_TOP[i]
      return (
        <g key={stat.id ?? `ml${i}`}>
          <circle cx={pos.cx} cy={pos.cy} fill="#F7F7EB" r={M_SAT_R} stroke="#ADCB59" strokeWidth="2" />
          <SatelliteText bigSize={26} color="#7DAA8B" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} />
        </g>
      )
    })}
    {/* 下圓衛星數據圓 */}
    {(rightStats ?? []).slice(0, 3).map((stat, i) => {
      const pos = M_SAT_BOT[i]
      return (
        <g key={stat.id ?? `mr${i}`}>
          <circle cx={pos.cx} cy={pos.cy} fill="#ECF7F9" r={M_SAT_R} stroke="#ADCB59" strokeWidth="2" />
          <SatelliteText bigSize={26} color="#7DAA8B" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} />
        </g>
      )
    })}
  </svg>
)

const Venn: React.FC<{
  leftLabel?: string | null
  rightLabel?: string | null
  leftStats?: InfographicStat[] | null
  rightStats?: InfographicStat[] | null
}> = ({ leftLabel, rightLabel, leftStats, rightStats }) => (
  <svg
    aria-label={`${leftLabel ?? ''}／${rightLabel ?? ''} 痛點數據圖`}
    className="mx-auto hidden h-auto w-full max-w-[900px] md:block"
    role="img"
    viewBox="0 0 900 460"
  >
    {/* 右大圓（職場角色，淡青底＋亮綠細邊，與左圓對稱；Figma 86:363 量到 stroke #ACCB59） */}
    <circle cx="555" cy="230" fill="#ECF7F9" r="170" stroke="#ADCB59" strokeWidth="2" />
    {/* 左大圓（個人生活，米底＋亮綠細邊） */}
    <circle cx="345" cy="230" fill="#F7F7EB" r="170" stroke="#ADCB59" strokeWidth="2" />
    {/* 左圓 icon：房屋線稿 */}
    <g fill="none" stroke="#ADCB59" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5">
      <path d="M315 168l30-26 30 26M321 165v34h48v-34" />
    </g>
    {leftLabel && <BigCircleLabel label={leftLabel} x={345} />}
    {/* 右圓 icon：手提包線稿 */}
    <g fill="none" stroke="#5E8C8C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5">
      <rect height="34" rx="6" width="56" x="527" y="165" />
      <path d="M545 165v-8a10 10 0 0 1 20 0v8" />
    </g>
    {rightLabel && <BigCircleLabel label={rightLabel} x={555} />}
    {/* 衛星數據圓 */}
    {(leftStats ?? []).slice(0, 3).map((stat, i) => {
      const pos = SAT_LEFT[i]
      return (
        <g key={stat.id ?? `l${i}`}>
          <circle cx={pos.cx} cy={pos.cy} fill="#F7F7EB" r={SAT_R} stroke="#ADCB59" strokeWidth="2" />
          <SatelliteText bigSize={26} color="#7DAA8B" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} />
        </g>
      )
    })}
    {(rightStats ?? []).slice(0, 3).map((stat, i) => {
      const pos = SAT_RIGHT[i]
      return (
        <g key={stat.id ?? `r${i}`}>
          <circle cx={pos.cx} cy={pos.cy} fill="#ECF7F9" r={SAT_R} stroke="#ADCB59" strokeWidth="2" />
          <SatelliteText bigSize={26} color="#7DAA8B" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} />
        </g>
      )
    })}
  </svg>
)

/* ---------------------------------------------------------------- */
/* Ring（school 我們看見的問題 341:652 / pic 566:1016）：              */
/* 2026-06-16 Tracy 改版——原環形 donut＋4 照片圓改為「單張圓角照片」  */
/* （Figma pic 590×400、radius 30）。照片待提供→灰 #D9D9D9 placeholder， */
/* 有 photos[0]（Media）則顯示其圖。其餘變體不受影響（ring 僅 school 用）。*/
/* ---------------------------------------------------------------- */

const Ring: React.FC<{ photos?: InfographicPhoto[] | null }> = ({ photos }) => {
  const photo = (photos ?? [])[0]
  const img = photo?.image
  return (
    <div className="mx-auto aspect-[590/400] w-full max-w-[590px] overflow-hidden rounded-[30px] bg-[#D9D9D9]">
      {img && typeof img === 'object' && (
        <Media resource={img} imgClassName="h-full w-full object-cover" />
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Radial：4 顆米色大圓菱形排列（training 306:609，無中心圓）          */
/* ---------------------------------------------------------------- */

const RADIAL_POS = [
  { left: '50%', top: '26%' }, // 上
  { left: '26%', top: '50%' }, // 左
  { left: '74%', top: '50%' }, // 右
  { left: '50%', top: '74%' }, // 下
]

/**
 * 放射節點 fallback 線稿 icon（training 306:609 / M-training 第2屏）：
 * 依節點序對應 擴音器/人形/建築/手 四款，與 Figma 圓內 icon 一致。
 * 桌機用 baked PNG 故無此 fallback；此處主要服務行動版 RadialStack。
 */
// 線稿重繪，對齊 Figma 真圖（node 306:609，2026-06-14 MCP 抽圖核對）：
// 主色橄欖綠 #ADCB59（Figma 量到 #ACCA59）、手部袖口橘 #FF681F、新芽葉片填色。
// Figma 來源為 baked PNG（無向量），故依視覺忠實重繪為可縮放線稿（桌機菱形與行動版直列共用）。
const RADIAL_NODE_ICONS = [
  // 0 高齡化需求增加 → 擴音器 megaphone
  <path
    d="M10 20v8a3 3 0 0 0 3 3h2l16 7V10L15 17h-2a3 3 0 0 0-3 3ZM33 19a8 8 0 0 1 0 10M16 31v5a3 3 0 0 0 6 0v-3"
    key="0"
  />,
  // 1 照顧人才不足 → 三人群聚＋放大鏡（人才搜尋）
  <React.Fragment key="1">
    <circle cx="17" cy="18" r="4" key="h1" />
    <circle cx="27" cy="18" r="4" key="h2" />
    <circle cx="22" cy="12.5" r="4" key="h3" />
    <path
      d="M10.5 31c0-5 3.3-8.3 7.5-8.3M33.5 31c0-5-3.3-8.3-7.5-8.3M16.5 29.5c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6"
      key="b"
    />
    <circle cx="31" cy="30" r="6" key="m" />
    <path d="M35.5 34.5l5 5" key="mh" />
  </React.Fragment>,
  // 2 偏鄉資源落差 → 兩棟建築（其一橘窗點綴）
  <React.Fragment key="2">
    <path d="M9 40V19a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v21" key="a" />
    <path d="M22 40V26a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" key="bb" />
    <path d="M7 40h34" key="g" />
    <path d="M13 23h4M13 28h4M13 33h4" key="wa" />
    <path d="M26 29h4M26 34h4" stroke="#FF681F" key="wb" />
  </React.Fragment>,
  // 3 在地培力不易 → 手捧新芽（橘袖口＋綠葉）
  <React.Fragment key="3">
    <path d="M11 26c1 7 6 12 13 12s12-5 13-12" key="palm" />
    <path d="M21 38v3.5M27 38v3.5" key="arm" />
    <path d="M20 41.5h8" stroke="#FF681F" strokeWidth="3.2" key="cuff" />
    <path d="M24 26V15" key="stem" />
    <path d="M24 20c-1.2-4-4.2-6.3-8-6.3-.2 3.9 2.8 6.3 8 6.3Z" fill="#ADCB59" stroke="none" key="lf" />
    <path d="M24 17.5c.2-4 2.6-6.8 6.5-7.2.2 3.9-2.4 6.8-6.5 7.2Z" fill="#ADCB59" stroke="none" key="rf" />
  </React.Fragment>,
]

const NodeIcon: React.FC<{ node: InfographicNode; index?: number }> = ({ node, index = 0 }) => {
  if (node.icon && typeof node.icon === 'object') {
    return (
      <span className="block h-12 w-12 md:h-14 md:w-14">
        <Media resource={node.icon} imgClassName="h-full w-full object-contain" />
      </span>
    )
  }
  const icon = RADIAL_NODE_ICONS[index % RADIAL_NODE_ICONS.length]
  return (
    <svg
      aria-hidden
      className="h-12 w-12 md:h-14 md:w-14"
      fill="none"
      stroke="#ADCB59"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      viewBox="0 0 48 48"
    >
      {icon}
    </svg>
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
            <NodeIcon index={i} node={node} />
            <h3 className="text-lg font-bold tracking-[0.05em] text-brand-ink md:text-[20px]">{node.title}</h3>
            {node.text && <p className="text-[13px] leading-[1.5] text-brand-ink/80">{node.text}</p>}
          </div>
        ))}
      </div>
      {/* 行動版：單欄直列（cmt-07：mobile 不沿用桌機菱形群聚） */}
      <RadialStack nodes={list} />
    </>
  )
}

/**
 * 行動版 radial 單欄直列（M-training 306:609 mobile / cmt-07「箭頭指向 與 Desktop版本不同」）：
 * 每項＝淺米圓底，置中 icon＋粗標＋副標，由上而下堆疊並略相疊（-mt 製造圓相切），
 * 取代桌機的環形群聚。ZH/EN 共用此 stack（文字來自 nodes，i18n 通用）。
 */
const RadialStack: React.FC<{ nodes: InfographicNode[] }> = ({ nodes }) => (
  <div className="mx-auto flex max-w-[300px] flex-col items-center md:hidden">
    {nodes.map((node, i) => (
      <div
        className={cn(
          'flex aspect-square w-[240px] flex-col items-center justify-center gap-2 rounded-full bg-brand-surface px-8 text-center',
          i > 0 && '-mt-5',
        )}
        key={node.id ?? i}
      >
        <NodeIcon index={i} node={node} />
        <h3 className="text-lg font-bold tracking-[0.05em] text-brand-ink">{node.title}</h3>
        {node.text && <p className="text-[13px] leading-[1.5] text-brand-ink/80">{node.text}</p>}
      </div>
    ))}
  </div>
)

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
      // ZH：桌機沿用 Figma baked 放射圖（含中文 icon＋文字）；行動版改單欄直列
      // （cmt-07：mobile 箭頭/排版與 desktop 不同，不可把群聚 PNG 縮塞進窄屏）
      <>
        <img
          alt={props.title ?? '組織培力痛點放射圖'}
          className="mx-auto hidden h-auto w-full max-w-[600px] md:block"
          src="/figma/training-radial.png"
        />
        <RadialStack nodes={(props.nodes ?? []).slice(0, 4)} />
      </>
    ) : (
      <Radial nodes={props.nodes} />
    )
  ) : (
    // ZH/EN 一律走向量 Venn（文字由 stats 即時繪製）：較 baked PNG 更貼 Figma 比例且 i18n 通用
    // 桌機橫式雙圓、行動版直式堆疊（M-care 218:856）
    <>
      <VennMobile
        leftLabel={props.leftLabel}
        leftStats={props.leftStats}
        rightLabel={props.rightLabel}
        rightStats={props.rightStats}
      />
      <Venn
        leftLabel={props.leftLabel}
        leftStats={props.leftStats}
        rightLabel={props.rightLabel}
        rightStats={props.rightStats}
      />
    </>
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
