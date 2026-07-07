import Link from 'next/link'
import React from 'react'

import { FramedImage } from '@/components/Media/FramedImage'
import { cn } from '@/utilities/ui'
import type { Category, Post } from '@/payload-types'

// 只取卡片會用到的欄位（配合列表查詢的 select 窄化型別）
export type PostCardData = Pick<
  Post,
  'id' | 'title' | 'slug' | 'categories' | 'meta' | 'heroImage' | 'coverFramePos'
>

const firstCategory = (post: PostCardData): Category | null => {
  const c = post.categories?.[0]
  return c && typeof c === 'object' ? c : null
}
// 封面優先用 heroImage（焦點欄位 coverFramePos 綁在 heroImage 上）
const cardImage = (post: PostCardData) => {
  const img = post.heroImage ?? post.meta?.image
  return img && typeof img === 'object' ? img : null
}

const titleLinkClass =
  'text-brand-green transition-colors duration-300 hover:text-brand-lime hover:underline'

/** 文章卡：grid（Archive 3 欄）／list（Category 單欄大卡＋往下閱讀）——Tracy 2026-07-05 */
export const PostCard: React.FC<{ post: PostCardData; variant?: 'grid' | 'list' }> = ({
  post,
  variant = 'grid',
}) => {
  const cat = firstCategory(post)
  const img = cardImage(post)
  const href = `/posts/${post.slug}`
  const excerpt = post.meta?.description
  const isList = variant === 'list'

  return (
    <article className="group flex flex-col">
      <Link
        aria-label={post.title}
        className="relative block aspect-[3/2] w-full overflow-hidden rounded-[16px] bg-brand-surface"
        href={href}
      >
        {img && (
          <FramedImage
            id={`postcard-${post.id}`}
            resource={img}
            framePos={post.coverFramePos}
            hoverZoom
            useParentGroup
          />
        )}
      </Link>

      {cat && (
        <Link
          className="mt-4 inline-flex w-fit rounded-[30px] bg-brand-primary px-3.5 py-1 text-[13px] font-medium tracking-[0.05em] text-white transition-colors duration-300 hover:bg-brand-green"
          href={`/posts?category=${cat.slug}`}
        >
          {cat.title}
        </Link>
      )}

      <h3 className={cn('mt-3', isList ? 'text-[20px] md:text-[22px]' : 'text-[18px]')}>
        <Link className={cn(titleLinkClass, 'font-bold leading-[1.6] tracking-[0.06em]')} href={href}>
          {post.title}
        </Link>
      </h3>

      {excerpt && (
        <p
          className={cn(
            'mt-2 text-[14px] leading-[1.85] tracking-[0.04em] text-brand-ink/75',
            isList ? 'line-clamp-3 md:text-[15px]' : 'line-clamp-2',
          )}
        >
          {excerpt}
        </p>
      )}

      {isList && (
        <Link
          className="mt-4 inline-flex w-fit items-center gap-1 text-[14px] font-medium tracking-[0.08em] text-brand-primary transition-colors duration-300 hover:underline"
          href={href}
        >
          往下閱讀 »
        </Link>
      )}
    </article>
  )
}
