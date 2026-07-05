'use client'

import React, { useEffect } from 'react'

/**
 * 即時預覽：捲到編輯中的區塊（admin 端 / 父視窗）。
 *
 * 以 ui 欄位掛在 Pages 編輯頁（見 collections/Pages）。掛載後對整個 document 加一個
 * 委派監聽：編輯者點到某個頂層區塊（或其中任一欄位）時，往預覽 iframe postMessage
 * 該區塊 index，由前台的 LivePreviewBlockReceiver 捲動＋高亮。
 *
 * 區塊辨識靠 Payload 內部的 row DOM id：頂層 blocks 陣列每列是 `layout-row-N`
 * （N＝陣列 index）。巢狀陣列列是 `layout-0-images-row-0` 之類，故用 closest
 * 找最近的 `layout-row-N` 祖先＝該欄位所屬的頂層區塊。若 Payload 改了此結構，
 * 比對失敗就只是不捲動（graceful no-op），不影響編輯。
 */

// 與 Receiver 共用的訊息型別字串，兩邊必須一致。
const MSG_TYPE = 'c4tw-live-preview-scroll'
const ROW_ID_RE = /^layout-row-(\d+)$/

export const LivePreviewBlockSync: React.FC = () => {
  useEffect(() => {
    let lastIndex = -1
    let lastTime = 0

    const postIndex = (index: number) => {
      // click 與 focusin 常成對觸發同一區塊 → 400ms 內同 index 去重；隔一段時間再點同塊仍會捲。
      const now = Date.now()
      if (index === lastIndex && now - lastTime < 400) return
      lastIndex = index
      lastTime = now
      // 預覽 iframe 與 admin 同源；對所有 iframe 廣播，非預覽 iframe 會忽略未知訊息。
      document.querySelectorAll('iframe').forEach((frame) => {
        try {
          frame.contentWindow?.postMessage({ type: MSG_TYPE, index }, '*')
        } catch {
          /* 跨源等例外忽略 */
        }
      })
    }

    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null
      const row = target?.closest<HTMLElement>('[id^="layout-row-"]')
      if (!row) return
      const m = ROW_ID_RE.exec(row.id)
      if (!m) return
      postIndex(Number(m[1]))
    }

    document.addEventListener('click', handler, true)
    document.addEventListener('focusin', handler, true)
    return () => {
      document.removeEventListener('click', handler, true)
      document.removeEventListener('focusin', handler, true)
    }
  }, [])

  return null
}
