import React from 'react'

import HoverZoomImage from '@/components/HoverZoomImage'
import { Media } from '@/components/Media'
import ScrollReveal from '@/components/ScrollReveal'
import { cn } from '@/utilities/ui'
import type { Media as MediaDoc } from '@/payload-types'

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
  variant?: 'tiles' | 'photoCards' | 'photoBand' | null
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

// Home CTA 三磚 TA 線稿插圖（Figma 236:378 / 239:510 / 239:719，白色線稿，無底）
// 依卡片順序套用；CMS 後續若上傳 image 則優先用 image。
const taTileIcons = [
  '/figma/home-ta-icon-1-cft.svg',
  '/figma/home-ta-icon-2-service.svg',
  '/figma/home-ta-icon-3-org.svg',
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

/** 白底 pill 按鈕（Tracy LINE 定稿：白底 #FFFFFF + 深字 #212121 + 深色箭頭） */
const WhitePill: React.FC<{ label: string; url?: string | null }> = ({ label, url }) => {
  const inner = (
    <>
      {label}
      <ArrowRight className="h-4 w-4" />
    </>
  )
  const cls =
    'inline-flex items-center gap-2 rounded-[30px] bg-white px-6 py-2 text-[15px] font-medium tracking-[0.1em] text-brand-ink transition-opacity hover:opacity-85 md:px-7 md:text-[19px]'
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
  const horizontal = (card: TaCtaCard, i: number) => (
    <div
      key={card.id ?? i}
      className={cn(
        'flex items-center gap-6 rounded-[30px] px-7 py-7 md:h-[180px] md:px-9',
        tileBgs[i % tileBgs.length],
      )}
    >
      <CardIllustration
        card={card}
        className="hidden h-[110px] w-[110px] md:block lg:h-[140px] lg:w-[140px]"
        fallbackSrc={taTileIcons[i]}
      />
      {/* Figma：標語與白底 pill 在卡片右半置中對齊 */}
      <div className="flex flex-1 flex-col items-center gap-4">
        <h3 className="text-lg font-medium tracking-[0.1em] text-white md:text-[22px]">{card.title}</h3>
        {card.buttonLabel && <WhitePill label={card.buttonLabel} url={card.url} />}
      </div>
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
              'flex flex-col items-center justify-center gap-6 rounded-[30px] px-8 py-10 text-center',
              tileBgs[2],
            )}
          >
            <CardIllustration
              card={c3}
              className="h-[150px] w-[200px] md:h-[200px] md:w-[200px]"
              fallbackSrc={taTileIcons[2]}
            />
            <h3 className="text-lg font-medium tracking-[0.1em] text-white md:text-[22px]">{c3.title}</h3>
            {c3.buttonLabel && <WhitePill label={c3.buttonLabel} url={c3.url} />}
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
            <a className={cls} href={card.url} key={card.id ?? i}>
              {inner}
            </a>
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

export const TaCtaBlock: React.FC<TaCtaBlockProps> = ({ variant, intro, cards }) => {
  if (!cards || cards.length === 0) return null
  if (variant === 'photoCards') return <PhotoCards cards={cards} intro={intro} />
  if (variant === 'photoBand') return <PhotoBand cards={cards} />
  return <Tiles cards={cards} />
}
