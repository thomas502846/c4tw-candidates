import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'

import type { Category, Post } from '@/payload-types'

export type CategoryCount = {
  id: string | number
  title: string
  slug?: string | null
  count: number
}

const publishedWhere = { _status: { equals: 'published' } }

/** 所有分類 + 每個分類的已發布文章數（側欄「創照分享」用） */
export async function getCategoriesWithCounts(): Promise<CategoryCount[]> {
  const payload = await getPayload({ config: configPromise })
  const cats = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'createdAt',
    overrideAccess: false,
  })
  return Promise.all(
    cats.docs.map(async (c: Category) => {
      const { totalDocs } = await payload.count({
        collection: 'posts',
        overrideAccess: false,
        where: { categories: { in: [c.id] }, ...publishedWhere },
      })
      return { id: c.id, title: c.title, slug: c.slug, count: totalDocs }
    }),
  )
}

/** 點閱最高的文章（側欄「熱門內容」用；views 由前台瀏覽累加） */
export async function getPopularPosts(limit = 5): Promise<Pick<Post, 'id' | 'title' | 'slug'>[]> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    limit,
    sort: '-views',
    overrideAccess: false,
    where: publishedWhere,
    select: { title: true, slug: true },
  })
  return docs
}

/** 同分類的上一篇 / 下一篇（Blog Single 最下方）——依 publishedAt 排序 */
export async function getAdjacentPosts(post: Post): Promise<{ prev: Post | null; next: Post | null }> {
  const payload = await getPayload({ config: configPromise })
  const catIds = (post.categories ?? [])
    .map((c) => (typeof c === 'object' ? c.id : c))
    .filter(Boolean) as (string | number)[]
  const pubAt = post.publishedAt ?? post.createdAt

  const mkWhere = (op: 'less_than' | 'greater_than'): Where => {
    const w: Where = {
      _status: { equals: 'published' },
      id: { not_equals: post.id },
      publishedAt: { [op]: pubAt },
    }
    if (catIds.length) w.categories = { in: catIds }
    return w
  }

  const [prev, next] = await Promise.all([
    payload.find({
      collection: 'posts',
      limit: 1,
      overrideAccess: false,
      sort: '-publishedAt',
      where: mkWhere('less_than'),
      select: { title: true, slug: true },
    }),
    payload.find({
      collection: 'posts',
      limit: 1,
      overrideAccess: false,
      sort: 'publishedAt',
      where: mkWhere('greater_than'),
      select: { title: true, slug: true },
    }),
  ])
  return { prev: (prev.docs[0] as Post) ?? null, next: (next.docs[0] as Post) ?? null }
}
