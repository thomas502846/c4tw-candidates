import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']
type Locale = 'zh-TW' | 'en'

async function getGlobal<T extends Global>(
  slug: T,
  depth = 0,
  locale?: Locale,
): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    ...(locale ? { locale } : {}),
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0, locale?: Locale) =>
  unstable_cache(async () => getGlobal<T>(slug, depth, locale), [slug, String(depth), locale ?? ''], {
    tags: [`global_${slug}`],
  })
