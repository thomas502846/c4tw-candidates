import type { Block } from 'payload'

import { futureCollectionSlug } from '../futureSlug'

export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: {
    singular: '時間軸大事紀',
    plural: '時間軸大事紀',
  },
  fields: [
    {
      name: 'mode',
      type: 'select',
      label: '資料來源',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: '手動輸入', value: 'manual' },
        { label: '引用大事紀資料（timeline-events）', value: 'reference' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: '大事紀項目',
      labels: {
        singular: '項目',
        plural: '項目',
      },
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'manual',
      },
      fields: [
        {
          name: 'date',
          type: 'text',
          label: '年份／日期',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: '標題',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: '一句話描述',
        },
      ],
    },
    {
      name: 'events',
      type: 'relationship',
      // NOTE(接線): timeline-events collection 建立後可移除 futureCollectionSlug cast
      relationTo: futureCollectionSlug('timeline-events'),
      hasMany: true,
      label: '引用大事紀',
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'reference',
      },
    },
  ],
}
