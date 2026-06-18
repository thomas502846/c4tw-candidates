import React from 'react'

import { cn } from '@/utilities/ui'

/**
 * 四大學習地圖 icon（Figma class 304:605：翻開的書／房屋+心／證照框／披風人物）。
 * 直接落地 Figma SVG 真圖（school-map-* via REST export，已去除祖層底色方塊），
 * 取代先前手繪近似稿，確保與設計 1:1。
 * PillarCards（四柱卡）與 TabsBlock（課程地圖 tab 標題）共用，依 index 對應同一張地圖。
 */

// 依 index 對應：0 課程／1 實作／2 證照／3 職涯（public/figma/school-map-*.svg）
export const SCHOOL_MAP_ICONS = [
  '/figma/school-map-1-course.svg',
  '/figma/school-map-2-practice.svg',
  '/figma/school-map-3-license.svg',
  '/figma/school-map-4-career.svg',
]

type MapIconProps = { index: number; className?: string }

export const MapIcon: React.FC<MapIconProps> = ({ index, className }) => (
  <span className={cn('block', className)}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      alt=""
      className="h-full w-full object-contain"
      src={SCHOOL_MAP_ICONS[index % SCHOOL_MAP_ICONS.length]}
    />
  </span>
)
