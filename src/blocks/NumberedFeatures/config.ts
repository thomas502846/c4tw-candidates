import type { Block } from 'payload'

import { responsiveFramePosition } from '@/fields/responsiveFramePosition'

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
      maxLength: 200,
      admin: {
        description:
          '填整區最上方的一行英文小標，例如 Service，可以不填。只會顯示在第一個項目上方，建議在 12 個字母以內。',
      },
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
          maxLength: 200,
          admin: {
            description: '填這個項目的序號，例如 01、02、03。只放兩位數字就好。',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: '標題',
          required: true,
          maxLength: 200,
          admin: {
            description: '填這個項目的標題。建議在 14 個字以內，太長會擠到旁邊的序號。',
          },
        },
        {
          name: 'text',
          type: 'textarea',
          label: '內文',
          required: true,
          admin: {
            description: '填這個項目的說明段落，可以多行，按 Enter 換行就會分行顯示。',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '圖片',
          admin: {
            description:
              '上傳這個項目右側（或左側）的照片。建議上傳寬度 768px 以上、接近 3:2 的橫式照片。',
          },
        },
        responsiveFramePosition({
          name: 'framePos',
          imageField: 'image',
          frames: { mobile: '59/40', tablet: '59/40', desktop: '59/40' },
        }),
      ],
    },
  ],
}
