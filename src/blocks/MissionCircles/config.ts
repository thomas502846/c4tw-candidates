import type { Block } from 'payload'

export const MissionCircles: Block = {
  slug: 'missionCircles',
  interfaceName: 'MissionCirclesBlock',
  labels: {
    singular: '使命三圓（宣言帶／行動三圓）',
    plural: '使命三圓（宣言帶／行動三圓）',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: '版型',
      required: true,
      defaultValue: 'band',
      options: [
        { label: '宣言帶（滿版照片底＋白字標語＋三圓）', value: 'band' },
        { label: '白底行動三圓（標題＋實心圓＋說明）', value: 'plain' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: '置中標題（白底版型用，如：\\ 與我們一起行動 /）',
      maxLength: 200,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'plain',
        description:
          '填白底版型最上方的置中標題，例如 \\ 與我們一起行動 /。建議在 14 個字以內。只有白底行動三圓版型會用到。',
      },
    },
    {
      name: 'slogan',
      type: 'textarea',
      label: '白字標語（宣言帶用，換行＝分行）',
      maxLength: 1000,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'band',
        description:
          '填宣言帶上方的標語，可以多行，按 Enter 換行就會分行顯示。建議在 30 個字以內。只有宣言帶版型會用到。',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: '背景照片（宣言帶用）',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'band',
        description:
          '上傳宣言帶的背景照片。建議上傳寬度 1920px 以上的橫式大圖。只有宣言帶版型會用到。圖會滿版置中裁切、上面壓白字，重要主體請置中、邊緣留空，手機上左右會裁得更多。',
      },
    },
    {
      name: 'circles',
      type: 'array',
      label: '圓（色彩依序 #DCD020／#8BA98B／#ADCB59 輪替）',
      labels: {
        singular: '圓',
        plural: '圓',
      },
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: '圓內白字（如：培育照顧的人）',
          required: true,
          maxLength: 60,
          admin: {
            description: '填顯示在圓圈裡的白色短句，例如 培育照顧的人。建議在 8 個字以內。',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: '圓下說明（白底版型用）',
          maxLength: 1000,
          admin: {
            description:
              '填圓圈下方的一兩句說明，可以不填。建議在 30 個字以內。只有白底行動三圓版型會顯示。',
          },
        },
      ],
    },
  ],
}
