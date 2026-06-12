import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const TimelineEvents: CollectionConfig = {
  slug: 'timeline-events',
  labels: {
    singular: '大事紀',
    plural: '大事紀',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  versions: true,
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['year', 'title', 'sortOrder'],
  },
  fields: [
    {
      name: 'year',
      label: '年份',
      type: 'number',
      required: true,
      min: 1900,
      max: 2200,
      admin: {
        description: '西元年，例如 2017',
      },
    },
    {
      name: 'title',
      label: '標題',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      label: '說明',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'sortOrder',
      label: '排序',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: '數字小的排前面；同年份可用此欄位調整先後',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
