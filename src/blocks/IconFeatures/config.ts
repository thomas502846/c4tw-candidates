import type { Block } from 'payload'

export const IconFeatures: Block = {
  slug: 'iconFeatures',
  interfaceName: 'IconFeaturesBlock',
  labels: {
    singular: 'Icon 卡組（橫卡列／直立綠卡）',
    plural: 'Icon 卡組（橫卡列／直立綠卡）',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: '版型',
      required: true,
      defaultValue: 'cards',
      options: [
        { label: '米色橫卡列（icon 左＋標題說明右，4 欄）', value: 'cards' },
        { label: '直立綠卡（深淺綠輪替，5 欄）', value: 'pillars' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: '項目',
      labels: {
        singular: '項目',
        plural: '項目',
      },
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'icon（線稿圖；不填則以圓形佔位）',
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
          label: '說明',
        },
      ],
    },
  ],
}
