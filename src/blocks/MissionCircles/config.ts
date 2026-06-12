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
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'plain',
      },
    },
    {
      name: 'slogan',
      type: 'textarea',
      label: '白字標語（宣言帶用，換行＝分行）',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'band',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: '背景照片（宣言帶用）',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'band',
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
        },
        {
          name: 'description',
          type: 'textarea',
          label: '圓下說明（白底版型用）',
        },
      ],
    },
  ],
}
