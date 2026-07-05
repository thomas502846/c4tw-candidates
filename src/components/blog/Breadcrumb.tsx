import Link from 'next/link'
import React from 'react'

export type Crumb = { label: string; href?: string }

/** 麵包屑（落在 banner 上，白字；hover → #dcd020，Tracy 2026-07-05） */
export const Breadcrumb: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav
    aria-label="breadcrumb"
    className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] tracking-[0.1em] text-white/85"
  >
    {items.map((c, i) => (
      <span className="flex items-center gap-2" key={i}>
        {c.href ? (
          <Link className="transition-colors duration-300 hover:text-brand-highlight" href={c.href}>
            {c.label}
          </Link>
        ) : (
          <span aria-current="page">{c.label}</span>
        )}
        {i < items.length - 1 && <span aria-hidden>›</span>}
      </span>
    ))}
  </nav>
)
