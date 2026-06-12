import type { Metadata } from 'next'

import PageTemplate, { generateMetadata as localizedGenerateMetadata } from '../../[slug]/page'

// English pages: /en/[slug] — renders the same page documents with the `en` locale
export { generateStaticParams } from '../../[slug]/page'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function EnPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  return PageTemplate({ params: Promise.resolve({ slug, locale: 'en' as const }) })
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  return localizedGenerateMetadata({ params: Promise.resolve({ slug, locale: 'en' as const }) })
}
