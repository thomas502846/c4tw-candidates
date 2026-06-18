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
    {
      name: 'gradient',
      type: 'select',
      label: '綠帶顏色',
      defaultValue: 'sage',
      options: [
        { label: '灰綠（認識創照）', value: 'sage' },
        { label: '亮綠（服務／培力）', value: 'lime' },
      ],
      admin: { description: '左側綠帶的顏色。認識創照用灰綠；AIO 服務／組織培力用亮綠。' },
    },
    {
      name: 'focal',
      type: 'select',
      label: '照片裁切位置',
      defaultValue: 'top',
      options: [
        { label: '對齊上方（人物臉部在上半部時用）', value: 'top' },
        { label: '置中', value: 'center' },
        { label: '對齊下方', value: 'bottom' },
      ],
      admin: {
        description:
          '綠帶高度固定，照片會被裁切。若照片重點（例如人物臉部）在上半部，選「對齊上方」；在中間選「置中」。',
      },
    },
  ],
}
