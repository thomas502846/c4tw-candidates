// 聯絡表單的多 TA 分類；server action 與表單元件共用
export const CONTACT_CATEGORIES = [
  {
    value: 'family',
    zh: '一般家庭：照顧服務諮詢',
    en: 'Families: care service inquiry',
    zhDescription: '想為家人找照顧服務、安排照顧計畫，或不確定從哪裡開始',
    enDescription: 'Looking for care services or a care plan for your family',
  },
  {
    value: 'org',
    zh: '機構組織：培力與合作',
    en: 'Organizations: training & partnership',
    zhDescription: '想為團隊安排培力課程，或洽談組織合作',
    enDescription: 'Team training programs and organizational partnerships',
  },
  {
    value: 'media',
    zh: '媒體：採訪與報導',
    en: 'Media: interviews & coverage',
    zhDescription: '採訪邀約、資料索取與報導合作',
    enDescription: 'Interview requests, press materials, and media collaboration',
  },
  {
    value: 'other',
    zh: '其他',
    en: 'Other',
    zhDescription: '不在以上類別的事，都歡迎寫信告訴我們',
    enDescription: 'Anything else you would like to tell us',
  },
] as const

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number]['value']
