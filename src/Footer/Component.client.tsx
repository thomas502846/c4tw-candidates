'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { SiteFooter } from '@/payload-types'

interface FooterClientProps {
  zh: SiteFooter
  en: SiteFooter
}

const localizeHref = (url: string, isEn: boolean): string => {
  if (!url || url.startsWith('http')) return url
  if (!isEn) return url
  return url === '/' ? '/en' : `/en${url}`
}

const linkClass =
  'text-base leading-[25px] tracking-[0.1em] text-brand-ink transition-colors hover:text-brand-primary'

const FooterLink: React.FC<{ url?: string | null; label: string; isEn: boolean }> = ({
  url,
  label,
  isEn,
}) => {
  if (!url) return <span className={linkClass}>{label}</span>

  if (url.startsWith('http')) {
    return (
      <a className={linkClass} href={url} rel="noopener noreferrer" target="_blank">
        {label}
      </a>
    )
  }

  return (
    <Link className={linkClass} href={localizeHref(url, isEn)}>
      {label}
    </Link>
  )
}

/* 聯絡資訊 icon（Figma：28×28 圓形 #ADCB59 底 + 16px 白色線 icon） */
type ContactKind = 'phone' | 'mail' | 'address' | 'line' | 'fb'

const detectContactKind = (label: string, url?: string | null): ContactKind => {
  // url 優先：LINE 標籤含 @564enhuc 會誤判為 mail，故先看連結網域
  if (url) {
    if (/facebook\.com/i.test(url)) return 'fb'
    if (/lin\.ee|line\.me/i.test(url)) return 'line'
  }
  if (label.includes('@')) return 'mail'
  if (/^[0-9+\-() ]+$/.test(label.trim())) return 'phone'
  return 'address'
}

const ContactIcon: React.FC<{ kind: ContactKind }> = ({ kind }) => (
  <span
    aria-hidden="true"
    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-lime"
  >
    {kind === 'phone' && (
      <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
        <path
          d="M14.6667 11.28V13.28C14.6674 13.4657 14.6294 13.6494 14.555 13.8196C14.4806 13.9897 14.3715 14.1424 14.2347 14.2679C14.0979 14.3934 13.9364 14.489 13.7605 14.5485C13.5846 14.608 13.3982 14.63 13.2133 14.6133C11.1619 14.3904 9.19133 13.6894 7.46 12.5667C5.84922 11.5431 4.48356 10.1774 3.46 8.56667C2.33332 6.82747 1.63216 4.84733 1.41333 2.78667C1.39667 2.60231 1.41858 2.41651 1.47767 2.24108C1.53675 2.06566 1.63171 1.90446 1.75651 1.76775C1.88131 1.63104 2.0332 1.52181 2.20253 1.44701C2.37185 1.37222 2.55489 1.33351 2.74 1.33333H4.74C5.06354 1.33015 5.37719 1.44472 5.62251 1.65569C5.86782 1.86666 6.02805 2.15963 6.07333 2.48C6.15775 3.12004 6.3143 3.74848 6.54 4.35333C6.6297 4.59195 6.64911 4.85128 6.59594 5.10059C6.54277 5.3499 6.41924 5.57874 6.24 5.76L5.39333 6.60667C6.34237 8.2757 7.7243 9.65763 9.39333 10.6067L10.24 9.76C10.4213 9.58076 10.6501 9.45723 10.8994 9.40406C11.1487 9.35089 11.4081 9.3703 11.6467 9.46C12.2515 9.6857 12.88 9.84225 13.52 9.92667C13.8438 9.97235 14.1396 10.1355 14.351 10.385C14.5624 10.6345 14.6748 10.9531 14.6667 11.28Z"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
    {kind === 'mail' && (
      <svg fill="none" height="16" viewBox="0 0 18 17" width="17">
        <path
          d="M16.5 4.25C16.5 3.47083 15.825 2.83333 15 2.83333H3C2.175 2.83333 1.5 3.47083 1.5 4.25M16.5 4.25V12.75C16.5 13.5292 15.825 14.1667 15 14.1667H3C2.175 14.1667 1.5 13.5292 1.5 12.75V4.25M16.5 4.25L9 9.20833L1.5 4.25"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
    {kind === 'address' && (
      <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
        <path
          d="M14 6.66667C14 11.3333 8 15.3333 8 15.3333C8 15.3333 2 11.3333 2 6.66667C2 5.07537 2.63214 3.54924 3.75736 2.42403C4.88258 1.29881 6.4087 0.666667 8 0.666667C9.5913 0.666667 11.1174 1.29881 12.2426 2.42403C13.3679 3.54924 14 5.07537 14 6.66667Z"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
    {/* LINE / FB：用 Figma footer 抽出的 glyph（白色，置於果綠圓內），對齊設計稿 */}
    {kind === 'line' && (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt="" className="h-4 w-4" src="/figma/glyph-line.svg" />
    )}
    {kind === 'fb' && (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt="" className="h-4 w-4" src="/figma/glyph-fb.svg" />
    )}
  </span>
)

const ContactRow: React.FC<{ label: string; url?: string | null }> = ({ label, url }) => {
  const kind = detectContactKind(label, url)
  const isExternal = kind === 'line' || kind === 'fb'
  const href = isExternal
    ? url
    : kind === 'mail'
      ? `mailto:${label}`
      : kind === 'phone'
        ? `tel:${label}`
        : null

  const inner = (
    <>
      <ContactIcon kind={kind} />
      <span
        className={`min-w-0 text-base leading-[25px] text-brand-ink ${
          kind === 'mail' ? 'break-all tracking-normal' : 'tracking-[0.1em]'
        }`}
      >
        {label}
      </span>
    </>
  )

  if (href) {
    return (
      <a
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
        href={href}
        {...(isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
      >
        {inner}
      </a>
    )
  }
  return <span className="flex items-center gap-3">{inner}</span>
}

const isContactColumnTitle = (title: string): boolean =>
  title.includes('聯絡') || /contact/i.test(title)

const columnTitleClass =
  'mb-4 text-sm font-medium tracking-[0.1em] text-brand-primary'

export const FooterClient: React.FC<FooterClientProps> = ({ zh, en }) => {
  const pathname = usePathname()
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const data = isEn ? en : zh

  const columns = data?.columns ?? []
  const familyVentures = data?.familyVentures ?? []
  const socialLinks = data?.socialLinks ?? []
  const copyright = data?.copyright

  return (
    <footer className="relative z-10 mt-auto">
      {/* 弧形上緣（Figma footer symbol 30:81）：絕對定位浮貼於上一區塊底部，
          弧線上方的透明轉角會露出上一區塊（深綠 CTA 帶），達成設計稿「footer 與底部區塊融合」的效果。
          只有裝飾弧形覆蓋上一區塊，footer 內容本體仍從區塊底緣開始，故對所有頁面（不論最後一塊為何）皆安全。 */}
      <svg
        aria-hidden="true"
        className="absolute bottom-[calc(100%-1px)] left-0 block h-[36px] w-full md:h-[87px]"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1444 88"
      >
        <path
          d="M0 88V87.1653C0 87.1653 367.254 0 724.502 0C1081.75 0 1444 87.1653 1444 87.1653V88H0Z"
          fill="var(--brand-surface)"
        />
      </svg>

      <div className="bg-brand-surface">
        <div className="mx-auto flex max-w-[1140px] flex-col items-center gap-12 px-5 pb-10 pt-6 md:flex-row md:items-center md:justify-between md:pb-14 md:pt-2">
          {/* 左：大 logo（mobile 置中、md+ 靠左） */}
          <Link
            aria-label="Care For Taiwan 創照服務設計"
            className="shrink-0"
            href={isEn ? '/en' : '/'}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Care For Taiwan 創照服務設計"
              className="h-auto w-[220px] md:w-[280px]"
              decoding="async"
              height={54}
              loading="lazy"
              src="/logos/cft-logo-horizontal.svg"
              width={280}
            />
          </Link>

          {/* 右：欄位群（小標 #9C9F33、連結 #212121；聯絡資訊帶綠底圓 icon）
              mobile（Figma M-home）：標題與連結置中；md+ 維持靠左。 */}
          <div className="grid min-w-0 grid-cols-1 gap-10 text-center sm:grid-cols-2 sm:text-left md:gap-[45px] lg:grid-cols-[auto_auto_auto]">
            {columns.map((column) => {
              const isContact = isContactColumnTitle(column.title)
              return (
                <div key={column.id}>
                  <h3 className={columnTitleClass}>{column.title}</h3>
                  <ul
                    className={
                      isContact
                        ? 'flex flex-col items-center gap-4 sm:items-start'
                        : // Figma 手機版 footer：關於我們連結 2 欄格（桌機回單欄）
                          'grid grid-cols-2 justify-items-center gap-x-8 gap-y-2 sm:flex sm:flex-col sm:items-start sm:gap-2'
                    }
                  >
                    {(column.links ?? []).map((link) => (
                      <li key={link.id}>
                        {isContact ? (
                          <ContactRow label={link.label} url={link.url} />
                        ) : (
                          <FooterLink isEn={isEn} label={link.label} url={link.url} />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}

            {familyVentures.length > 0 && (
              <div>
                <h3 className={columnTitleClass}>
                  {isEn ? 'Family of Ventures' : '家族事業'}
                </h3>
                <ul className="flex flex-col items-center gap-2 sm:items-start">
                  {familyVentures.map((venture) => (
                    <li key={venture.id}>
                      <FooterLink isEn={isEn} label={venture.name} url={venture.url} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 版權列（置中 11px #757575）＋社群連結 */}
        <div className="mx-auto flex max-w-[1140px] flex-col items-center gap-3 px-5 pb-7">
          {socialLinks.length > 0 && (
            <div className="flex gap-5">
              {socialLinks.map((social) => (
                <a
                  className="text-sm tracking-[0.1em] text-brand-muted transition-colors hover:text-brand-primary"
                  href={social.url}
                  key={social.id}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {social.platform === 'other' ? 'Link' : social.platform}
                </a>
              ))}
            </div>
          )}
          <p className="text-center text-[11px] font-medium tracking-[0.1em] text-brand-muted">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
