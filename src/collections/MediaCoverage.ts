import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const MediaCoverage: CollectionConfig = {
  slug: 'media-coverage',
  labels: {
    singular: '媒體報導',
    plural: '媒體報導',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  versions: true,
  // 前台「3 篇＋載入更多」：依日期新到舊排序，搭配 limit/page 分頁查詢
  defaultSort: '-date',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'outlet', 'date'],
  },
  fields: [
    {
      name: 'title',
      label: '報導標題',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'outlet',
      label: '媒體名稱',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: '例如：聯合報、天下雜誌',
      },
    },
    {
      name: 'date',
      label: '報導日期',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'url',
      label: '報導連結',
      type: 'text',
      required: true,
      admin: {
        description: '完整網址，例如 https://...',
      },
    },
    {
      name: 'excerpt',
      label: '摘要',
      type: 'textarea',
      localized: true,
      admin: {
        description: '前台卡片顯示的簡短摘要，選填',
      },
    },
    {
      name: 'image',
      label: '圖片',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: '選填，未提供時前台可用預設樣式',
      },
    },
  ],
  timestamps: true,
}
