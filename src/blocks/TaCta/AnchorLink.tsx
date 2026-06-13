'use client'

import React from 'react'

// 頁內錨點平滑捲動（care TA 雙按鈕：我是企業HR→#企業EAP方案／我是家屬→#個人AIO服務）。
// 僅攔截「同頁 # 開頭」連結；外部與跨頁連結維持原生行為。
// scroll-mt 已由 RenderBlocks 對目標區塊補 sticky header 高度，這裡只負責平滑＋更新 hash。
// 尊重 reduced-motion：偏好減少動態時用 'auto'（瞬時）對位、不做平滑位移。
type Props = {
  href: string
  className?: string
  ariaLabel?: string
  children: React.ReactNode
}

export const AnchorLink: React.FC<Props> = ({ href, className, ariaLabel, children }) => {
  const isInPageHash = href.startsWith('#') && href.length > 1

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isInPageHash) return
    const id = decodeURIComponent(href.slice(1))
    const target =
      document.getElementById(id) ?? document.querySelector(`[id="${CSS.escape(id)}"]`)
    if (!target) return // 找不到目標就退回原生跳轉
    e.preventDefault()
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' })
    // 更新網址 hash 但不再觸發瀏覽器預設跳轉
    if (history.replaceState) history.replaceState(null, '', href)
  }

  return (
    <a aria-label={ariaLabel} className={className} href={href} onClick={onClick}>
      {children}
    </a>
  )
}
