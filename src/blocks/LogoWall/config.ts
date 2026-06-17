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
      admin: {
        description: '選「手動輸入」就在這個區塊直接上傳每個 Logo；選「夥伴資料」則自動抓夥伴資料庫的 Logo。',
      },
    },
    {
      name: 'partnerType',
      type: 'text',
      label: '夥伴類型篩選',
      maxLength: 200,
      admin: {
        description: '只想顯示某一類夥伴時填類別名稱，留空就顯示全部夥伴。',
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
        description: '一筆一個 Logo，會並排顯示成一面 Logo 牆。可以新增多個。',
        condition: (_data, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo 圖檔',
          required: true,
          admin: {
            description: '上傳這個夥伴的 Logo。建議用 SVG 或去背的 PNG，背景透明在白底卡片上最好看。',
          },
        },
        {
          name: 'name',
          type: 'text',
          label: '名稱',
          maxLength: 200,
          admin: {
            description: '填這個 Logo 代表的單位名稱。畫面上不會直接顯示，是給點擊連結與無障礙朗讀用的，建議照樣填寫。',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址（可選）',
          admin: {
            description: '填點擊 Logo 後要前往的網址，例如對方官網。記得連 https:// 一起填。沒有連結可以留空。',
          },
        },
      ],
    },
  ],
}
