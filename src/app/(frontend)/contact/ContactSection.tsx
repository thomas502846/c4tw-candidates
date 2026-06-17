import React from 'react'

import { ScrollReveal } from '@/components/ScrollReveal'

import { ContactForm } from './ContactForm'

type Locale = 'zh-TW' | 'en'

/**
 * Contact 表單區（Figma Frame 120 232:364）：
 * 左欄＝聯絡表單（462 寬）、右欄＝聯絡資訊三列（#ADCB59 圓 icon）＋ Google Map 嵌入（550×337、rounded-30）。
 * 聯絡資訊為公司固定資料（Sheet contact 03），不入 CMS；收件信箱另由 CMS 設定（scope 定案）。
 */

const INFO = {
  phone: '049-2526-611',
  email: 'carefortaiwan2022@gmail.com',
  address: {
    'zh-TW': '臺中市烏日區溪岸路8-3號',
    en: 'No. 8-3, Xi’an Rd., Wuri Dist., Taichung City, Taiwan',
  },
  line: {
    url: 'https://lin.ee/xQ63Ufj',
    label: {
      'zh-TW': '官方 LINE：@564enhuc',
      en: 'Official LINE: @564enhuc',
    },
  },
  fb: {
    url: 'https://www.facebook.com/p/CFT-照顧學校-61571463056013/',
    label: {
      'zh-TW': '官方 Facebook：CFT 照顧學校',
      en: 'Official Facebook: CFT Care School',
    },
  },
} as const

const MAP_QUERY = '臺中市烏日區溪岸路8-3號'
// 官方 Google Maps Embed API（免費、不計次）：設定 NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY 後啟用；
// 未設 key 時退回免金鑰 output=embed（仍可顯示，但官方版較穩、可設網域限制）。
const MAP_EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY
const MAP_EMBED_SRC = MAP_EMBED_KEY
  ? `https://www.google.com/maps/embed/v1/place?key=${MAP_EMBED_KEY}&q=${encodeURIComponent(MAP_QUERY)}&language=zh-TW`
  : `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed&hl=zh-TW`
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

const COPY = {
  'zh-TW': { mapTitle: 'Care For Taiwan 位置地圖', openMap: '在 Google 地圖中開啟' },
  en: { mapTitle: 'Care For Taiwan location map', openMap: 'Open in Google Maps' },
} as const

/* icon 系統同 footer（Figma：28×28 圓形 #ADCB59 底＋白色線 icon） */
const InfoIcon: React.FC<{ kind: 'phone' | 'mail' | 'address' | 'line' | 'fb' }> = ({ kind }) => (
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

export const ContactSection: React.FC<{ locale?: Locale }> = ({ locale = 'zh-TW' }) => {
  const t = COPY[locale]

  return (
    /* id=sheet：about/care/training CTA 以 /contact/#sheet 捲到表單；scroll-mt 補 sticky header 高
       寬度：不用 .container（其 2xl 變體 max-width 1376px 會蓋過 max-w-[1240px]，把表單攤到 1376）。
       改用固定 mx-auto + 自管 padding，硬鎖 max-w-[1240px]＝Figma 1140 內容 + 左右 50 padding。 */
    <ScrollReveal
      as="section"
      className="mx-auto mt-16 w-full max-w-[1240px] scroll-mt-[88px] px-4 md:px-[50px] lg:scroll-mt-[120px]"
      id="sheet"
    >
      {/* Figma Frame 120（1140 寬）：左表單 462／右資訊 550／gap 128
          → 1140 內 462=40.5%、gap 128=11.2%、右 550=48.2%。md+ 用固定 gap-[128px] 對齊規格、
          並用 basis 鎖左右欄寬比，避免容器寬度浮動時欄寬連帶飄移。 */}
      <div className="flex flex-col gap-14 lg:flex-row lg:gap-[128px]">
        {/* 左欄：表單（Figma 462）。lg 以 basis 鎖約 40.5%，flex-none 不被內容撐寬 */}
        <div className="lg:w-[462px] lg:flex-none">
          <ContactForm locale={locale} />
        </div>

        {/* 右欄：聯絡資訊三列 + Google Map（Figma 550，min-w-0 允許收縮） */}
        <div className="flex min-w-0 flex-1 flex-col">
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-3">
              <InfoIcon kind="phone" />
              <a
                className="text-base tracking-[0.1em] text-brand-ink hover:text-brand-primary"
                href={`tel:${INFO.phone.replace(/-/g, '')}`}
              >
                {INFO.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <InfoIcon kind="mail" />
              <a
                className="break-all text-base tracking-[0.1em] text-brand-ink hover:text-brand-primary"
                href={`mailto:${INFO.email}`}
              >
                {INFO.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <InfoIcon kind="address" />
              <span className="text-base tracking-[0.1em] text-brand-ink">
                {INFO.address[locale]}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <InfoIcon kind="line" />
              <a
                className="text-base tracking-[0.1em] text-brand-ink hover:text-brand-primary"
                href={INFO.line.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {INFO.line.label[locale]}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <InfoIcon kind="fb" />
              <a
                className="text-base tracking-[0.1em] text-brand-ink hover:text-brand-primary"
                href={INFO.fb.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {INFO.fb.label[locale]}
              </a>
            </li>
          </ul>

          {/* Figma conect 地圖 550×337、rounded-30。寬度跟右欄（≤550），高度固定 337（lg）。 */}
          <iframe
            className="mt-8 h-[280px] w-full rounded-[30px] border-0 lg:h-[337px] lg:max-w-[550px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={MAP_EMBED_SRC}
            title={t.mapTitle}
          />
          <a
            className="mt-3 self-end text-sm tracking-[0.05em] text-brand-muted underline-offset-4 hover:text-brand-primary hover:underline lg:max-w-[550px]"
            href={MAP_LINK}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t.openMap} →
          </a>
        </div>
      </div>
    </ScrollReveal>
  )
}
