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
      admin: {
        description: '每一筆是一則跑馬燈消息，會輪流向上捲動顯示。可以新增、刪除、拖曳調整順序。',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: '消息文字',
          required: true,
          maxLength: 1000,
          admin: {
            description: '填一則消息的文字。電腦版只顯示一行、過長會被切掉，建議 25 個字以內。',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址（可選）',
          admin: {
            description: '想讓這則消息可以點進去就填網址。站內可以填以斜線開頭的路徑，例如 /news/123；站外請填完整網址。不填就只是純文字。',
          },
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
