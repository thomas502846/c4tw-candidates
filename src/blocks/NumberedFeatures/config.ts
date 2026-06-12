import type { Block } from 'payload'

export const NumberedFeatures: Block = {
  slug: 'numberedFeatures',
  interfaceName: 'NumberedFeaturesBlock',
  labels: {
    singular: '編號特色大區（01/02/03）',
    plural: '編號特色大區（01/02/03）',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: '眉標（英文小標，只顯示在第一項，如 Service）',
    },
    {
      name: 'items',
      type: 'array',
      label: '特色項目（自動交錯：奇數項左文右圖＋米色帶、偶數項左圖右文白底）',
      labels: {
        singular: '項目',
        plural: '項目',
      },
      minRows: 1,
      fields: [
        {
          name: 'number',
          type: 'text',
          label: '編號（如 01）',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: '標題',
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
          label: '內文',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '圖片',
        },
      ],
    },
  ],
}
