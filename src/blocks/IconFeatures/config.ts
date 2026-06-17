import type { Block } from 'payload'

export const IconFeatures: Block = {
  slug: 'iconFeatures',
  interfaceName: 'IconFeaturesBlock',
  labels: {
    singular: 'Icon 卡組（橫卡列／直立綠卡）',
    plural: 'Icon 卡組（橫卡列／直立綠卡）',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: '版型',
      required: true,
      defaultValue: 'cards',
      options: [
        { label: '米色橫卡列（icon 左＋標題說明右，4 欄）', value: 'cards' },
        { label: '直立綠卡（深淺綠輪替，5 欄）', value: 'pillars' },
        { label: '學員角色（icon 上＋標題說明，置中 4 欄）', value: 'roles' },
      ],
      admin: {
        description:
          '選擇卡片排列方式。米色橫卡列適合放一排功能或步驟說明，建議放 4 個項目；直立綠卡是站立式色卡，建議放 5 個項目；學員角色是 icon 在上、標題說明置中的 4 欄版型。',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: '區塊標題（學員角色版型用）',
      maxLength: 80,
      admin: {
        description: '只有「學員角色」版型會用到，顯示在卡片上方（例如「學員樣貌」）；其他版型可留空。',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: '項目',
      labels: {
        singular: '項目',
        plural: '項目',
      },
      minRows: 1,
      admin: {
        description: '逐一新增每一張卡片的內容。米色橫卡列建議放 4 個，直立綠卡建議放 5 個。',
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'icon（線稿圖；不填則以圓形佔位）',
          admin: {
            description:
              '上傳這張卡片的小圖示。建議上傳 SVG 或去背 PNG。不上傳時會自動帶入系統內建的線稿圖示。',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: '標題',
          required: true,
          maxLength: 200,
          admin: { description: '填這張卡片的標題，請簡短，建議 16 個字以內，太長會擠壓版面。' },
        },
        {
          name: 'text',
          type: 'textarea',
          label: '說明',
          maxLength: 1000,
          admin: { description: '填標題底下的補充說明，一兩句話即可，建議 60 個字以內。' },
        },
      ],
    },
  ],
}
