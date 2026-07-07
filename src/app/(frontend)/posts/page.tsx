import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { BlogBanner } from '@/components/blog/BlogBanner'
import { BlogPagination } from '@/components/blog/BlogPagination'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { CategoryPills } from '@/components/blog/CategoryPills'
import { PostCard } from '@/components/blog/PostCard'
import { getCategoriesWithCounts, getPopularPosts } from '@/utilities/blogData'
import type { Crumb } from '@/components/blog/Breadcrumb'
import PageClient from './page.client'

type Args = {
  searchParams: Promise<{ category?: string; page?: string }>
}

const GRID_LIMIT = 9
const LIST_LIMIT = 6

export default async function Page({ searchParams }: Args) {
  const { category: catSlug, page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)

  const payload = await getPayload({ config: configPromise })
  const categories = await getCategoriesWithCounts()
  const activeCat = catSlug ? categories.find((c) => c.slug === catSlug) : undefined
  const isCategoryView = Boolean(activeCat)

  const where = {
    _status: { equals: 'published' },
    ...(activeCat ? { categories: { in: [activeCat.id] } } : {}),
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: isCategoryView ? LIST_LIMIT : GRID_LIMIT,
    page,
    overrideAccess: false,
    sort: '-publishedAt',
    where,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      publishedAt: true,
    },
  })

  const popular = isCategoryView ? await getPopularPosts(5) : []

  const makeHref = (p: number): string => {
    const sp = new URLSearchParams()
    if (catSlug) sp.set('category', catSlug)
    if (p > 1) sp.set('page', String(p))
    const q = sp.toString()
    return `/posts${q ? `?${q}` : ''}`
  }

  const breadcrumb: Crumb[] = [
    { label: '首頁', href: '/' },
    { label: '創照分享', href: '/posts' },
    ...(activeCat ? [{ label: activeCat.title }] : []),
  ]

  return (
    <article className="pb-32 md:pb-48">
      <PageClient />
      <BlogBanner
        breadcrumb={breadcrumb}
        eyebrow={activeCat ? undefined : 'INSIGHTS'}
        title={activeCat ? activeCat.title : '創照分享'}
      />

      <div className="container max-w-[1140px] pt-12 md:pt-16">
        <CategoryPills activeSlug={catSlug} categories={categories} />

        {posts.docs.length === 0 ? (
          <p className="mt-20 text-center text-[15px] tracking-[0.1em] text-brand-muted">
            這個分類目前還沒有文章。
          </p>
        ) : isCategoryView ? (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
            <div>
              <div className="flex flex-col gap-24">
                {posts.docs.map((post) => (
                  <PostCard key={post.id} post={post} variant="list" />
                ))}
              </div>
              <BlogPagination makeHref={makeHref} page={page} totalPages={posts.totalPages} />
            </div>
            <BlogSidebar activeSlug={catSlug} categories={categories} popular={popular} />
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-x-16 gap-y-24 sm:grid-cols-2 lg:grid-cols-3">
              {posts.docs.map((post) => (
                <PostCard key={post.id} post={post} variant="grid" />
              ))}
            </div>
            <BlogPagination makeHref={makeHref} page={page} totalPages={posts.totalPages} />
          </>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ searchParams }: Args): Promise<Metadata> {
  const { category: catSlug } = await searchParams
  const title = catSlug ? `創照分享 | Care For Taiwan 創照服務設計` : `創照分享 | Care For Taiwan 創照服務設計`
  return { title }
}
