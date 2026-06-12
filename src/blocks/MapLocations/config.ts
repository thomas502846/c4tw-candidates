import type { Block } from 'payload'

export const MapLocations: Block = {
  slug: 'mapLocations',
  interfaceName: 'MapLocationsBlock',
  labels: {
    singular: '據點地圖（在地地形＋pin）',
    plural: '據點地圖（在地地形＋pin）',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: '眉標（如 CFT Space）',
    },
    {
      name: 'title',
      type: 'text',
      label: '標題（如：羅布森空間）',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: '粗體副標（如：照顧學校的培訓場域）',
    },
    {
      name: 'body',
      type: 'textarea',
      label: '內文（換行＝分段）',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '地圖插畫（不填則以內建水彩地形 SVG 呈現）',
    },
    {
      name: 'locations',
      type: 'array',
      label: '據點 pin',
      labels: {
        singular: '據點',
        plural: '據點',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: '據點名稱（如：臺中溪尾）',
          required: true,
        },
        {
          name: 'nameEn',
          type: 'text',
          label: '英文名（如：Taichung,Xiwei）',
        },
      ],
    },
  ],
}
