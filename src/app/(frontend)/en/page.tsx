import type { Metadata } from 'next'

import PageTemplate, { generateMetadata as localizedGenerateMetadata } from '../[slug]/page'

// English homepage: /en — renders the 'home' page document with the `en` locale
export default async function EnHomePage() {
  return PageTemplate({ params: Promise.resolve({ locale: 'en' as const }) })
}

export async function generateMetadata(): Promise<Metadata> {
  return localizedGenerateMetadata({ params: Promise.resolve({ locale: 'en' as const }) })
}
