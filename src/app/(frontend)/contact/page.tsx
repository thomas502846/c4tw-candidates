import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'

import { ContactSection } from './ContactSection'
import { queryContactPage } from './queryContactPage'

const FALLBACK_METADATA: Metadata = {
  title: '聯絡我們 | Care For Taiwan 創照服務設計',
  description:
    '想了解家庭照顧服務、組織培力，或洽談媒體採訪，歡迎留下訊息，我們會在 3 個工作天內回覆。',
}

const ALTERNATES: Metadata['alternates'] = {
  canonical: '/contact',
  languages: {
    'zh-TW': '/contact',
    en: '/en/contact',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryContactPage('zh-TW')
  const meta = page ? await generateMeta({ doc: page }) : FALLBACK_METADATA
  return { ...meta, alternates: ALTERNATES }
}

export default async function ContactPage() {
  const { isEnabled: draft } = await draftMode()
  const page = await queryContactPage('zh-TW')

  return (
    <article className="pt-16 pb-24">
      {draft && <LivePreviewListener />}

      {/* 上方：CMS contact doc 的頁首 Banner（pageHeader block，客戶可在後台換圖） */}
      {page ? (
        <>
          <RenderHero {...page.hero} />
          <RenderBlocks blocks={page.layout} locale="zh-TW" />
        </>
      ) : (
        /* CMS 無資料時的 fallback 綠帶（樣式同 pageHeader 無圖狀態） */
        <section className="relative -mt-16 flex h-[260px] flex-col justify-center bg-brand-green md:h-[400px]">
          <div className="container flex max-w-[1240px] flex-col gap-3.5 pt-2">
            <h1 className="text-[32px] font-bold tracking-[0.1em] text-white md:text-[40px]">
              聯絡我們
            </h1>
            <p className="text-[17px] font-medium uppercase tracking-[0.1em] text-white md:text-[19px]">
              CONTACT
            </p>
          </div>
        </section>
      )}

      {/* 下方：表單＋聯絡資訊左右並排（Figma Frame 120；表單不入 CMS，客戶定案） */}
      <ContactSection locale="zh-TW" />
    </article>
  )
}
