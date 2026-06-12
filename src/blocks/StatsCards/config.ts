import type { Block } from 'payload'

export const StatsCards: Block = {
  slug: 'statsCards',
  interfaceName: 'StatsCardsBlock',
  labels: {
    singular: '數據卡片組',
    plural: '數據卡片組',
  },
  fields: [
    {
      name: 'cards',
      type: 'array',
      label: '數據卡片',
      labels: {
        singular: '卡片',
        plural: '卡片',
      },
      fields: [
        {
          name: 'number',
          type: 'text',
          label: '數值',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: '說明文字',
          required: true,
        },
        {
          name: 'suffix',
          type: 'text',
          label: '單位／後綴（可選）',
        },
      ],
    },
  ],
}
