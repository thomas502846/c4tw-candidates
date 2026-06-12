import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: '首頁主視覺（KV 輪播）',
    plural: '首頁主視覺（KV 輪播）',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      label: '輪播圖片',
      labels: {
        singular: '圖片',
        plural: '圖片',
      },
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '圖片',
          required: true,
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: '主標題',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: '副標題',
    },
    {
      name: 'cta',
      type: 'group',
      label: '行動按鈕（CTA）',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: '按鈕文字',
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址',
        },
      ],
    },
  ],
}
