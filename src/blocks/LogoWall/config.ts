import type { Block } from 'payload'

export const LogoWall: Block = {
  slug: 'logoWall',
  interfaceName: 'LogoWallBlock',
  labels: {
    singular: 'Logo 牆',
    plural: 'Logo 牆',
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      label: '資料來源',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: '夥伴資料（partners）', value: 'partners' },
        { label: '手動輸入', value: 'manual' },
      ],
    },
    {
      name: 'partnerType',
      type: 'text',
      label: '夥伴類型篩選',
      admin: {
        description: '對應 partners collection 的 type 值；留空表示全部',
        condition: (_data, siblingData) => siblingData?.source === 'partners',
      },
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logo 清單',
      labels: {
        singular: 'Logo',
        plural: 'Logo',
      },
      admin: {
        condition: (_data, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo 圖檔',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          label: '名稱',
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址（可選）',
        },
      ],
    },
  ],
}
