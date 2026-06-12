import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'

import { ContactForm } from './ContactForm'
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

      {/* 上方：CMS contact doc 的介紹／聯絡資訊區塊（客戶可在後台維護） */}
      {page && (
        <>
          <RenderHero {...page.hero} />
          <RenderBlocks blocks={page.layout} locale="zh-TW" />
        </>
      )}

      {/* 下方：固定的聯絡表單（不入 CMS，客戶定案） */}
      <div className="container mt-12 max-w-3xl">
        <header className="mb-10">
          <h1 className="text-brand-green mb-4 text-4xl font-semibold">
            {page ? '寫信給我們' : '聯絡我們'}
          </h1>
          <p className="text-muted-foreground text-lg">
            照顧的路上有任何想問的，都歡迎寫信給我們。留下訊息後，我們會在 3
            個工作天內回覆您。
          </p>
        </header>
        <ContactForm locale="zh-TW" />
      </div>
    </article>
  )
}
