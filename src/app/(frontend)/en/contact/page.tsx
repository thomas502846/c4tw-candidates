import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'

import { ContactSection } from '../../contact/ContactSection'
import { queryContactPage } from '../../contact/queryContactPage'

const FALLBACK_METADATA: Metadata = {
  title: 'Contact Us | Care For Taiwan',
  description:
    'Questions about family care services, organizational training, or media inquiries — leave us a message and we will reply within 3 business days.',
}

const ALTERNATES: Metadata['alternates'] = {
  canonical: '/en/contact',
  languages: {
    'zh-TW': '/contact',
    en: '/en/contact',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryContactPage('en')
  const meta = page ? await generateMeta({ doc: page }) : FALLBACK_METADATA
  return { ...meta, alternates: ALTERNATES }
}

export default async function ContactPageEn() {
  const { isEnabled: draft } = await draftMode()
  const page = await queryContactPage('en')

  return (
    <article className="pt-16 pb-24">
      {draft && <LivePreviewListener />}

      {/* Top: CMS-managed page banner (pageHeader block) */}
      {page ? (
        <>
          <RenderHero {...page.hero} />
          <RenderBlocks blocks={page.layout} locale="en" />
        </>
      ) : (
        /* Fallback green banner when no CMS doc exists (mirrors pageHeader no-image state) */
        <section className="relative -mt-16 flex h-[260px] flex-col justify-center bg-brand-green md:h-[400px]">
          <div className="container flex max-w-[1140px] flex-col gap-3.5 pt-2">
            <h1 className="text-[32px] font-bold tracking-[0.1em] text-white md:text-[40px]">
              Contact Us
            </h1>
            <p className="text-[17px] font-medium uppercase tracking-[0.1em] text-white md:text-[19px]">
              CONTACT
            </p>
          </div>
        </section>
      )}

      {/* Bottom: form + contact info side by side (form not CMS-managed, per client decision) */}
      <ContactSection locale="en" />
    </article>
  )
}
