'use client'

import { useEffect } from 'react'

/**
 * 前台瀏覽計數：文章內頁載入時對 /post-view +1。
 * 用 sessionStorage 對同一篇去重，避免重整／來回切換灌水。
 */
export const ViewPing: React.FC<{ postId: string | number }> = ({ postId }) => {
  useEffect(() => {
    const key = `viewed:${postId}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // sessionStorage 不可用時仍計一次（無去重）
    }
    void fetch('/post-view', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: postId }),
      keepalive: true,
    }).catch(() => {})
  }, [postId])
  return null
}
