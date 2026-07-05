import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'
import type { CategoryCount } from '@/utilities/blogData'

const PillLink: React.FC<{ href: string; label: string; active: boolean }> = ({
  href,
  label,
  active,
}) => (
  <Link
    className={cn(
      'rounded-[30px] border px-5 py-2 text-[14px] font-medium tracking-[0.06em] transition-colors duration-300 md:text-[15px]',
      active
        ? 'border-brand-primary bg-brand-primary text-white'
        : 'border-brand-primary/40 text-brand-primary hover:border-brand-primary hover:bg-brand-primary hover:text-white',
    )}
    href={href}
  >
    {label}
  </Link>
)

/** 分類過濾 pill 列（Archive 頂部）：第一顆「最新消息」=全部；hover bg #9C9F33 白字（Tracy） */
export const CategoryPills: React.FC<{
  categories: CategoryCount[]
  activeSlug?: string
}> = ({ categories, activeSlug }) => (
  <div className="flex flex-wrap justify-center gap-3">
    <PillLink active={!activeSlug} href="/posts" label="最新消息" />
    {categories.map((c) => (
      <PillLink
        active={activeSlug === c.slug}
        href={`/posts?category=${c.slug}`}
        key={c.id}
        label={c.title}
      />
    ))}
  </div>
)
