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
          admin: {
            description:
              '放這張輪播的滿版背景大圖。建議上傳寬度 1920px 以上的橫式照片，畫面主體盡量置中，因為文字會壓在照片中央。',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: '主標題',
          maxLength: 200,
          admin: {
            description: '填這張圖最主要的一句話，顯示在照片中央最大的字。建議 16 個字以內，太長手機會換很多行。',
          },
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: '副標題',
          maxLength: 200,
          admin: {
            description: '填主標題下面的補充說明，會接在主標題下一行。建議 30 個字以內。',
          },
        },
        {
          name: 'cta',
          type: 'group',
          label: '行動按鈕（CTA）',
          admin: {
            description: '想在照片上放一顆可以點的按鈕就填這裡；按鈕文字和連結都填了才會出現。',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: '按鈕文字',
              maxLength: 60,
              admin: {
                description: '填按鈕上顯示的字，例如「了解更多」。建議 6 個字以內。',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: '連結網址',
              admin: {
                description: '填點按鈕後要前往的網址。站內可以填以斜線開頭的路徑，例如 /about；站外請填完整網址。',
              },
            },
          ],
        },
      ],
    },
  ],
}
