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
      admin: {
        description: '一張卡片是一個數據，例如「服務 120 個家庭」。可以新增多張並排顯示，建議放 3 到 4 張最整齊。',
      },
      fields: [
        {
          name: 'number',
          type: 'text',
          label: '數值',
          required: true,
          maxLength: 200,
          admin: {
            description: '填想強調的數字，例如 120、98。會以大字顯示，請只填數字本身，單位放在後綴欄。',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: '說明文字',
          required: true,
          maxLength: 60,
          admin: {
            description: '填數字下方的一行說明，例如「服務家庭數」「合作鄉鎮」。簡短一句最好看。',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          label: '單位／後綴（可選）',
          maxLength: 30,
          admin: {
            description: '填數字後面的單位，例如「人」「%」「個」。沒有單位可以留空。',
          },
        },
      ],
    },
  ],
}
