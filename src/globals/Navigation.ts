import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { revalidateGlobal } from './hooks/revalidateGlobal'

const navLinkFields = [
  {
    name: 'label',
    label: '名稱',
    type: 'text' as const,
    required: true,
    localized: true,
  },
  {
    name: 'type',
    label: '連結類型',
    type: 'select' as const,
    required: true,
    defaultValue: 'internal',
    options: [
      {
        label: '內部頁',
        value: 'internal',
      },
      {
        label: '外連',
        value: 'external',
      },
    ],
  },
  {
    name: 'url',
    label: '連結',
    type: 'text' as const,
    required: true,
    admin: {
      description: '內部頁填路徑（例如 /about）；外連填完整網址（例如 https://school.carefortaiwan.com.tw）',
    },
  },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: '主選單',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal('navigation')],
  },
  fields: [
    {
      name: 'items',
      label: '主項目',
      labels: {
        singular: '主項目',
        plural: '主項目',
      },
      type: 'array',
      admin: {
        initCollapsed: true,
        description: '拖拉可調整順序',
      },
      fields: [
        ...navLinkFields,
        {
          name: 'highlight',
          label: '強調顯示（CTA 樣式）',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'subItems',
          label: '子項目',
          labels: {
            singular: '子項目',
            plural: '子項目',
          },
          type: 'array',
          admin: {
            initCollapsed: true,
            description: '選填；有子項目時前台顯示下拉選單，拖拉可調整順序',
          },
          fields: [...navLinkFields],
        },
      ],
    },
  ],
}
