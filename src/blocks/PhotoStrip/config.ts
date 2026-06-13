import type { Block } from 'payload'

// photowall（Figma 85:287）：課程回顧與羅布森空間之間的滿版 5 格照片橫帶
export const PhotoStrip: Block = {
  slug: 'photoStrip',
  interfaceName: 'PhotoStripBlock',
  labels: {
    singular: '照片橫帶（滿版多格）',
    plural: '照片橫帶（滿版多格）',
  },
  fields: [
    {
      name: 'parallax',
      type: 'checkbox',
      label: '橫向視差（care photowall 263:431：捲動時整帶緩慢橫移）',
      defaultValue: false,
    },
    {
      name: 'images',
      type: 'array',
      label: '照片（桌機等分排列，建議 5 張）',
      labels: {
        singular: '照片',
        plural: '照片',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
