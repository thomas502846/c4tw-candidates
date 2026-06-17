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
      maxLength: 200,
      admin: {
        description: '填一行小標，放在主標題上方，可以放英文或服務名稱，例如 CFT Space。',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: '標題（如：羅布森空間）',
      maxLength: 200,
      admin: {
        description: '填這個區塊的大標題，建議在 12 個字以內，例如：羅布森空間。',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: '粗體副標（如：照顧學校的培訓場域）',
      maxLength: 200,
      admin: {
        description: '填一句副標，放在標題下方，用來補充說明，例如：照顧學校的培訓場域。',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: '內文（換行＝分段）',
      admin: {
        description: '填這個區塊的說明文字，按一次換行就會分成一個新段落。',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '地圖插畫（不填則以內建水彩地形 SVG 呈現）',
      admin: {
        description:
          '上傳一張地圖插畫放在右側。建議上傳寬度 600px 以上、橫式的圖。如果留空，系統會自動顯示內建的水彩地形圖。',
      },
    },
    {
      name: 'locations',
      type: 'array',
      label: '據點 pin',
      labels: {
        singular: '據點',
        plural: '據點',
      },
      admin: {
        description: '一個一個加上要標記在地圖上的據點，每個據點會在地圖上顯示一個定位圖釘和名稱。',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: '據點名稱（如：臺中溪尾）',
          required: true,
          maxLength: 200,
          admin: {
            description: '填這個據點的中文名稱，例如：臺中溪尾。',
          },
        },
        {
          name: 'nameEn',
          type: 'text',
          label: '英文名（如：Taichung,Xiwei）',
          maxLength: 200,
          admin: {
            description: '填這個據點的英文名稱（可以不填），會顯示在中文名稱下方。',
          },
        },
      ],
    },
  ],
}
