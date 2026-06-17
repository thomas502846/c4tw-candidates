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
      admin: {
        description:
          '選擇步驟的呈現方式。整寬米色卡適合放服務流程，步驟間有箭頭相連；橫列版適合放發展路徑；外框卡適合放並列的成果或影響力。建議放 3 個步驟。',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: '前導標題（可選）',
      maxLength: 200,
      admin: { description: '填整個步驟區上方的標題，可以不填。建議 30 個字以內。' },
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
      admin: { description: '逐一新增每一個步驟，建議放 3 個，並依照流程先後順序排列。' },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'icon（外框卡版型不用）',
          admin: {
            description:
              '上傳這個步驟的小圖示，建議上傳 SVG 或去背 PNG。不上傳時會自動帶入系統內建的線稿圖示。外框卡版型不會顯示圖示，可以不填。',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: '標題（外框卡版型可留空）',
          maxLength: 200,
          admin: { description: '填這個步驟的標題，請簡短，建議 16 個字以內。外框卡版型可以留空。' },
        },
        {
          name: 'text',
          type: 'textarea',
          label: '說明',
          maxLength: 1000,
          admin: { description: '填步驟的補充說明，一兩句話即可，建議 50 個字以內。' },
        },
      ],
    },
  ],
}
