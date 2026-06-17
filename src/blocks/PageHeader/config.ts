import type { Block } from 'payload'

export const PageHeader: Block = {
  slug: 'pageHeader',
  interfaceName: 'PageHeaderBlock',
  labels: {
    singular: '頁首綠帶 Banner',
    plural: '頁首綠帶 Banner',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '頁面標題（如：認識創照）',
      required: true,
      maxLength: 200,
      admin: {
        description: '填這個頁面的大標題，會顯示在綠帶左側最大的白字。建議 12 個字以內。',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: '英文副標（如：ABOUT）',
      maxLength: 200,
      admin: {
        description: '填標題上方的英文小字，通常用大寫，例如 ABOUT。沒有就留空。',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '背景照片（左綠右漸層壓圖；不填則整面灰綠）',
      admin: {
        description:
          '放綠帶的背景照片，左側會壓上綠色、右側漸層透出照片。建議上傳寬度 1920px 以上的橫式照片，重點畫面放在右半邊比較看得到。不放的話整條會是純綠色。',
      },
    },
  ],
}
