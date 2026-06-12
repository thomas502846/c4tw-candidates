// 聯絡表單「想諮詢的服務」選項（Sheet contact 02 定案：家庭照顧服務｜組織培力｜組織合作｜媒體採訪）
export const CONTACT_CATEGORIES = [
  {
    value: 'family',
    zh: '家庭照顧服務',
    en: 'Family care services',
  },
  {
    value: 'training',
    zh: '組織培力',
    en: 'Organizational training',
  },
  {
    value: 'partnership',
    zh: '組織合作',
    en: 'Organizational partnership',
  },
  {
    value: 'media',
    zh: '媒體採訪',
    en: 'Media inquiries',
  },
] as const

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number]['value']
