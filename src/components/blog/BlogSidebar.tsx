import Link from 'next/link'
import React from 'react'

import type { CategoryCount } from '@/utilities/blogData'
import type { Post } from '@/payload-types'

const WidgetTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mb-4 flex items-center gap-2.5 border-b border-brand-green/25 pb-3 text-[17px] font-bold tracking-[0.1em] text-brand-green">
    <span aria-hidden className="inline-block h-[13px] w-[13px] shrink-0 rounded-full bg-brand-highlight" />
    {children}
  </h2>
)

/**
 * 部落格側欄（Blog Category / Single 右側）：分類清單＋數量、熱門內容。
 * sticky 固定於視窗、隨捲動可見、到父層底（≈Footer 前）停止（Tracy 2026-07-05）。
 */
export const BlogSidebar: React.FC<{
  categories: CategoryCount[]
  popular: Pick<Post, 'id' | 'title' | 'slug'>[]
  activeSlug?: string
}> = ({ categories, popular, activeSlug }) => (
  <aside className="flex flex-col gap-10 lg:sticky lg:top-24 lg:self-start">
    <section>
      <WidgetTitle>創照分享</WidgetTitle>
      <ul className="flex flex-col gap-2.5">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              className={
                'flex items-center justify-between gap-3 text-[15px] tracking-[0.08em] transition-colors duration-300 hover:text-brand-primary ' +
                (activeSlug === c.slug ? 'font-medium text-brand-primary' : 'text-brand-ink')
              }
              href={`/posts?category=${c.slug}`}
            >
              <span>{c.title}</span>
              <span className="text-brand-muted">({c.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>

    {popular.length > 0 && (
      <section>
        <WidgetTitle>熱門內容</WidgetTitle>
        <ul className="flex flex-col gap-3">
          {popular.map((p) => (
            <li key={p.id}>
              <Link
                className="line-clamp-2 text-[15px] leading-[1.7] tracking-[0.06em] text-brand-ink transition-colors duration-300 hover:text-brand-primary hover:underline"
                href={`/posts/${p.slug}`}
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )}
  </aside>
)
