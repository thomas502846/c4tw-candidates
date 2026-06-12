'use client'

import React, { useActionState, useState } from 'react'

import { cn } from '@/utilities/ui'

import { submitContactForm, type ContactFormState } from './actions'
import { CONTACT_CATEGORIES, type ContactCategory } from './categories'

type Locale = 'zh-TW' | 'en'

const COPY = {
  'zh-TW': {
    taHeading: '想詢問的服務',
    taHint: '選一個最接近的類別，我們會請對的夥伴回覆您',
    name: '您的姓名',
    email: '電子信箱',
    phone: '聯絡電話（選填）',
    message: '訊息內容',
    messagePlaceholder: '歡迎留下您的需求或想了解的事，越具體我們越能幫上忙',
    submit: '送出',
    submitting: '送出中…',
    afterSubmitHint: '送出後我們會在 3 個工作天內回覆您',
    successTitle: '訊息已送出',
    sendAnother: '再寫一則訊息',
  },
  en: {
    taHeading: 'What would you like to ask about?',
    taHint: 'Pick the closest category so the right person can reply',
    name: 'Your name',
    email: 'Email',
    phone: 'Phone (optional)',
    message: 'Message',
    messagePlaceholder: 'Tell us about your situation or what you would like to know',
    submit: 'Send',
    submitting: 'Sending…',
    afterSubmitHint: 'We will get back to you within 3 business days',
    successTitle: 'Message sent',
    sendAnother: 'Write another message',
  },
} satisfies Record<Locale, Record<string, string>>

const initialState: ContactFormState = { status: 'idle' }

// Figma contact（41:156）：淺綠底 pill 輸入框、radio 一列選服務、綠底白字 pill 送出鈕
const pillInputClass =
  'h-12 w-full rounded-full border border-transparent bg-brand-surface px-5 text-base text-brand-ink placeholder:text-brand-muted transition-colors focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 md:text-sm'

export const ContactForm: React.FC<{ locale?: Locale }> = ({ locale = 'zh-TW' }) => {
  // 送出成功後「再寫一則訊息」用 key 重掛整個表單，連 useActionState 一起歸零
  const [formKey, setFormKey] = useState(0)
  return (
    <ContactFormInner
      key={formKey}
      locale={locale}
      onReset={() => setFormKey((k) => k + 1)}
    />
  )
}

const ContactFormInner: React.FC<{ locale: Locale; onReset: () => void }> = ({
  locale,
  onReset,
}) => {
  const t = COPY[locale]
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [category, setCategory] = useState<ContactCategory>('family')

  const categoryLabel = (c: (typeof CONTACT_CATEGORIES)[number]) =>
    locale === 'en' ? c.en : c.zh
  const selected = CONTACT_CATEGORIES.find((c) => c.value === category)
  const selectedDescription = selected
    ? locale === 'en'
      ? selected.enDescription
      : selected.zhDescription
    : ''

  if (state.status === 'success') {
    return (
      <div
        className="bg-brand-surface rounded-[30px] p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <h2 className="text-brand-green mb-3 text-2xl font-semibold">{t.successTitle}</h2>
        <p className="text-brand-muted mb-6">{state.message}</p>
        <button
          type="button"
          onClick={onReset}
          className="border-brand-primary text-brand-primary hover:bg-brand-primary inline-flex h-11 items-center rounded-full border px-8 font-medium transition-colors hover:text-white"
        >
          {t.sendAnother}
        </button>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot：真人看不到也填不到；機器人填了會被擋 */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* 基本欄位：Figma 樣式 = 淺綠底 pill 輸入框，placeholder 即欄位名 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="sr-only">
            {t.name}
          </label>
          <input
            id="contact-name"
            name="name"
            required
            maxLength={100}
            placeholder={t.name}
            autoComplete="name"
            className={pillInputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="sr-only">
            {t.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder={t.email}
            autoComplete="email"
            className={pillInputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="sr-only">
            {t.phone}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            maxLength={30}
            placeholder={t.phone}
            autoComplete="tel"
            className={pillInputClass}
          />
        </div>
      </div>

      {/* 多 TA 入口：Figma = 「想詢問的服務」radio 一列 */}
      <fieldset>
        <legend className="text-brand-ink mb-1 font-medium">{t.taHeading}</legend>
        <p className="text-brand-muted mb-3 text-sm">{t.taHint}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {CONTACT_CATEGORIES.map((c) => (
            <label
              key={c.value}
              className={cn(
                'flex cursor-pointer items-center gap-2 text-base transition-colors md:text-sm',
                category === c.value ? 'text-brand-primary font-medium' : 'text-brand-ink',
              )}
            >
              <input
                type="radio"
                name="category"
                value={c.value}
                checked={category === c.value}
                onChange={() => setCategory(c.value)}
                className="accent-brand-primary size-4"
                required
              />
              {categoryLabel(c)}
            </label>
          ))}
        </div>
        {selectedDescription && (
          <p className="text-brand-muted mt-2 text-sm" aria-live="polite">
            {selectedDescription}
          </p>
        )}
      </fieldset>

      {/* 訊息內容：Figma = 圓角淺綠框 textarea */}
      <div>
        <label htmlFor="contact-message" className="sr-only">
          {t.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={3000}
          placeholder={t.messagePlaceholder}
          className="border-brand-lime/70 text-brand-ink placeholder:text-brand-muted focus-visible:border-brand-primary focus-visible:ring-brand-primary/30 w-full rounded-[20px] border bg-white px-5 py-4 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 md:text-sm"
        />
      </div>

      {state.status === 'error' && (
        <p
          className="border-destructive/40 bg-destructive/10 text-destructive rounded-[20px] border px-5 py-3 text-sm"
          role="alert"
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand-primary hover:bg-brand-green inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full font-medium text-white transition-colors disabled:pointer-events-none disabled:opacity-60"
        >
          {isPending ? t.submitting : t.submit}
        </button>
        <p className="text-brand-muted text-sm">{t.afterSubmitHint}</p>
      </div>
    </form>
  )
}
