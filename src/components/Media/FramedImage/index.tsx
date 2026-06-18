import React from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import {
  buildFramePositionCss,
  resolveFramePosition,
  type FramePosition,
} from '@/utilities/framePositionCss'
import type { Props as MediaProps } from '@/components/Media/types'

type Props = {
  /** CMS 的 framePos 值（未整理過的原始值即可） */
  framePos?: unknown
  /** 各區塊自己的預設焦點（例如直式人物 hero 預設 desktop y:30） */
  defaults?: FramePosition
  /** 穩定唯一 id，用來 scope <style>（傳 block.id 或 array item id） */
  id: string | number
  resource: MediaProps['resource']
  /** 套在外層裁切容器（通常 absolute inset-0 等） */
  className?: string
  /** 額外套在 <img> 上的 class（object-fit 由 framePos CSS 控制，勿在此設定） */
  imgClassName?: string
  priority?: boolean
  /** 開啟 Hover 放大（Tracy 動效：照片 hover 放大 110%）。與 framePos 縮放疊乘。 */
  hoverZoom?: boolean
  /** hoverZoom 時，縮放跟「父層卡片」的 hover（外層卡片需加 group class），而非自己 */
  useParentGroup?: boolean
}

// Hover 放大層：與 framePos 的 transform 分屬不同元素，兩者 transform 相乘。
const HOVER = 'h-full w-full transition-transform duration-[400ms] ease-out group-hover:scale-110'

/**
 * FramedImage — 讀取每裝置的 framePos，產生 scoped CSS，讓同一張照片在手機／平板／電腦
 * 各自套用 object-fit（cover/contain）、object-position 與縮放。容器尺寸（框）由呼叫端決定。
 *
 * 以 fill 模式填滿父層，父層需 position:relative 且 overflow-hidden（縮放/hover 才會被裁切）。
 */
export const FramedImage: React.FC<Props> = ({
  framePos,
  defaults,
  id,
  resource,
  className,
  imgClassName,
  priority,
  hoverZoom,
  useParentGroup,
}) => {
  const pos = resolveFramePosition(framePos, defaults)
  const scopeId = `fp-${id}`
  const css = buildFramePositionCss(`#${scopeId} img`, pos)

  const media = <Media fill priority={priority} resource={resource} imgClassName={imgClassName} />

  return (
    <div
      id={scopeId}
      className={cn(
        'absolute inset-0 overflow-hidden',
        hoverZoom && !useParentGroup && 'group',
        className,
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {hoverZoom ? <div className={HOVER}>{media}</div> : media}
    </div>
  )
}

export default FramedImage
