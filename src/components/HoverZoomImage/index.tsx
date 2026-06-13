import React from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { Props as MediaProps } from '@/components/Media/types'

/**
 * HoverZoomImage — 照片 Hover 放大原語（Tracy 動效規格：照片 Hover 放大 16 處）
 *
 * 行為（對齊 docs/figma/20260612/tracy-comments-effects.md）：
 * - 滑鼠移入卡片（Hover）時，圖片以中心為基準微幅放大至 110%
 * - 動畫時間 0.3–0.5s（取 400ms）、Ease Out
 * - 用於文章卡 / 案例卡 / 圖文卡照片
 *
 * 設計重點：放大效果綁在「卡片整體 hover」，所以 group 必須掛在卡片的外層容器。
 * 兩種用法：
 *   1) 卡片本身就是 hover 目標 → 直接用 <HoverZoomImage resource={...} /> （元件自帶 group）
 *   2) hover 目標是更外層卡片 → 外層加 `group` class，這裡用 useParentGroup 讓內層只負責縮放
 *
 * 也可純當 wrapper：把任意 <img>/<Media> 當 children 傳入。
 */

type Common = {
  className?: string
  /** 圓角等套在外層裁切容器 */
  wrapperClassName?: string
  /**
   * 縮放是否跟著「父層卡片」的 hover（而非自己）。
   * true 時這個 wrapper 不再是 group，請在外層卡片加 `group` class。
   */
  useParentGroup?: boolean
}

type WithResource = Common & {
  resource: MediaProps['resource']
  fill?: boolean
  priority?: boolean
  imgClassName?: string
  children?: never
}

type WithChildren = Common & {
  children: React.ReactNode
  resource?: never
}

export type HoverZoomImageProps = WithResource | WithChildren

// 縮放層 class：群組 hover 時放大到 110%
const ZOOM = 'transition-transform duration-[400ms] ease-out group-hover:scale-110'

export const HoverZoomImage: React.FC<HoverZoomImageProps> = (props) => {
  const { className, wrapperClassName, useParentGroup } = props

  // useParentGroup=true → 不自帶 group（由外層卡片提供）
  const wrapper = cn('overflow-hidden', !useParentGroup && 'group', wrapperClassName, className)

  if ('children' in props && props.children) {
    return (
      <div className={wrapper}>
        <div className={ZOOM}>{props.children}</div>
      </div>
    )
  }

  const { resource, fill, priority, imgClassName } = props as WithResource

  return (
    <div className={wrapper}>
      <Media
        fill={fill}
        priority={priority}
        resource={resource}
        imgClassName={cn(ZOOM, imgClassName)}
      />
    </div>
  )
}

export default HoverZoomImage
