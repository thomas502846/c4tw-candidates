'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Navigation } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'

interface HeaderClientProps {
  zh: Navigation
  en: Navigation
}

type NavItem = NonNullable<Navigation['items']>[number]
type SubItem = NonNullable<NavItem['subItems']>[number]

const localizeHref = (url: string, isEn: boolean): string => {
  if (!url || url === '#') return '#'
  if (url.startsWith('http')) return url
  if (!isEn) return url
  return url === '/' ? '/en' : `/en${url}`
}

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

// 外連 icon（Figma M-menu：學習平台 旁的圈內箭頭 →），標示開新分頁的子項
const ExternalArrow: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    height="22"
    viewBox="0 0 22 22"
    width="22"
  >
    <circle cx="11" cy="11" r="9.2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7.5 11H14M14 11L11.3 8.3M14 11L11.3 13.7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
)

// 當前頁判斷：navbar 主連結 href 命中目前路徑時回 true（Figma：active 連結用 brand-lime #adcb59）
// 比對忽略結尾斜線；'/' 與 '/en' 僅在完全相等時 active（避免首頁恆亮）
const isActivePath = (href: string, pathname: string): boolean => {
  if (!href || href === '#' || href.startsWith('http')) return false
  const norm = (p: string) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p)
  const h = norm(href)
  const p = norm(pathname)
  if (h === '/' || h === '/en') return p === h
  return p === h || p.startsWith(`${h}/`)
}

const NavLink: React.FC<{
  item: NavItem | SubItem
  isEn: boolean
  className?: string
  activeClassName?: string
  pathname?: string
  withChevron?: boolean
  withExternalArrow?: boolean
  onClick?: () => void
}> = ({
  item,
  isEn,
  className,
  activeClassName,
  pathname,
  withChevron,
  withExternalArrow,
  onClick,
}) => {
  const href = localizeHref(item.url, isEn)
  const active = activeClassName != null && pathname != null && isActivePath(href, pathname)
  const cls = active ? `${className ?? ''} ${activeClassName}` : className
  const external = item.type === 'external' || item.url.startsWith('http')
  const content = (
    <>
      {item.label}
      {withChevron && <ChevronDown className="ml-1 shrink-0" />}
      {withExternalArrow && <ExternalArrow className="ml-2 shrink-0" />}
    </>
  )

  if (external) {
    return (
      <a
        className={cls}
        href={item.url}
        onClick={onClick}
        rel="noopener noreferrer"
        target="_blank"
      >
        {content}
      </a>
    )
  }

  if (href === '#') {
    return <span className={cls}>{content}</span>
  }

  return (
    <Link aria-current={active ? 'page' : undefined} className={cls} href={href} onClick={onClick}>
      {content}
    </Link>
  )
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ zh, en }) => {
  const pathname = usePathname()
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const items = (isEn ? en : zh)?.items ?? []
  const [mobileOpen, setMobileOpen] = useState(false)
  // mobile 子選單可獨立展開／收合（Figma M-menu：父項旁 chevron，點擊展開子項）
  const [openSub, setOpenSub] = useState<Record<string, boolean>>({})

  // 換頁自動收合 mobile 選單
  useEffect(() => {
    setMobileOpen(false)
    setOpenSub({})
  }, [pathname])

  // 選單開啟時鎖背景捲動
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [mobileOpen])

  // Header 固定於視窗頂端（Tracy：sticky top）；捲動後加 subtle shadow 與內容分層
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 語言切換：/path ↔ /en/path
  const switchHref = isEn
    ? pathname.replace(/^\/en/, '') || '/'
    : `/en${pathname === '/' ? '' : pathname}`

  const desktopLinkClass =
    'inline-flex items-center text-[17px] xl:text-[19px] font-medium tracking-[0.1em] text-brand-green transition-colors hover:text-brand-primary'
  const desktopPillClass =
    'inline-flex items-center rounded-full bg-brand-lime pl-6 pr-5 py-3 text-[17px] xl:text-[19px] font-medium tracking-[0.1em] text-white transition-opacity hover:opacity-90'

  return (
    <header
      className={`sticky top-0 z-50 bg-brand-surface transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:h-[104px] lg:px-[50px]">
        <Link aria-label="Care For Taiwan 創照服務設計" href={isEn ? '/en' : '/'}>
          <Logo loading="eager" priority="high" />
        </Link>

        {/* Desktop nav（Figma：gap 53、#8BA98B 19 Medium、CFT照顧學校綠 pill、EN #DCD020） */}
        <nav className="hidden items-center gap-7 lg:flex xl:gap-[53px]">
          {items.map((item) => {
            const hasSub = (item.subItems?.length ?? 0) > 0
            const baseClass = item.highlight ? desktopPillClass : desktopLinkClass
            // pill（highlight）本身已是 lime 填色，不另加 active 色；一般連結套 brand-lime + semibold
            const activeClass = item.highlight ? undefined : 'text-brand-lime font-semibold'

            if (!hasSub) {
              return (
                <NavLink
                  activeClassName={activeClass}
                  className={baseClass}
                  isEn={isEn}
                  item={item}
                  key={item.id}
                  pathname={pathname}
                />
              )
            }

            // 父連結：自身命中或任一子項命中 → active
            const childActive = (item.subItems ?? []).some((sub) =>
              isActivePath(localizeHref(sub.url, isEn), pathname),
            )

            return (
              <div className="group relative" key={item.id}>
                <NavLink
                  activeClassName={childActive ? undefined : activeClass}
                  className={`${baseClass} cursor-pointer${childActive ? ' text-brand-lime font-semibold' : ''}`}
                  isEn={isEn}
                  item={item}
                  pathname={pathname}
                  withChevron
                />
                <div className="invisible absolute left-0 top-full z-30 min-w-[200px] translate-y-1 rounded-[20px] border border-border bg-white py-3 opacity-0 shadow-lg transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {(item.subItems ?? []).map((sub) => (
                    <NavLink
                      activeClassName="text-brand-lime font-semibold"
                      className="block whitespace-nowrap px-6 py-3 text-base tracking-[0.1em] text-brand-ink transition-colors hover:bg-brand-surface hover:text-brand-primary"
                      isEn={isEn}
                      item={sub}
                      key={sub.id}
                      pathname={pathname}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          <Link
            className="text-[17px] font-medium tracking-[0.1em] text-brand-highlight transition-colors hover:text-brand-primary xl:text-[19px]"
            href={switchHref}
          >
            {isEn ? '中文' : 'EN'}
          </Link>
        </nav>

        {/* Mobile 漢堡 */}
        <button
          aria-controls="mobile-nav"
          aria-expanded={mobileOpen}
          aria-label="開啟選單"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-green lg:hidden"
          onClick={() => setMobileOpen(true)}
          type="button"
        >
          <svg aria-hidden="true" fill="none" height="26" viewBox="0 0 26 26" width="26">
            <path
              d="M3 7H23M3 13H23M3 19H23"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      {/* Mobile 選單（Figma M-menu：全螢幕淺米底浮層，logo 左上、X lime 方塊釘右上角、群組間分隔線、子項可展開、外連圈箭頭） */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-brand-surface lg:hidden"
          id="mobile-nav"
        >
          {/* 頂列：logo + X 方塊 */}
          <div className="relative flex h-[72px] shrink-0 items-center px-5">
            <Link
              aria-label="Care For Taiwan 創照服務設計"
              href={isEn ? '/en' : '/'}
              onClick={() => setMobileOpen(false)}
            >
              <Logo loading="eager" priority="high" />
            </Link>
            <button
              aria-label="關閉選單"
              className="absolute right-0 top-0 inline-flex h-[60px] w-[84px] items-center justify-center rounded-bl-[20px] bg-brand-lime text-white"
              onClick={() => setMobileOpen(false)}
              type="button"
            >
              <svg aria-hidden="true" fill="none" height="28" viewBox="0 0 28 28" width="28">
                <path
                  d="M7 7L21 21M21 7L7 21"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.2"
                />
              </svg>
            </button>
          </div>

          {/* 項目區 */}
          <nav className="flex-1 overflow-y-auto px-6 pt-6">
            {items.map((item) => {
              const hasSub = (item.subItems?.length ?? 0) > 0
              const expanded = openSub[item.id ?? item.label] ?? false

              if (!hasSub) {
                return (
                  <div
                    className="border-b border-brand-green/30 py-5 last:border-b-0"
                    key={item.id}
                  >
                    <NavLink
                      activeClassName="text-brand-lime"
                      className="block text-[22px] font-semibold tracking-[0.12em] text-brand-green"
                      isEn={isEn}
                      item={item}
                      onClick={() => setMobileOpen(false)}
                      pathname={pathname}
                    />
                  </div>
                )
              }

              return (
                <div className="border-b border-brand-green/30 py-5" key={item.id}>
                  <button
                    aria-expanded={expanded}
                    className="flex w-full items-center text-[22px] font-semibold tracking-[0.12em] text-brand-green"
                    onClick={() =>
                      setOpenSub((prev) => ({
                        ...prev,
                        [item.id ?? item.label]: !expanded,
                      }))
                    }
                    type="button"
                  >
                    {item.label}
                    <ChevronDown
                      className={`ml-2 shrink-0 transition-transform duration-300 ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expanded && (
                    <div className="mt-4 flex flex-col gap-4">
                      {(item.subItems ?? []).map((sub) => {
                        const external = sub.type === 'external' || sub.url.startsWith('http')
                        return (
                          <NavLink
                            activeClassName="text-brand-lime"
                            className="inline-flex items-center pl-5 text-[20px] font-semibold tracking-[0.1em] text-brand-ink"
                            isEn={isEn}
                            item={sub}
                            key={sub.id}
                            onClick={() => setMobileOpen(false)}
                            pathname={pathname}
                            withExternalArrow={external}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            <Link
              className="mt-6 inline-flex text-[20px] font-semibold tracking-[0.1em] text-brand-primary"
              href={switchHref}
              onClick={() => setMobileOpen(false)}
            >
              {isEn ? '中文' : 'EN'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
