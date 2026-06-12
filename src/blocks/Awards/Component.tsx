import React from 'react'

import { Media } from '@/components/Media'
import type { Award, Media as MediaDoc } from '@/payload-types'

type AwardItem = {
  year: string
  month?: string | null
  name: string
  recipient?: string | null
  photo?: MediaDoc | string | number | null
  id?: string | null
}

// 暫定型別：與 config.ts 對齊；payload-types 重新生成後可改用 generated type
export type AwardsBlockProps = {
  blockType: 'awards'
  source?: 'manual' | 'collection' | null
  awards?: (number | Award)[] | null
  items?: AwardItem[] | null
  locale?: 'zh-TW' | 'en'
}

type Entry = {
  year: string
  name: string
  recipient?: string | null
  photo?: MediaDoc | string | number | null
  key: string
}

// Figma 獲獎記錄：左標題+bullet 清單、右大圖 rounded-30
const AwardsLayout: React.FC<{ entries: Entry[]; locale: 'zh-TW' | 'en' }> = ({
  entries,
  locale,
}) => {
  const photo = entries.find((entry) => entry.photo && typeof entry.photo === 'object')?.photo

  return (
    <section className="container" data-block="awards">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-14">
        <div className="md:w-1/2">
          {/* 眉標 + 標題（全站 pattern：圓點 + 英文眉標 + H1 灰綠） */}
          <p className="flex items-center gap-2.5 text-[15px] tracking-[0.1em] text-brand-muted md:text-[16px]">
            <span
              aria-hidden
              className="inline-block h-[13px] w-[13px] rounded-full bg-brand-highlight"
            />
            Awards
          </p>
          <h2 className="mt-3 text-[28px] font-bold tracking-[0.1em] text-brand-green md:text-[40px]">
            {locale === 'en' ? 'Awards' : '獲獎記錄'}
          </h2>

          <ul className="mt-8 flex flex-col gap-4">
            {entries.map((entry) => (
              <li
                className="flex gap-2 text-[15px] leading-[1.8] tracking-[0.08em] text-brand-ink md:text-[16px]"
                key={entry.key}
              >
                <span aria-hidden className="shrink-0">
                  ・
                </span>
                <p>
                  <span className="mr-2 font-medium">{entry.year}</span>
                  {entry.name}
                  {entry.recipient && (
                    <span className="ml-2 text-[14px] text-brand-muted">{entry.recipient}</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-1/2">
          {photo ? (
            <Media
              imgClassName="aspect-[59/40] w-full rounded-[30px] object-cover"
              resource={photo}
            />
          ) : (
            <div aria-hidden className="aspect-[59/40] w-full rounded-[30px] bg-brand-surface" />
          )}
        </div>
      </div>
    </section>
  )
}

export const AwardsBlock: React.FC<AwardsBlockProps> = ({
  source,
  awards,
  items,
  locale = 'zh-TW',
}) => {
  let entries: Entry[] = []

  if (source === 'collection') {
    const docs = (awards ?? []).filter(
      (award): award is Award => typeof award === 'object' && award !== null,
    )
    entries = [...docs]
      .sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0))
      .map((award) => ({
        year: String(award.year),
        name: award.name,
        recipient: award.alias,
        photo: award.photo,
        key: String(award.id),
      }))
  } else {
    entries = (items ?? []).map((item, i) => ({
      year: item.year,
      name: item.name,
      recipient: item.recipient,
      photo: item.photo,
      key: item.id ?? String(i),
    }))
  }

  if (entries.length === 0) return null

  return <AwardsLayout entries={entries} locale={locale} />
}
