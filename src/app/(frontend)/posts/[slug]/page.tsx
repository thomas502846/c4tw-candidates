import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Category, Post } from '@/payload-types'

import { BlogBanner } from '@/components/blog/BlogBanner'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { Media } from '@/components/Media'
import { ViewPing } from '@/components/blog/ViewPing'
import { getAdjacentPosts, getCategoriesWithCounts, getPopularPosts } from '@/utilities/blogData'
import type { Crumb } from '@/components/blog/Breadcrumb'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

const firstCategory = (post: Post): Category | null => {
  const c = post.categories?.[0]
  return c && typeof c === 'object' ? c : null
}

const formatDate = (value?: string | null): string => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const [categories, popular, adjacent] = await Promise.all([
    getCategoriesWithCounts(),
    getPopularPosts(5),
    getAdjacentPosts(post),
  ])

  const cat = firstCategory(post)
  const coverRaw = post.heroImage ?? post.meta?.image
  const coverImg = coverRaw && typeof coverRaw === 'object' ? coverRaw : null

  const breadcrumb: Crumb[] = [
    { label: '首頁', href: '/' },
    { label: '創照分享', href: '/posts' },
    ...(cat ? [{ label: cat.title, href: `/posts?category=${cat.slug}` }] : []),
    { label: post.title },
  ]

  return (
    <article className="pb-24" lang="zh-TW">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <ViewPing postId={post.id} />

      <BlogBanner
        breadcrumb={breadcrumb}
        subtitle={formatDate(post.publishedAt)}
        title={post.title}
      />

      <div className="container max-w-[1140px] pt-12 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          <div className="min-w-0">
            {coverImg && (
              <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-[16px] bg-brand-surface">
                <Media resource={coverImg} imgClassName="h-full w-full object-cover" fill priority />
              </div>
            )}

            <RichText
              className="max-w-none prose-headings:tracking-[0.08em] prose-headings:text-brand-ink prose-h2:text-[24px] prose-h2:font-bold prose-h3:text-[20px] prose-h3:font-bold prose-h4:text-[18px] prose-h4:font-medium prose-p:text-[16px] prose-p:leading-[1.95] prose-p:tracking-[0.06em] prose-p:text-brand-ink prose-a:text-brand-primary prose-strong:text-brand-ink prose-li:text-brand-ink prose-img:rounded-[16px]"
              data={post.content}
              enableGutter={false}
            />

            {/* 上一篇 / 下一篇（同分類）——Tracy 2026-07-05 */}
            {(adjacent.prev || adjacent.next) && (
              <div className="mt-14 grid gap-4 border-t border-brand-green/25 pt-8 sm:grid-cols-2">
                <div>
                  {adjacent.prev && (
                    <Link
                      className="group flex flex-col gap-1"
                      href={`/posts/${adjacent.prev.slug}`}
                    >
                      <span className="text-[13px] tracking-[0.1em] text-brand-muted">« 上一篇</span>
                      <span className="line-clamp-1 text-[15px] font-medium tracking-[0.06em] text-brand-ink transition-colors duration-300 group-hover:text-brand-primary">
                        {adjacent.prev.title}
                      </span>
                    </Link>
                  )}
                </div>
                <div className="sm:text-right">
                  {adjacent.next && (
                    <Link
                      className="group flex flex-col gap-1 sm:items-end"
                      href={`/posts/${adjacent.next.slug}`}
                    >
                      <span className="text-[13px] tracking-[0.1em] text-brand-muted">下一篇 »</span>
                      <span className="line-clamp-1 text-[15px] font-medium tracking-[0.06em] text-brand-ink transition-colors duration-300 group-hover:text-brand-primary">
                        {adjacent.next.title}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          <BlogSidebar activeSlug={cat?.slug ?? undefined} categories={categories} popular={popular} />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })
  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
