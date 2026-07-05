import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

// slug 未 localized，zh 與 EN 共用同一 slug。
// 每個頁面對應兩條路由：zh `/${slug}`（或 `/`）與 EN `/en/${slug}`（或 `/en`）。
// 重要：EN 頁的媒體會於 render 階段沿用 zh-TW（見 inheritLocalizedMedia），
// 因此「發佈任一語言」都必須同時 revalidate 兩條路由，否則改 zh 後 EN 仍是舊快取。
const pathsForSlug = (slug?: string | null): string[] =>
  slug === 'home' ? ['/', '/en'] : [`/${slug}`, `/en/${slug}`]

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const paths = pathsForSlug(doc.slug)

      payload.logger.info(`Revalidating page at paths: ${paths.join(', ')}`)

      paths.forEach((path) => revalidatePath(path))
      revalidateTag('pages-sitemap', 'max')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPaths = pathsForSlug(previousDoc.slug)

      payload.logger.info(`Revalidating old page at paths: ${oldPaths.join(', ')}`)

      oldPaths.forEach((path) => revalidatePath(path))
      revalidateTag('pages-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    pathsForSlug(doc?.slug).forEach((path) => revalidatePath(path))
    revalidateTag('pages-sitemap', 'max')
  }

  return doc
}
