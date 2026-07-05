import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

/** 頁碼序列：頭尾恆顯示、當前頁附近展開、其餘以 … 省略 */
function pageList(page: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out: (number | '…')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  if (start > 2) out.push('…')
  for (let i = start; i <= end; i++) out.push(i)
  if (end < total - 1) out.push('…')
  out.push(total)
  return out
}

/** 數字分頁（Archive/Category）：active #212121 白字；hover 同色（Tracy 2026-07-05）。 */
export const BlogPagination: React.FC<{
  page: number
  totalPages: number
  makeHref: (page: number) => string
}> = ({ page, totalPages, makeHref }) => {
  if (totalPages <= 1) return null
  const items = pageList(page, totalPages)
  const cellBase =
    'flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[15px] font-medium tracking-[0.05em] transition-colors duration-300'

  return (
    <nav aria-label="pagination" className="mt-14 flex items-center justify-center gap-2">
      {items.map((it, i) =>
        it === '…' ? (
          <span className="px-1 text-brand-muted" key={`e${i}`}>
            …
          </span>
        ) : it === page ? (
          <span aria-current="page" className={cn(cellBase, 'bg-brand-ink text-white')} key={it}>
            {it}
          </span>
        ) : (
          <Link
            className={cn(cellBase, 'text-brand-ink hover:bg-brand-ink hover:text-white')}
            href={makeHref(it)}
            key={it}
          >
            {it}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link
          className={cn(cellBase, 'text-brand-ink hover:bg-brand-ink hover:text-white')}
          href={makeHref(page + 1)}
        >
          下一頁 »
        </Link>
      )}
    </nav>
  )
}
