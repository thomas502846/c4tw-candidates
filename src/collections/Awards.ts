import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Awards: CollectionConfig = {
  slug: 'awards',
  labels: {
    singular: '獲獎紀錄',
    plural: '獲獎紀錄',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  versions: true,
  defaultSort: '-year',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['year', 'month', 'name', 'alias'],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'year',
          label: '年份',
          type: 'number',
          required: true,
          min: 1900,
          max: 2200,
          admin: {
            width: '50%',
            description: '西元年，例如 2023',
          },
        },
        {
          name: 'month',
          label: '月份',
          type: 'number',
          min: 1,
          max: 12,
          admin: {
            width: '50%',
            description: '選填，1–12',
          },
        },
      ],
    },
    {
      name: 'name',
      label: '獎項名',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'alias',
      label: '獲獎別稱',
      type: 'text',
      localized: true,
      admin: {
        description: '例如獲獎單位別稱或獎項簡稱，選填',
      },
    },
    {
      name: 'photo',
      label: '照片',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: '選填',
      },
    },
  ],
  timestamps: true,
}
