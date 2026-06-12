import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'

import { ContactForm } from '../../contact/ContactForm'
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

      {/* Top: CMS-managed intro / contact info blocks for the contact page doc */}
      {page && (
        <>
          <RenderHero {...page.hero} />
          <RenderBlocks blocks={page.layout} locale="en" />
        </>
      )}

      {/* Bottom: fixed contact form (not CMS-managed, per client decision) */}
      <div className="container mt-12 max-w-3xl">
        <header className="mb-10">
          <h1 className="text-brand-green mb-4 text-4xl font-semibold">
            {page ? 'Write to Us' : 'Contact Us'}
          </h1>
          <p className="text-muted-foreground text-lg">
            Whatever your question along the caregiving journey, we are happy to hear from you.
            Leave a message and we will get back to you within 3 business days.
          </p>
        </header>
        <ContactForm locale="en" />
      </div>
    </article>
  )
}
