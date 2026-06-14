import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { Noto_Sans_TC, Roboto } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-tc',
})

// 數字序號（01/02/03）Figma 指定 Roboto SemiBold(600)
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-roboto',
})

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(notoSansTC.variable, roboto.variable, GeistMono.variable)}
      data-theme="light"
      lang="zh-TW"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
  // staging：NOINDEX=true 時全站 meta noindex（搭配 next.config 的 X-Robots-Tag）
  ...(process.env.NOINDEX === 'true'
    ? {
        robots: {
          index: false,
          follow: false,
        },
      }
    : {}),
}
