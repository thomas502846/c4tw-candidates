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
      label: '輪播（每張圖搭配自己的文字）',
      labels: {
        singular: '輪播圖',
        plural: '輪播圖',
      },
      admin: {
        description:
          '每張圖可設定各自的標題/副標/按鈕——想全部一樣就填一樣，想每張不同就分別填。圖與文字會一起滑動切換。',
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
        {
          name: 'title',
          type: 'text',
          label: '主標題',
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
    },
  ],
}
