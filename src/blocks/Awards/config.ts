import type { Block } from 'payload'

import { futureCollectionSlug } from '../futureSlug'

export const Awards: Block = {
  slug: 'awards',
  interfaceName: 'AwardsBlock',
  labels: {
    singular: '獎項展示',
    plural: '獎項展示',
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      label: '資料來源',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: '手動輸入', value: 'manual' },
        { label: '引用獎項資料（awards）', value: 'collection' },
      ],
    },
    {
      name: 'awards',
      type: 'relationship',
      // NOTE(接線): awards collection 建立後可移除 futureCollectionSlug cast
      relationTo: futureCollectionSlug('awards'),
      hasMany: true,
      label: '引用獎項',
      admin: {
        condition: (_data, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: '獎項項目',
      labels: {
        singular: '獎項',
        plural: '獎項',
      },
      admin: {
        condition: (_data, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'year',
              type: 'text',
              label: '年',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'month',
              type: 'text',
              label: '月（可選）',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'name',
          type: 'text',
          label: '獎項名稱',
          required: true,
        },
        {
          name: 'recipient',
          type: 'text',
          label: '獲獎別稱',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: '頒獎照（可選）',
        },
      ],
    },
  ],
}
