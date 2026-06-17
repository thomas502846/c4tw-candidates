import React from 'react'

import HoverZoomImage from '@/components/HoverZoomImage'
import { Media } from '@/components/Media'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import { normalizeCtaHref } from '@/utilities/normalizeCtaHref'
import type { Media as MediaDoc } from '@/payload-types'

import { AnchorLink } from './AnchorLink'

// 暫定型別：block 接線並重新生成 payload-types 後改用 generated type
export type TaCtaCard = {
  image?: MediaDoc | string | number | null
  title: string
  buttonLabel?: string | null
  url?: string | null
  id?: string | null
}

export type TaCtaBlockProps = {
  blockType: 'taCta'
  variant?: 'tiles' | 'photoCards' | 'photoBand' | 'darkBand' | null
  intro?: string | null
  cards?: TaCtaCard[] | null
}

const ArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden
    className={cn('h-5 w-5 shrink-0', className)}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

// Home CTA 三磚 TA 線稿插圖（Figma CTA frame 181:396）。
// seed 卡片序已改為 [school, training, care]，故 icon 依此配對：
//   tile1 school（認識照顧學校）＝學習插圖 icon-1-cft
//   tile2 training/組織培力（洽詢組織培力合作模式）＝多人協作插圖 icon-3-org
//   tile3 care（我需要整合照顧）＝個人求助照顧插圖 icon-2-service
// CMS 後續若上傳 image 則優先用 image。
const taTileIcons = [
  '/figma/home-ta-icon-1-cft.svg',
  '/figma/home-ta-icon-3-org.svg',
  '/figma/home-ta-icon-2-service.svg',
]

const CardIllustration: React.FC<{
  card: TaCtaCard
  className?: string
  fallbackSrc?: string
}> = ({ card, className, fallbackSrc }) => {
  if (card.image && typeof card.image === 'object') {
    return (
      <span className={cn('block shrink-0', className)}>
        <Media resource={card.image} imgClassName="h-full w-full object-contain" />
      </span>
    )
  }
  if (fallbackSrc) {
    return (
      <span aria-hidden className={cn('block shrink-0', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="h-full w-full object-contain" src={fallbackSrc} />
      </span>
    )
  }
  // 白色線稿插圖佔位
  return (
    <span aria-hidden className={cn('flex shrink-0 items-center justify-center', className)}>
      <span className="h-3/4 w-3/4 rounded-full border-[3px] border-white/60" />
    </span>
  )
}

/**
 * 白底 pill 按鈕（Tracy LINE 定稿：白底 #FFFFFF + 深字 #212121 + 深色箭頭）
 * mobile（Figma M-home）：滿版寬、文字靠左、箭頭靠右；md+ 維持原 inline 居中尺寸。
 */
const WhitePill: React.FC<{ label: string; url?: string | null }> = ({ label, url }) => {
  const inner = (
    <>
      <span>{label}</span>
      <ArrowRight className="h-4 w-4" />
    </>
  )
  const cls =
    'flex w-full items-center justify-between gap-2 rounded-[30px] bg-white px-6 py-2.5 text-[15px] font-medium tracking-[0.1em] text-brand-ink transition-opacity hover:opacity-85 md:inline-flex md:w-auto md:justify-center md:px-7 md:py-2 md:text-[19px]'
  return url ? (
    <a className={cls} href={url}>
      {inner}
    </a>
  ) : (
    <span className={cls}>{inner}</span>
  )
}

const tileBgs = ['bg-brand-primary', 'bg-brand-green', 'bg-brand-lime']

/**
 * variant tiles：Home CTA 區（cta bg 21:81，#F7F7EB 帶；左欄兩橫卡＋右欄一直卡；
 * 卡底 #9C9F33/#8BA98B/#ADCB59 輪替；白底 pill 按鈕；右緣半透明白線稿裝飾圓）
 */
const Tiles: React.FC<{ cards: TaCtaCard[] }> = ({ cards }) => {
  const [c1, c2, c3] = cards
  // 左欄兩張橫卡（c1/c2）：md+ 維持原「圖左、文字＋pill 右半置中」；
  // mobile（Figma M-home）：線稿 icon 左 + 標題右（兩欄上排）＋滿版白 pill 下排。
  const horizontal = (card: TaCtaCard, i: number) => (
    <div
      key={card.id ?? i}
      className={cn(
        'flex flex-col gap-5 rounded-[30px] px-7 py-7 md:h-[180px] md:flex-row md:items-center md:gap-6 md:px-9',
        tileBgs[i % tileBgs.length],
      )}
    >
      {/* 上排（mobile）/ 左欄（md+）：icon 左 + 標題右 */}
      <div className="flex items-center gap-5 md:contents">
        <CardIllustration
          card={card}
          className="h-[88px] w-[88px] shrink-0 md:h-[110px] md:w-[110px] lg:h-[140px] lg:w-[140px]"
          fallbackSrc={taTileIcons[i]}
        />
        {/* md+：標語＋pill 在卡片右半置中；mobile：標題在 icon 右側 */}
        <div className="flex flex-1 flex-col items-start gap-4 md:items-center">
          <h3 className="text-lg font-medium tracking-[0.1em] text-white md:text-[22px]">
            {card.title}
          </h3>
          {/* md+ 才在右半放 pill；mobile 的 pill 移到卡片底部滿版 */}
          {card.buttonLabel && (
            <span className="hidden md:block">
              <WhitePill label={card.buttonLabel} url={card.url} />
            </span>
          )}
        </div>
      </div>
      {/* mobile 滿版 pill（md+ 隱藏，已在右半顯示） */}
      {card.buttonLabel && (
        <div className="md:hidden">
          <WhitePill label={card.buttonLabel} url={card.url} />
        </div>
      )}
    </div>
  )

  return (
    <section className="relative overflow-hidden bg-brand-surface py-16 md:py-20" data-block="taCta">
      {/* 右緣半透明白色大型線稿裝飾圓（Home-CTA-04 239:719） */}
      <span
        aria-hidden
        className="absolute -right-20 top-10 hidden h-[312px] w-[312px] rounded-full border-[10px] border-white/30 lg:block"
      />
      <div className="container relative grid max-w-[1240px] gap-8 md:grid-cols-[590fr_506fr] md:gap-11">
        <div className="flex flex-col gap-8 md:gap-10">
          {c1 && horizontal(c1, 0)}
          {c2 && horizontal(c2, 1)}
        </div>
        {c3 && (
          <div
            className={cn(
              // mobile：icon 左 + 標題右（兩欄上排）＋滿版白 pill 下排（與 c1/c2 一致）；
              // md+：右側直卡，icon→標題→pill 垂直置中。
              'flex flex-col gap-5 rounded-[30px] px-7 py-7 md:items-center md:justify-center md:gap-6 md:px-8 md:py-10 md:text-center',
              tileBgs[2],
            )}
          >
            <div className="flex items-center gap-5 md:flex-col md:gap-6">
              <CardIllustration
                card={c3}
                className="h-[88px] w-[88px] shrink-0 md:h-[200px] md:w-[200px]"
                fallbackSrc={taTileIcons[2]}
              />
              <h3 className="text-lg font-medium tracking-[0.1em] text-white md:text-[22px]">
                {c3.title}
              </h3>
              {c3.buttonLabel && (
                <span className="hidden md:block">
                  <WhitePill label={c3.buttonLabel} url={c3.url} />
                </span>
              )}
            </div>
            {c3.buttonLabel && (
              <div className="md:hidden">
                <WhitePill label={c3.buttonLabel} url={c3.url} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * variant photoCards：Care TA 雙連結卡帶（ta-bg 95:509 #F7F7EB；卡＝上照片＋下 80 高 #ADCB59 色條
 * 白字標語靠左＋白色箭頭靠右，整卡可點）
 */
const PhotoCards: React.FC<{ intro?: string | null; cards: TaCtaCard[] }> = ({ intro, cards }) => (
  <section className="bg-brand-surface py-16 md:py-20" data-block="taCta">
    <div className="container max-w-[1240px]">
      {intro && (
        <p className="mx-auto mb-12 whitespace-pre-line text-center text-lg font-medium leading-[1.9] tracking-[0.1em] text-brand-ink md:text-[22px]">
          {intro}
        </p>
      )}
      <ScrollReveal as="div" variant="up" className="mx-auto grid max-w-[1140px] gap-8 md:grid-cols-2 md:gap-[8%]">
        {cards.map((card, i) => {
          const inner = (
            <>
              <div className="h-[180px] bg-[#D9D9D9] md:h-[212px]">
                {card.image && typeof card.image === 'object' && (
                  <HoverZoomImage
                    resource={card.image}
                    useParentGroup
                    imgClassName="h-full w-full object-cover"
                    wrapperClassName="h-full w-full"
                  />
                )}
              </div>
              <div className="flex h-[70px] items-center justify-between bg-brand-lime px-7 md:h-[80px]">
                <span className="text-[17px] font-medium tracking-[0.1em] text-white md:text-[19px]">
                  {card.title}
                </span>
                <ArrowRight className="text-white" />
              </div>
            </>
          )
          const cls =
            'group block overflow-hidden rounded-[30px] shadow-[4px_4px_3.5px_rgba(139,169,139,0.25)] transition-transform hover:-translate-y-1'
          return card.url ? (
            // 頁內 # 錨點（TA 導流）走平滑捲動；其餘維持原生連結
            <AnchorLink className={cls} href={card.url} key={card.id ?? i}>
              {inner}
            </AnchorLink>
          ) : (
            <div className={cls} key={card.id ?? i}>
              {inner}
            </div>
          )
        })}
      </ScrollReveal>
    </div>
  </section>
)

/**
 * variant photoBand：頁尾全幅照片 CTA 帶（About 54:234，1440×360）——
 * 滿版照片（取第 1 張卡的圖）＋置中亮綠 pill 按鈕；多張卡＝多顆按鈕並排
 * （School 85:357：「加入照顧學校 →」＋「了解課程內容 →」兩顆）
 */
const PhotoBand: React.FC<{ cards: TaCtaCard[] }> = ({ cards }) => {
  const bg = cards[0]
  // 按鈕 hover/press 變色、白字、0.3s（Tracy node 45:240/86:363）：左 #adcb59、右 #dcd020
  const pill = (card: TaCtaCard, i: number) => (
    <span
      className={cn(
        'btn-cft inline-flex items-center gap-2 rounded-[30px] px-7 py-2 text-[16px] font-medium tracking-[0.1em] shadow-sm md:px-8 md:py-2.5 md:text-[19px]',
        i === 0 ? 'btn-lime' : 'btn-highlight',
      )}
    >
      {card.buttonLabel ?? card.title}
      <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
    </span>
  )
  return (
    <section className="relative h-[240px] w-full overflow-hidden md:h-[360px]" data-block="taCta">
      {bg.image && typeof bg.image === 'object' ? (
        <Media
          resource={bg.image}
          imgClassName="absolute inset-0 h-full w-full object-cover"
          className="absolute inset-0"
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-brand-green" />
      )}
      {/* 區塊進場 Fade In（Tracy node 45:240：滑到觸發、0→100%、0.6s） */}
      <ScrollReveal className="relative flex h-full flex-wrap items-center justify-center gap-4 md:gap-6">
        {cards.map((card, i) =>
          card.url ? (
            <a aria-label={card.buttonLabel ?? card.title} href={card.url} key={i}>
              {pill(card, i)}
            </a>
          ) : (
            <React.Fragment key={i}>{pill(card, i)}</React.Fragment>
          ),
        )}
      </ScrollReveal>
    </section>
  )
}

/**
 * variant darkBand：School 頁尾 CTA（Figma 85:357）——深灰底 #4C4C4C + 兩顆實心 pill
 * （加入照顧學校＝灰綠 #8BA98B；了解課程內容＝亮綠 #ADCB59），置中並排、區塊 Fade In。
 */
const DarkBand: React.FC<{ cards: TaCtaCard[] }> = ({ cards }) => {
  const pill = (card: TaCtaCard, i: number) => (
    <span
      className={cn(
        'btn-cft inline-flex items-center gap-2 rounded-[30px] px-7 py-2.5 text-[16px] font-medium tracking-[0.1em] shadow-sm md:px-9 md:py-3 md:text-[19px]',
        i === 0 ? 'btn-green' : 'btn-lime',
      )}
    >
      {card.buttonLabel ?? card.title}
      <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
    </span>
  )
  return (
    <section className="w-full bg-[#4C4C4C] py-14 md:py-20" data-block="taCta">
      <ScrollReveal className="container flex max-w-[1240px] flex-col items-center justify-center gap-4 sm:flex-row md:gap-7">
        {cards.map((card, i) =>
          card.url ? (
            <a aria-label={card.buttonLabel ?? card.title} href={card.url} key={i}>
              {pill(card, i)}
            </a>
          ) : (
            <React.Fragment key={i}>{pill(card, i)}</React.Fragment>
          ),
        )}
      </ScrollReveal>
    </section>
  )
}

export const TaCtaBlock: React.FC<TaCtaBlockProps> = ({ variant, intro, cards }) => {
  if (!cards || cards.length === 0) return null
  // 指向聯絡頁的 CTA 在渲染層補 #sheet（不依賴 CMS DB，staging 直接生效）
  const normalized = cards.map((card) => ({ ...card, url: normalizeCtaHref(card.url) }))
  if (variant === 'photoCards') return <PhotoCards cards={normalized} intro={intro} />
  if (variant === 'photoBand') return <PhotoBand cards={normalized} />
  if (variant === 'darkBand') return <DarkBand cards={normalized} />
  return <Tiles cards={normalized} />
}
