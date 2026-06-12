import type { Block } from 'payload'

export const StepsBlock: Block = {
  slug: 'stepsBlock',
  interfaceName: 'StepsBlockBlock',
  labels: {
    singular: '步驟區（整寬卡／橫列／外框卡）',
    plural: '步驟區（整寬卡／橫列／外框卡）',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: '版型',
      required: true,
      defaultValue: 'cardRow',
      options: [
        { label: '整寬米色卡＋圓箭頭（EAP 三步驟）', value: 'cardRow' },
        { label: '橫列 icon＋label＋箭頭（發展路徑）', value: 'inline' },
        { label: '外框卡＋向下箭頭（影響力三卡）', value: 'outline' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: '前導標題（可選）',
    },
    {
      name: 'items',
      type: 'array',
      label: '步驟',
      labels: {
        singular: '步驟',
        plural: '步驟',
      },
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'icon（外框卡版型不用）',
        },
        {
          name: 'title',
          type: 'text',
          label: '標題（外框卡版型可留空）',
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
