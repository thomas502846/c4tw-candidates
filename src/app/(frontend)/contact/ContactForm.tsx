'use client'

import React, { useActionState, useState } from 'react'

import { cn } from '@/utilities/ui'

import { submitContactForm, type ContactFormState } from './actions'
import { CONTACT_CATEGORIES, type ContactCategory } from './categories'

type Locale = 'zh-TW' | 'en'

// 欄位與文案依 Sheet contact 02：您的姓名／單位或稱呼／聯繫電話／電子信箱／想諮詢的服務＋訊息欄
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
    successTitle: '訊息已送出',
    sendAnother: '再寫一則訊息',
    // 驗證訊息（zhtw-ui-copy：告訴使用者怎麼填對，不是只說哪裡錯）
    errRequired: '這欄要填寫',
    errName: '請填寫您的姓名',
    errOrganization: '請填寫單位或稱呼',
    errPhone: '請填寫聯繫電話',
    errPhoneFormat: '電話格式不太對，請填 09 開頭手機或含區碼市話',
    errEmail: '請填寫電子信箱',
    errEmailFormat: '信箱格式不太對，請確認有 @ 與網域（例：name@example.com）',
    errMessage: '請留下您想諮詢的內容',
    errFix: '還有欄位需要修正，請依各欄提示補齊後再送出',
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
    successTitle: 'Message sent',
    sendAnother: 'Write another message',
    errRequired: 'This field is required',
    errName: 'Please enter your name',
    errOrganization: 'Please enter your organization',
    errPhone: 'Please enter a phone number',
    errPhoneFormat: 'That phone number looks off — use a mobile (09…) or a number with area code',
    errEmail: 'Please enter your email',
    errEmailFormat: 'That email looks off — make sure it has @ and a domain (e.g. name@example.com)',
    errMessage: 'Please tell us what you would like to ask about',
    errFix: 'Some fields still need fixing — follow the hints, then send again',
  },
} satisfies Record<Locale, Record<string, string>>

// 台灣電話寬鬆 regex：手機 09xxxxxxxx、市話含區碼（0x-xxxxxxx）、可帶 +886、空白、橫線、括號
const PHONE_RE = /^(\+?886[-\s]?|0)(9\d{2}[-\s]?\d{3}[-\s]?\d{3}|[1-8]\d?[-\s)]?\d{6,8})$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type FieldKey = 'name' | 'organization' | 'phone' | 'email' | 'message'
type Errors = Partial<Record<FieldKey, string>>

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

  // 前端即時驗證：欄位值、錯誤、已互動（touched）
  const [values, setValues] = useState<Record<FieldKey, string>>({
    name: '',
    organization: '',
    phone: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({})

  const validateField = (key: FieldKey, raw: string): string | undefined => {
    const v = raw.trim()
    if (key === 'name') return v ? undefined : t.errName
    if (key === 'organization') return v ? undefined : t.errOrganization
    if (key === 'message') return v ? undefined : t.errMessage
    if (key === 'phone') {
      if (!v) return t.errPhone
      return PHONE_RE.test(v) ? undefined : t.errPhoneFormat
    }
    if (key === 'email') {
      if (!v) return t.errEmail
      return EMAIL_RE.test(v) ? undefined : t.errEmailFormat
    }
    return undefined
  }

  const validateAll = (): Errors => {
    const next: Errors = {}
    ;(Object.keys(values) as FieldKey[]).forEach((key) => {
      const err = validateField(key, values[key])
      if (err) next[key] = err
    })
    return next
  }

  const onFieldChange = (key: FieldKey, raw: string) => {
    setValues((prev) => ({ ...prev, [key]: raw }))
    // 已互動過的欄位即時重新驗證，給「邊填邊修正」回饋
    if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: validateField(key, raw) }))
    }
  }

  const onFieldBlur = (key: FieldKey) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    setErrors((prev) => ({ ...prev, [key]: validateField(key, values[key]) }))
  }

  const hasErrors = Object.values(errors).some(Boolean)

  // 送出前攔截：全欄驗證，有錯就阻擋並聚焦第一個錯誤欄
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const next = validateAll()
    setErrors(next)
    setTouched({ name: true, organization: true, phone: true, email: true, message: true })
    if (Object.values(next).some(Boolean)) {
      e.preventDefault()
      const firstKey = (Object.keys(next) as FieldKey[]).find((k) => next[k])
      if (firstKey) {
        const el = e.currentTarget.querySelector<HTMLElement>(`[name="${firstKey}"]`)
        el?.focus()
      }
    }
  }

  const errId = (key: FieldKey) => `contact-${key}-error`
  const fieldError = (key: FieldKey) =>
    touched[key] && errors[key] ? (
      <p id={errId(key)} className="text-destructive mt-1.5 pl-5 text-sm" role="alert">
        {errors[key]}
      </p>
    ) : null
  const invalidClass = (key: FieldKey) =>
    touched[key] && errors[key] ? '!border-destructive focus-visible:!ring-destructive/30' : ''

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
    <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
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
            value={values.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            onBlur={() => onFieldBlur('name')}
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? errId('name') : undefined}
            className={cn(pillInputClass, invalidClass('name'))}
          />
          {fieldError('name')}
        </div>
        <div>
          <label htmlFor="contact-organization" className="sr-only">
            {t.organization}
          </label>
          <input
            id="contact-organization"
            name="organization"
            required
            maxLength={100}
            placeholder={t.organization}
            autoComplete="organization"
            value={values.organization}
            onChange={(e) => onFieldChange('organization', e.target.value)}
            onBlur={() => onFieldBlur('organization')}
            aria-invalid={Boolean(touched.organization && errors.organization)}
            aria-describedby={
              touched.organization && errors.organization ? errId('organization') : undefined
            }
            className={cn(pillInputClass, invalidClass('organization'))}
          />
          {fieldError('organization')}
        </div>
        <div>
          <label htmlFor="contact-phone" className="sr-only">
            {t.phone}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            maxLength={30}
            placeholder={t.phone}
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            onBlur={() => onFieldBlur('phone')}
            aria-invalid={Boolean(touched.phone && errors.phone)}
            aria-describedby={touched.phone && errors.phone ? errId('phone') : undefined}
            className={cn(pillInputClass, invalidClass('phone'))}
          />
          {fieldError('phone')}
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
            inputMode="email"
            value={values.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            onBlur={() => onFieldBlur('email')}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? errId('email') : undefined}
            className={cn(pillInputClass, invalidClass('email'))}
          />
          {fieldError('email')}
        </div>
      </div>

      {/* 想諮詢的服務（Sheet：家庭照顧服務｜組織培力｜組織合作｜媒體採訪）
          Figma 視覺＝方形圓角勾選框；行為維持單選（radio，送信邏輯不動）
          mobile（M-contact）＝乾淨 2×2 grid；桌機 ≥sm 維持四項並排一列 */}
      <fieldset>
        <legend className="text-brand-muted mb-3 text-[17px] font-medium tracking-[0.05em] md:text-[19px]">
          {t.taHeading}
        </legend>
        <div className="grid grid-cols-2 gap-x-5 gap-y-3 sm:flex sm:flex-wrap">
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
          value={values.message}
          onChange={(e) => onFieldChange('message', e.target.value)}
          onBlur={() => onFieldBlur('message')}
          aria-invalid={Boolean(touched.message && errors.message)}
          aria-describedby={touched.message && errors.message ? errId('message') : undefined}
          className={cn(
            'border-brand-green text-brand-ink placeholder:text-brand-ink/60 focus-visible:border-brand-primary focus-visible:ring-brand-primary/30 min-h-[200px] w-full rounded-[30px] border-[1.5px] bg-white px-7 py-6 text-base transition-colors focus-visible:outline-none focus-visible:ring-2',
            invalidClass('message'),
          )}
        />
        {fieldError('message')}
      </div>

      {/* 前端驗證彙整提示（任何欄位已互動且未通過時顯示） */}
      {hasErrors && (
        <p
          className="border-destructive/40 bg-destructive/10 text-destructive rounded-[20px] border px-5 py-3 text-sm"
          role="alert"
        >
          {t.errFix}
        </p>
      )}

      {state.status === 'error' && (
        <p
          className="border-destructive/40 bg-destructive/10 text-destructive rounded-[20px] border px-5 py-3 text-sm"
          role="alert"
        >
          {state.message}
        </p>
      )}

      {/* 送出鈕：整欄寬 pill。送出鈕下方原有「3 個工作天內回覆」一行，
          Figma M-contact 與文案 Sheet 皆無，依文字真理＝Sheet 移除（2026-06-14）。 */}
      <button
        type="submit"
        disabled={isPending || hasErrors}
        aria-disabled={isPending || hasErrors}
        className="btn-contact-submit inline-flex h-[62px] w-full items-center justify-center rounded-full text-[17px] font-medium tracking-[0.1em] disabled:pointer-events-none disabled:opacity-60 md:h-[70px] md:text-[19px]"
      >
        {isPending ? t.submitting : t.submit}
      </button>
    </form>
  )
}
