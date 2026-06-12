import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // 舊站首頁路徑 /home → /（301）
  const homeRedirect = {
    source: '/home',
    destination: '/',
    permanent: true,
  }

  const enHomeRedirect = {
    source: '/en/home',
    destination: '/en',
    permanent: true,
  }

  // 舊站（戰國策 WP）URL → 新站 301 對照
  // 依據 docs/seo/old-site-urls-20260612.md；/cultivate 與舊 /contact 的去向為 Thomas 2026-06-12 定奪。
  // 舊 /contact/（內容實為媒體報導）不設 redirect：路徑由新站「聯絡我們」沿用，媒體報導內容改落在 /about。
  const oldSiteRedirects = [
    { source: '/about-us', destination: '/about', permanent: true },
    { source: '/longterm-service', destination: '/care', permanent: true },
    { source: '/cultivate', destination: '/training', permanent: true },
    { source: '/join-us', destination: '/contact', permanent: true },
    // WordPress 預設殘留頁
    { source: '/hello-world', destination: '/', permanent: true },
    { source: '/category/:path*', destination: '/', permanent: true },
    { source: '/author/:path*', destination: '/', permanent: true },
  ]

  return [internetExplorerRedirect, homeRedirect, enHomeRedirect, ...oldSiteRedirects]
}
