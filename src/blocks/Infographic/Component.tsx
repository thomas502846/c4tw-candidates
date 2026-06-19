import React from 'react'

import { Media } from '@/components/Media'
import FramedImage from '@/components/Media/FramedImage'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

import { CountUpRuns } from './CountUpRuns'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type InfographicStat = { value: string; label: string; id?: string | null }
export type InfographicPhoto = {
  image?: MediaDoc | string | number | null
  framePos?: unknown
  id?: string | null
}
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
  valueTop?: boolean
}> = ({ cx, cy, value, label, color, bigSize = 26, labelSize = 12, valueTop = false }) => {
  const lines = wrapLabel(label)
  const labelLineH = labelSize + 3
  const labelH = (lines.length - 1) * labelLineH + labelSize
  // 區塊高度＝label 多行 + 間距 + 數值高，整體垂直置中於圓心
  const blockH = labelH + 8 + bigSize
  const top = cy - blockH / 2
  // valueTop：數值在上、label 在下（care venn 左側中／下兩顆）；否則 label 在上、數值在下
  const valueBaseline = valueTop ? top + bigSize : top + labelH + 8 + bigSize
  const labelTop = valueTop ? top + bigSize + 8 + labelSize : top + labelSize
  const labelEl = (
    <text fill="#212121" fontSize={labelSize} fontWeight="500" textAnchor="middle" x={cx} y={labelTop}>
      {lines.map((line, li) => (
        <tspan dy={li === 0 ? 0 : labelLineH} key={li} x={cx}>
          {line}
        </tspan>
      ))}
    </text>
  )
  const valueEl = (
    <text fill={color} fontSize={bigSize} fontWeight="700" textAnchor="middle" x={cx} y={valueBaseline}>
      {/* 數字片段滑入視窗後 Count Up；中文單位（萬／年／成／歲／倍／個月）原樣小字保留 */}
      <CountUpRuns bigSize={bigSize} runs={valueRuns(value)} smallSize={Math.round(bigSize * 0.5)} />
    </text>
  )
  return valueTop ? (
    <>
      {valueEl}
      {labelEl}
    </>
  ) : (
    <>
      {labelEl}
      {valueEl}
    </>
  )
}

/* 痛點 venn 填色 icon（重繪自 612:636 baked 圖，供 EN 桌機向量版＋行動版用；
   ZH 桌機直接用 baked PNG）：綠填＋深色描邊＋橘色點綴，與 Figma 一致。 */
const ICON_GREEN = '#ADCB59'
const ICON_INK = '#333333'
const ICON_ORANGE = '#EA6A20'

/** 房屋：綠填牆＋屋頂、右上煙囪、左下門洞、右中橘色窗 */
const HouseIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g stroke={ICON_INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <rect fill={ICON_GREEN} height="38" width="50" x={cx - 25} y={cy - 4} />
    <path d={`M${cx - 33} ${cy - 2} L${cx} ${cy - 34} L${cx + 33} ${cy - 2} Z`} fill={ICON_GREEN} />
    <rect fill={ICON_GREEN} height="14" width="7" x={cx + 15} y={cy - 30} />
    <path d={`M${cx - 16} ${cy + 34} V${cy + 15} a6 6 0 0 1 12 0 V${cy + 34}`} fill="#F7F7EB" />
    <rect fill={ICON_ORANGE} height="13" width="13" x={cx + 3} y={cy + 8} />
  </g>
)

/** 公事包：綠上帶＋橘色雙鎖扣＋提把＋右下折角 */
const BagIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g stroke={ICON_INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d={`M${cx - 9} ${cy - 19} v-5 a9 9 0 0 1 18 0 v5`} fill="none" />
    <rect fill="#F7F7EB" height="40" rx="4" width="62" x={cx - 31} y={cy - 19} />
    <path d={`M${cx - 31} ${cy - 3} V${cy - 15} a4 4 0 0 1 4-4 h54 a4 4 0 0 1 4 4 V${cy - 3} Z`} fill={ICON_GREEN} />
    <rect fill={ICON_ORANGE} height="12" width="7" x={cx - 17} y={cy - 9} />
    <rect fill={ICON_ORANGE} height="12" width="7" x={cx + 10} y={cy - 9} />
    <path d={`M${cx + 13} ${cy + 15} h8 v-8`} fill="none" />
  </g>
)

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

/* ── 行動版 venn（HTML/CSS 重繪 Tracy 行動版設計 care-familycare(mobile)）──
   兩大圓垂直堆疊＋左右各 3 顆衛星圓，純 DOM 文字：清晰、可縮放、zh/en 共用一套。
   取代原 SVG 版（SVG 文字隨 viewBox 縮小在手機過小，客戶 2026-06-19 回報難讀）。
   座標為 360×545 設計框換算的百分比；容器固定該長寬比，子層用 left/top%＋translate 置中。 */
const M_SAT_LEFT_POS = [
  { left: '20%', top: '10.6%' }, // 上圓 左上
  { left: '12.2%', top: '32.3%' }, // 上圓 左
  { left: '25%', top: '54.7%' }, // 上圓 左下（近交疊）
]
const M_SAT_RIGHT_POS = [
  { left: '79.4%', top: '53.6%' }, // 下圓 右上（近交疊）
  { left: '87.8%', top: '74.9%' }, // 下圓 右
  { left: '79.4%', top: '91.7%' }, // 下圓 右下
]

/** 行動版填色房屋 icon（HTML 內嵌，固定尺寸） */
const HouseIconHtml: React.FC = () => (
  <svg aria-hidden className="h-[50px] w-[56px]" fill="none" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 56 50">
    <rect fill="#ADCB59" height="28" width="38" x="9" y="20" />
    <path d="M3 22 L28 1 L53 22 Z" fill="#ADCB59" />
    <rect fill="#ADCB59" height="12" width="6" x="36" y="6" />
    <rect fill="#EA6A20" height="11" width="11" x="24" y="30" />
  </svg>
)
/** 行動版填色公事包 icon（HTML 內嵌，固定尺寸） */
const BagIconHtml: React.FC = () => (
  <svg aria-hidden className="h-[48px] w-[58px]" fill="none" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 58 48">
    <path d="M20 12 v-3 a9 9 0 0 1 18 0 v3" fill="none" />
    <rect fill="#ffffff" height="32" rx="4" width="46" x="6" y="12" />
    <path d="M6 24 V16 a4 4 0 0 1 4-4 h38 a4 4 0 0 1 4 4 V24 Z" fill="#ADCB59" />
    <rect fill="#EA6A20" height="11" width="6" x="18" y="18" />
    <rect fill="#EA6A20" height="11" width="6" x="34" y="18" />
  </svg>
)

/** 衛星圓數值：數字大、單位（萬/年/成/歲/倍/%/yrs…）小（沿用 valueRuns 切分） */
const HtmlValue: React.FC<{ value: string }> = ({ value }) => (
  <span className="font-bold leading-none text-[#7DAA8B]">
    {valueRuns(value).map((r, i) => (
      <span className={r.big ? 'text-[26px]' : 'text-[13px]'} key={i}>
        {r.text}
      </span>
    ))}
  </span>
)

/** 大圓（個人生活影響／職場角色影響）：icon＋主標＋（中文才有的）「影響」副行 */
const MBigCircle: React.FC<{
  tone: 'cream' | 'cyan'
  top: string
  label?: string | null
  icon: React.ReactNode
  align: 'top' | 'bottom'
}> = ({ tone, top, label, icon, align }) => {
  const { main, sub } = label ? splitImpactLabel(label) : { main: '', sub: undefined }
  return (
    <div
      className={cn(
        'absolute left-1/2 flex aspect-square w-[76%] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-full border-2 border-brand-lime',
        align === 'top' ? 'justify-start pt-[19%]' : 'justify-end pb-[18%]',
      )}
      style={{ top, backgroundColor: tone === 'cream' ? '#F7F7EB' : '#ECF7F9' }}
    >
      {icon}
      <div className="mt-2 text-[26px] font-bold leading-none tracking-[0.04em] text-[#212121]">{main}</div>
      {sub && <div className="mt-1 text-[15px] font-medium tracking-[0.4em] text-[#212121]">{sub}</div>}
    </div>
  )
}

/** 衛星圓：標籤＋數值（valueTop 時數值在上、標籤在下，對齊 Tracy 行動版） */
const MSat: React.FC<{
  pos: { left: string; top: string }
  tone: 'cream' | 'cyan'
  stat: InfographicStat
  valueTop?: boolean
}> = ({ pos, tone, stat, valueTop }) => {
  const label = (
    <span className="text-[12px] font-medium leading-[1.25] text-[#333333]">{stat.label}</span>
  )
  const value = <HtmlValue value={stat.value} />
  return (
    <div
      className="absolute flex aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border-2 border-brand-lime px-1 text-center"
      style={{ left: pos.left, top: pos.top, backgroundColor: tone === 'cream' ? '#F7F7EB' : '#ECF7F9' }}
    >
      {valueTop ? value : label}
      {valueTop ? label : value}
    </div>
  )
}

const VennMobile: React.FC<{
  leftLabel?: string | null
  rightLabel?: string | null
  leftStats?: InfographicStat[] | null
  rightStats?: InfographicStat[] | null
}> = ({ leftLabel, rightLabel, leftStats, rightStats }) => (
  <div
    aria-label={`${leftLabel ?? ''}／${rightLabel ?? ''} 痛點數據圖`}
    className="relative mx-auto w-full max-w-[400px] md:hidden"
    role="img"
    style={{ aspectRatio: '360 / 545' }}
  >
    <MBigCircle align="top" icon={<HouseIconHtml />} label={leftLabel} tone="cream" top="27.5%" />
    <MBigCircle align="bottom" icon={<BagIconHtml />} label={rightLabel} tone="cyan" top="70.6%" />
    {(leftStats ?? []).slice(0, 3).map((stat, i) => (
      <MSat key={stat.id ?? `ml${i}`} pos={M_SAT_LEFT_POS[i]} stat={stat} tone="cream" valueTop={i > 0} />
    ))}
    {(rightStats ?? []).slice(0, 3).map((stat, i) => (
      <MSat key={stat.id ?? `mr${i}`} pos={M_SAT_RIGHT_POS[i]} stat={stat} tone="cyan" />
    ))}
  </div>
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
    {/* 左圓 icon：填色房屋 */}
    <HouseIcon cx={345} cy={185} />
    {leftLabel && <BigCircleLabel label={leftLabel} x={345} />}
    {/* 右圓 icon：填色公事包 */}
    <BagIcon cx={555} cy={185} />
    {rightLabel && <BigCircleLabel label={rightLabel} x={555} />}
    {/* 衛星數據圓（左側中／下兩顆數值在上、label 在下，對齊 612:636） */}
    {(leftStats ?? []).slice(0, 3).map((stat, i) => {
      const pos = SAT_LEFT[i]
      return (
        <g key={stat.id ?? `l${i}`}>
          <circle cx={pos.cx} cy={pos.cy} fill="#F7F7EB" r={SAT_R} stroke="#ADCB59" strokeWidth="2" />
          <SatelliteText bigSize={26} color="#7DAA8B" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} valueTop={i > 0} />
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
    <div className="relative mx-auto aspect-[590/400] w-full max-w-[590px] overflow-hidden rounded-[30px] bg-[#D9D9D9]">
      {img && typeof img === 'object' && (
        <FramedImage id={photo?.id ?? 0} resource={img} framePos={photo?.framePos} />
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
      // ZH：桌機/行動版皆用 Tracy baked 放射圖（含中文 icon＋文字）。
      // 行動版原為向量單欄直列（RadialStack），但內文在手機過小難讀（客戶 6-19 回報），
      // 改用 Tracy 提供的行動版圖（直式 535×1930）。EN 仍退回向量版（baked 圖內為中文，不適用 i18n）。
      <>
        <img
          alt={props.title ?? '組織培力痛點放射圖'}
          className="mx-auto hidden h-auto w-full max-w-[600px] md:block"
          src="/figma/training-radial-desktop.webp"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={props.title ?? '組織培力痛點放射圖'}
          className="mx-auto h-auto w-full max-w-[320px] md:hidden"
          src="/figma/training-radial-mobile.webp"
        />
      </>
    ) : (
      <Radial nodes={props.nodes} />
    )
  ) : (
    // 行動版：ZH 用 Tracy baked 行動版圖（pixel-perfect 她的設計）；EN 用 HTML/CSS 重繪
    //（VennMobile，純 DOM 文字可讀；baked 圖內為中文不適用 EN）。
    // 桌機：ZH 用 Tracy baked 圖保證 1:1；EN 退回向量版（同上 i18n 理由）。
    <>
      {hasCjk(props.leftLabel) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${props.leftLabel ?? ''}／${props.rightLabel ?? ''} 痛點數據圖`}
          className="mx-auto h-auto w-full max-w-[400px] md:hidden"
          src="/figma/care-venn-mobile.webp"
        />
      ) : (
        <VennMobile
          leftLabel={props.leftLabel}
          leftStats={props.leftStats}
          rightLabel={props.rightLabel}
          rightStats={props.rightStats}
        />
      )}
      {hasCjk(props.leftLabel) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${props.leftLabel ?? ''}／${props.rightLabel ?? ''} 痛點數據圖`}
          className="mx-auto hidden h-auto w-full max-w-[900px] md:block"
          src="/figma/care-venn-desktop.webp"
        />
      ) : (
        <Venn
          leftLabel={props.leftLabel}
          leftStats={props.leftStats}
          rightLabel={props.rightLabel}
          rightStats={props.rightStats}
        />
      )}
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
        <ScrollReveal as="div" variant="in" className="container max-w-[1140px]">
          {inner}
        </ScrollReveal>
      </section>
    )
  }

  return (
    <ScrollReveal as="section" variant="in" className="container max-w-[1140px]" data-block="infographic">
      {inner}
    </ScrollReveal>
  )
}
