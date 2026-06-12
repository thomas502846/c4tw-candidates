import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { revalidateGlobal } from './hooks/revalidateGlobal'

export const SiteFooter: GlobalConfig = {
  slug: 'site-footer',
  label: '頁尾',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal('site-footer')],
  },
  fields: [
    {
      name: 'columns',
      label: '欄位群',
      labels: {
        singular: '欄位',
        plural: '欄位群',
      },
      type: 'array',
      admin: {
        initCollapsed: true,
        description: '頁尾的連結欄位，拖拉可調整順序',
      },
      fields: [
        {
          name: 'title',
          label: '欄位標題',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'links',
          label: '連結',
          labels: {
            singular: '連結',
            plural: '連結',
          },
          type: 'array',
          fields: [
            {
              name: 'label',
              label: '名稱',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'url',
              label: '連結',
              type: 'text',
              required: true,
              admin: {
                description: '內部頁填路徑（例如 /care）；外連填完整網址',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'familyVentures',
      label: '家族事業導覽',
      labels: {
        singular: '家族事業',
        plural: '家族事業',
      },
      type: 'array',
      admin: {
        initCollapsed: true,
        description: '例如：創照服務設計、照顧學校、伯拉罕、鄰里123、Connect 10',
      },
      fields: [
        {
          name: 'name',
          label: '名稱',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'url',
          label: '連結',
          type: 'text',
          admin: {
            description: '選填，完整網址',
          },
        },
      ],
    },
    {
      name: 'socialLinks',
      label: '社群連結',
      labels: {
        singular: '社群連結',
        plural: '社群連結',
      },
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'platform',
          label: '平台',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LINE', value: 'line' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: '其他', value: 'other' },
          ],
        },
        {
          name: 'url',
          label: '連結',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'copyright',
      label: '版權字串',
      type: 'text',
      localized: true,
      admin: {
        description: '例如：© 2026 創照服務設計有限公司 All rights reserved.',
      },
    },
  ],
}
