import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function Header() {
  // 兩個語系一次取好（皆有 cache），client 依路徑（/en 前綴）選用
  const [zh, en] = await Promise.all([
    getCachedGlobal('navigation', 0, 'zh-TW')(),
    getCachedGlobal('navigation', 0, 'en')(),
  ])

  return <HeaderClient zh={zh} en={en} />
}
