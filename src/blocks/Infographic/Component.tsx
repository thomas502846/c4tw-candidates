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
        {/* 數字片段滑入視窗後 Count Up（care 痛點數據）；中文單位原樣保留 */}
        <CountUpRuns bigSize={28} runs={valueRuns(value)} smallSize={14} />
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
    {/* 下大圓（職場角色，淡青 無邊框） */}
    <circle cx={M_BOT.cx} cy={M_BOT.cy} fill="#ECF7F9" r={M_BIG_R} />
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
          <circle cx={pos.cx} cy={pos.cy} fill="#FFFFFF" r={M_SAT_R} stroke="#ADCB59" strokeWidth="2" />
          <SatelliteText color="#9C9F33" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} />
        </g>
      )
    })}
    {/* 下圓衛星數據圓 */}
    {(rightStats ?? []).slice(0, 3).map((stat, i) => {
      const pos = M_SAT_BOT[i]
      return (
        <g key={stat.id ?? `mr${i}`}>
          <circle cx={pos.cx} cy={pos.cy} fill="#ECF7F9" r={M_SAT_R} />
          <SatelliteText color="#5E8C8C" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} />
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
    {/* 右大圓（職場角色，淡青 無邊框） */}
    <circle cx="555" cy="230" fill="#ECF7F9" r="170" />
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
          <circle cx={pos.cx} cy={pos.cy} fill="#FFFFFF" r={SAT_R} stroke="#ADCB59" strokeWidth="2" />
          <SatelliteText color="#9C9F33" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} />
        </g>
      )
    })}
    {(rightStats ?? []).slice(0, 3).map((stat, i) => {
      const pos = SAT_RIGHT[i]
      return (
        <g key={stat.id ?? `r${i}`}>
          <circle cx={pos.cx} cy={pos.cy} fill="#ECF7F9" r={SAT_R} />
          <SatelliteText color="#5E8C8C" cx={pos.cx} cy={pos.cy} label={stat.label} value={stat.value} />
        </g>
      )
    })}
  </svg>
)

/* ---------------------------------------------------------------- */
/* Ring：#8BA98B 粗 donut＋4 照片圓（45° 對角，school 341:652）       */
/* ---------------------------------------------------------------- */

// Figma 量測（problem-pic 67:166，donut 466、照片圓 129）：照片圓徑 = 129/466 ≈ 27.7% donut，
// 圓心貼四角（55:284~287 中心換算 ≈ 14%／86%），坐落在環帶上、不蓋中央米色洞口。
const RING_DIAM = '27.7%'
const RING_POS = [
  { left: '86.2%', top: '14.9%' }, // 右上（55:287）
  { left: '86.2%', top: '86.2%' }, // 右下（55:286）
  { left: '13.8%', top: '86.2%' }, // 左下（55:285）
  { left: '13.8%', top: '14.9%' }, // 左上（55:284）
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
        className="absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#D9D9D9]"
        key={photo.id ?? i}
        style={{ ...RING_POS[i], width: RING_DIAM, height: RING_DIAM }}
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

/**
 * 放射節點 fallback 線稿 icon（training 306:609 / M-training 第2屏）：
 * 依節點序對應 擴音器/人形/建築/手 四款，與 Figma 圓內 icon 一致。
 * 桌機用 baked PNG 故無此 fallback；此處主要服務行動版 RadialStack。
 */
const RADIAL_NODE_ICONS = [
  // 0 高齡化需求增加 → 擴音器 megaphone
  <path
    d="M9 19v8a3 3 0 0 0 3 3h3l16 8V8L15 16h-3a3 3 0 0 0-3 3ZM31 18a8 8 0 0 1 0 10M15 30v6a3 3 0 0 0 6 0v-2"
    key="0"
  />,
  // 1 照顧人才不足 → 人形 person
  <>
    <circle cx="23" cy="15" r="7" key="c" />
    <path d="M10 38c2.5-9 7.5-13 13-13s10.5 4 13 13" key="b" />
  </>,
  // 2 偏鄉資源落差 → 建築 building
  <path
    d="M12 40V12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v28M28 22h6a2 2 0 0 1 2 2v16M17 17h4M17 24h4M17 31h4M31 28h2M31 34h2M8 40h32"
    key="2"
  />,
  // 3 在地培力不易 → 手 hand（支持/培力）
  <path
    d="M14 24v-9a3 3 0 0 1 6 0v8M20 23v-11a3 3 0 0 1 6 0v11M26 23v-8a3 3 0 0 1 6 0v15a10 10 0 0 1-10 10h-3a9 9 0 0 1-7-4l-5-7a3 3 0 0 1 5-3l2 2"
    key="3"
  />,
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
      stroke="#9C9F33"
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
