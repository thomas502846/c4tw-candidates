'use client'

import React, { useActionState, useState } from 'react'

import { cn } from '@/utilities/ui'

import { submitContactForm, type ContactFormState } from './actions'
import { CONTACT_CATEGORIES, type ContactCategory } from './categories'

type Locale = 'zh-TW' | 'en'

// 欄位與文案依 Sheet contact 02：您的姓名／單位或稱呼／聯繫電話／電子信箱／想諮詢的服務＋訊息欄
// ⚠️ 待客戶確認：「3 個工作天內回覆」（afterSubmitHint）為自擬句，Sheet 未明定回覆時效，客戶定案前先保留。
//    同句另見 actions.ts（成功回執信）與 page.tsx（meta description），確認後三處需一併更新。
const COPY = {
  'zh-TW': {
    taHeading: '想諮詢的服務',
    name: '您的姓名',
    organization: '單位或稱呼',
    phone: '聯繫電話',
    email: '電子信箱',
    message: '訊息內容',
    messagePlaceholder: '歡迎留下您的訊息，我們會協助您找到適合的資源與方向...',
    submit: '送出',
    submitting: '送出中…',
    afterSubmitHint: '送出後我們會在 3 個工作天內回覆您',
    successTitle: '訊息已送出',
    sendAnother: '再寫一則訊息',
  },
  en: {
    taHeading: 'What would you like to ask about?',
    name: 'Your name',
    organization: 'Organization or how to address you',
    phone: 'Phone',
    email: 'Email',
    message: 'Message',
    messagePlaceholder:
      'Leave us a message — we will help you find the right resources and direction...',
    submit: 'Send',
    submitting: 'Sending…',
    afterSubmitHint: 'We will get back to you within 3 business days',
    successTitle: 'Message sent',
    sendAnother: 'Write another message',
  },
} satisfies Record<Locale, Record<string, string>>

const initialState: ContactFormState = { status: 'idle' }

// Figma contact（41:156 補充版）：白底＋#8BA98B 細邊 pill 輸入框（placeholder 置中）、
// 方形圓角勾選框一列選服務、#ADCB59 整欄寬 pill 送出鈕
const pillInputClass =
  'h-[54px] w-full rounded-full border-[1.5px] border-brand-green bg-white px-5 text-center text-base text-brand-ink placeholder:text-brand-ink/60 transition-colors focus-visible:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 md:h-[62px]'

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

      {/* 基本欄位（Sheet 順序：姓名→單位或稱呼→聯繫電話→電子信箱）；placeholder 即欄位名 */}
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
          <label htmlFor="contact-organization" className="sr-only">
            {t.organization}
          </label>
          <input
            id="contact-organization"
            name="organization"
            maxLength={100}
            placeholder={t.organization}
            autoComplete="organization"
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
      </div>

      {/* 想諮詢的服務（Sheet：家庭照顧服務｜組織培力｜組織合作｜媒體採訪）
          Figma 視覺＝方形圓角勾選框一列；行為維持單選（radio，送信邏輯不動） */}
      <fieldset>
        <legend className="text-brand-muted mb-3 text-[17px] font-medium tracking-[0.05em] md:text-[19px]">
          {t.taHeading}
        </legend>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {CONTACT_CATEGORIES.map((c) => (
            <label
              key={c.value}
              className={cn(
                'flex cursor-pointer items-center gap-2 text-base transition-colors',
                category === c.value ? 'text-brand-ink font-medium' : 'text-brand-ink',
              )}
            >
              <input
                type="radio"
                name="category"
                value={c.value}
                checked={category === c.value}
                onChange={() => setCategory(c.value)}
                className="border-brand-green checked:bg-brand-green size-[18px] shrink-0 appearance-none rounded-[4px] border-[1.5px] bg-white transition-colors focus-visible:ring-brand-primary/40 focus-visible:outline-none focus-visible:ring-2"
                required
              />
              {categoryLabel(c)}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 訊息內容：placeholder 照 Sheet */}
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
          className="border-brand-green text-brand-ink placeholder:text-brand-ink/60 focus-visible:border-brand-primary focus-visible:ring-brand-primary/30 min-h-[200px] w-full rounded-[30px] border-[1.5px] bg-white px-7 py-6 text-base transition-colors focus-visible:outline-none focus-visible:ring-2"
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
          className="bg-brand-lime hover:bg-brand-primary inline-flex h-[62px] w-full items-center justify-center rounded-full text-[17px] font-medium tracking-[0.1em] text-white transition-colors disabled:pointer-events-none disabled:opacity-60 md:h-[70px] md:text-[19px]"
        >
          {isPending ? t.submitting : t.submit}
        </button>
        <p className="text-brand-muted text-sm">{t.afterSubmitHint}</p>
      </div>
    </form>
  )
}
