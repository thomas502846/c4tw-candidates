import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const CaseStories: CollectionConfig = {
  slug: 'case-stories',
  labels: {
    singular: '案例故事',
    plural: '案例故事',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  versions: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'page', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      label: '標題',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'summary',
      label: '摘要',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: '列表卡片顯示的簡短摘要',
      },
    },
    {
      name: 'body',
      label: '內文',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      label: '圖片',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'page',
      label: '顯示頁面',
      type: 'select',
      required: true,
      options: [
        {
          label: '家庭照顧服務',
          value: 'care',
        },
        {
          label: '組織培力',
          value: 'training',
        },
      ],
      admin: {
        description: '這則案例故事要出現在哪個頁面',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
