import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

/** 後台儲存 global 後讓前台的 unstable_cache 失效（tag = global_<slug>） */
export const revalidateGlobal =
  (slug: string): GlobalAfterChangeHook =>
  ({ doc, req: { payload, context } }) => {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating global: ${slug}`)

      revalidateTag(`global_${slug}`, 'max')
    }

    return doc
  }
