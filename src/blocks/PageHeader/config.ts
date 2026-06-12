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
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: '英文副標（如：ABOUT）',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '背景照片（左綠右漸層壓圖；不填則整面灰綠）',
    },
  ],
}
