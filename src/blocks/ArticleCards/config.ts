import type { Block } from 'payload'

export const ArticleCards: Block = {
  slug: 'articleCards',
  interfaceName: 'ArticleCardsBlock',
  labels: {
    singular: '文章卡組（案例故事／媒體報導）',
    plural: '文章卡組（案例故事／媒體報導）',
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      label: '卡片來源',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: '案例故事（case-stories）', value: 'case-stories' },
        { label: '媒體報導（media-coverage）', value: 'media-coverage' },
        { label: '手動卡片', value: 'manual' },
      ],
    },
    {
      name: 'batchSize',
      type: 'number',
      label: '每批顯示數',
      defaultValue: 3,
      min: 1,
    },
    {
      name: 'enableLoadMore',
      type: 'checkbox',
      label: '顯示「載入更多」',
      defaultValue: true,
    },
    {
      name: 'cards',
      type: 'array',
      label: '手動卡片',
      labels: {
        singular: '卡片',
        plural: '卡片',
      },
      admin: {
        condition: (_data, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '卡片圖（可選）',
        },
        {
          name: 'title',
          type: 'text',
          label: '標題',
          required: true,
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: '摘要',
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址',
        },
      ],
    },
  ],
}
