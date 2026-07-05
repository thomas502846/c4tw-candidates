import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { inheritLocalizedMedia } from '@/utilities/inheritLocalizedMedia'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { LivePreviewBlockReceiver } from '@/components/LivePreviewBlockSync/Receiver'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

export type Locale = 'zh-TW' | 'en'

type Args = {
  params: Promise<{
    slug?: string
    locale?: Locale
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home', locale = 'zh-TW' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = (locale === 'en' ? '/en/' : '/') + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  // 頁首由 CMS 的 pageHeader block 提供（原 hardcode InnerPageBanner 已移除，避免與 seed 的 pageHeader 疊雙頁首）
  const hasPageHeader = (layout ?? []).some((block) => block.blockType === 'pageHeader')

  // a11y/SEO：pageHeader 與 hero block 都會渲染 h1；兩者皆無的頁補一個 sr-only h1
  const hasH1 = hasPageHeader || (layout ?? []).some((block) => block.blockType === 'hero')

  return (
    <article
      className={hasPageHeader ? 'pb-24' : 'pt-16 pb-24'}
      data-page={decodedSlug}
      lang={locale === 'en' ? 'en' : undefined}
    >
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}
      {draft && <LivePreviewBlockReceiver />}

      {!hasH1 && <h1 className="sr-only">{page.title}</h1>}
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} locale={locale} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home', locale = 'zh-TW' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: Locale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const doc = result.docs?.[0] || null

  // EN 媒體沿用中文版：layout 整個 localized，兩語言各存一份；EN 區塊留空的媒體
  // 欄位（照片／影片／framePos）用同一份文件的 zh-TW 版回填。EN 自設＝覆寫。
  // 以文件 id 取 zh-TW 版（slug 可能 localized，故不用 slug 反查）。
  if (doc && locale === 'en') {
    try {
      const zhDoc = await payload.findByID({
        collection: 'pages',
        id: doc.id,
        draft,
        overrideAccess: draft,
        locale: 'zh-TW',
      })
      inheritLocalizedMedia(doc, zhDoc)
    } catch {
      // zh-TW 版取不到時不影響 EN 既有渲染
    }
  }

  return doc
})
