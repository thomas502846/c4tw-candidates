import React from 'react'

/**
 * 四大學習地圖內建線稿 icon（Figma class 304:605：翻開的書／房屋+心／證書框／披風人物）。
 * CMS icon 欄位有上傳時優先用上傳圖；此處為 SVG 自繪 fallback，
 * PillarCards（四柱卡）與 TabsBlock（課程地圖 tab 標題）共用，依 index 對應同一張地圖。
 */

type IconProps = { className?: string }

const stroke = '#3F4A3F'
const accent = '#D9534F'

/** 課程地圖：翻開的書＋紅書籤 */
export const BookMapIcon: React.FC<IconProps> = ({ className }) => (
  <svg aria-hidden className={className} fill="none" viewBox="0 0 48 48">
    <path
      d="M24 13 C 19.5 9 12 8.6 8 10.6 V 36 C 12 34 19.5 34.4 24 38.4 C 28.5 34.4 36 34 40 36 V 10.6 C 36 8.6 28.5 9 24 13 Z"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
    />
    <path d="M24 13 V 38.4" stroke={stroke} strokeLinecap="round" strokeWidth="2.4" />
    <path d="M30 9.5 v 9.5 l 3.5 -3 3.5 3 V 9.5 Z" fill={accent} />
  </svg>
)

/** 實作地圖：房屋＋心 */
export const PracticeMapIcon: React.FC<IconProps> = ({ className }) => (
  <svg aria-hidden className={className} fill="none" viewBox="0 0 48 48">
    <path
      d="M7 22 L24 8.5 L41 22 M11.5 18.5 V 38.5 H 36.5 V 18.5"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
    />
    <path
      d="M24 33 l -4.8 -4.7 a 3.4 3.4 0 0 1 4.8 -4.8 a 3.4 3.4 0 0 1 4.8 4.8 Z"
      fill={accent}
    />
  </svg>
)

/** 證照地圖：證書框＋紅緞帶章 */
export const LicenseMapIcon: React.FC<IconProps> = ({ className }) => (
  <svg aria-hidden className={className} fill="none" viewBox="0 0 48 48">
    <rect height="24" rx="3" stroke={stroke} strokeWidth="2.4" width="34" x="7" y="9" />
    <path d="M13 17 h 14 M13 22.5 h 10" stroke={stroke} strokeLinecap="round" strokeWidth="2.4" />
    <path d="M29.6 31 l -2 8 4.4 -2.4 4.4 2.4 -2 -8 Z" fill={accent} />
    <circle cx="32" cy="27.5" fill={accent} r="5.4" />
    <circle cx="32" cy="27.5" fill="none" r="2.4" stroke="#FFFFFF" strokeWidth="1.6" />
  </svg>
)

/** 職涯地圖：披風人物 */
export const CareerMapIcon: React.FC<IconProps> = ({ className }) => (
  <svg aria-hidden className={className} fill="none" viewBox="0 0 48 48">
    {/* 紅披風（身後） */}
    <path d="M18.5 20 L12 40 L24 35 L36 40 L29.5 20 Z" fill={accent} />
    {/* 身體 */}
    <path
      d="M24 19 V 33 M24 23 L16.5 28 M24 23 L31.5 28"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.6"
    />
    <circle cx="24" cy="12.5" fill="#FFFFFF" r="5" stroke={stroke} strokeWidth="2.4" />
  </svg>
)

/** 依 index 對應：0 課程／1 實作／2 證照／3 職涯 */
export const MAP_ICONS: React.FC<IconProps>[] = [
  BookMapIcon,
  PracticeMapIcon,
  LicenseMapIcon,
  CareerMapIcon,
]
