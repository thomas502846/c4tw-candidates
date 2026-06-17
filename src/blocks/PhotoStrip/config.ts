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
      admin: {
        description: '勾選後，在電腦上捲動頁面時整條照片帶會緩慢橫向移動，做出動態效果。不確定可以不勾。',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: '照片（桌機等分排列，建議 5 張）',
      labels: {
        singular: '照片',
        plural: '照片',
      },
      admin: {
        description:
          '一張一張加上要排成橫帶的照片，建議放 5 張、方向一致（都用橫式或都用直式），畫面才會整齊。',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: '上傳一張照片。建議每張寬度 1200px 以上、方向和其他照片一致，會以接近 4:3 置中裁切顯示。',
          },
        },
      ],
    },
  ],
}
