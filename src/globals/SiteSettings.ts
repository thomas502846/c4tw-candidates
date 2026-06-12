import type { GlobalConfig } from 'payload'

import { isAdmin, isAdminOrReviewer } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '網站設定',
  access: {
    // editor 不可碰網站設定（含收件信箱）；reviewer 可檢視、admin 可修改
    read: isAdminOrReviewer,
    update: isAdmin,
  },
  fields: [
    {
      name: 'inquiryRecipients',
      label: '聯絡表單收件信箱',
      labels: {
        singular: '收件信箱',
        plural: '收件信箱',
      },
      type: 'array',
      minRows: 1,
      admin: {
        description: '聯絡表單送出後，通知信會寄到這些信箱（可多個）',
      },
      fields: [
        {
          name: 'email',
          label: '信箱',
          type: 'email',
          required: true,
        },
      ],
    },
    {
      name: 'sesSender',
      label: '寄件人信箱（SES）',
      type: 'email',
      admin: {
        description: '系統寄出通知信時使用的寄件人，需先在 SES 完成驗證',
      },
    },
    {
      name: 'gaId',
      label: 'Google Analytics ID',
      type: 'text',
      admin: {
        description: '選填，例如 G-XXXXXXXXXX；目前僅保留欄位，前台尚未接',
      },
    },
  ],
}
