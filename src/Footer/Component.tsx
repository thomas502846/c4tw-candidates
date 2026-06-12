import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { FooterClient } from './Component.client'

export async function Footer() {
  // 兩個語系一次取好（皆有 cache），client 依路徑（/en 前綴）選用
  const [zh, en] = await Promise.all([
    getCachedGlobal('site-footer', 0, 'zh-TW')(),
    getCachedGlobal('site-footer', 0, 'en')(),
  ])

  return <FooterClient zh={zh} en={en} />
}
