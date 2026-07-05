'use client'

import React, { useEffect } from 'react'

/**
 * 即時預覽：捲到編輯中的區塊（預覽端 / iframe 內）。
 *
 * 編輯者在 CMS 點開某個區塊時，admin 端（LivePreviewBlockSync）會 postMessage
 * 過來，本元件據此把預覽捲到對應區塊並短暫高亮，讓預覽位置跟著正在編輯的區塊走。
 *
 * 只在 draft/預覽情境掛載（見 [slug]/page.tsx 的 `{draft && ...}`），正式頁零影響。
 * 區塊以 `data-lp-index` 對位 —— 與 RenderBlocks 的陣列 index、admin 的
 * `layout-row-N` 三者一致（停用的區塊不渲染但保留 index，故不會錯位）。
 */

// 與 LivePreviewBlockSync 共用的訊息型別字串，兩邊必須一致。
const MSG_TYPE = 'c4tw-live-preview-scroll'

export const LivePreviewBlockReceiver: React.FC = () => {
  useEffect(() => {
    const timers: number[] = []
    let highlighted: HTMLElement | null = null

    const clearHighlight = () => {
      timers.forEach((t) => window.clearTimeout(t))
      timers.length = 0
      if (highlighted) {
        highlighted.style.outline = ''
        highlighted.style.outlineOffset = ''
        highlighted.style.transition = ''
        highlighted = null
      }
    }

    const onMessage = (e: MessageEvent) => {
      // 同源才處理（admin 與前台同網域）。
      if (e.origin !== window.location.origin) return
      const data = e.data as { type?: string; index?: number } | null
      if (!data || data.type !== MSG_TYPE || typeof data.index !== 'number') return

      const el = document.querySelector<HTMLElement>(`[data-lp-index="${data.index}"]`)
      if (!el) return // 該區塊未渲染（如已停用）→ 不動作

      clearHighlight() // 清掉上一次的高亮與計時器，避免殘留
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // 短暫果綠高亮，讓編輯者看清楚對到哪一塊。
      highlighted = el
      el.style.transition = 'outline-color 0.5s ease'
      el.style.outline = '3px solid rgba(173, 203, 89, 0.95)'
      el.style.outlineOffset = '4px'
      timers.push(
        window.setTimeout(() => {
          el.style.outlineColor = 'transparent'
        }, 1100),
        window.setTimeout(clearHighlight, 1800),
      )
    }

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      clearHighlight()
    }
  }, [])

  return null
}
