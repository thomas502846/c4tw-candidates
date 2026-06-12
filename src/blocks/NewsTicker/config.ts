import type { Block } from 'payload'

export const NewsTicker: Block = {
  slug: 'newsTicker',
  interfaceName: 'NewsTickerBlock',
  labels: {
    singular: '跑馬燈最新消息',
    plural: '跑馬燈最新消息',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: '消息項目',
      labels: {
        singular: '消息',
        plural: '消息',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: '消息文字',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址（可選）',
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: '啟用',
          defaultValue: true,
        },
      ],
    },
  ],
}
