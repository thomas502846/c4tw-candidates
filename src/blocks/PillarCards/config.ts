import type { Block } from 'payload'

export const PillarCards: Block = {
  slug: 'pillarCards',
  interfaceName: 'PillarCardsBlock',
  labels: {
    singular: '四柱交錯高低卡（培育系統）',
    plural: '四柱交錯高低卡（培育系統）',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: '眉標（如 Learning Pathway）',
    },
    {
      name: 'title',
      type: 'text',
      label: '標題（如：人才培育系統）',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: '粗體副標（如：以 AIO 為核心的：四大學習地圖）',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: '右欄導言段落',
    },
    {
      name: 'cards',
      type: 'array',
      label: '直立卡（依序底色 #8BA98B／#ADCB59／#9C9F33／#DCD020，奇高偶低交錯）',
      labels: {
        singular: '卡片',
        plural: '卡片',
      },
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: '頂部小 pill 標籤（如：學習的內容）',
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'icon（白圓內線稿，可選）',
        },
        {
          name: 'titleMain',
          type: 'text',
          label: '主標大字（如：課程）',
          required: true,
        },
        {
          name: 'titleSub',
          type: 'text',
          label: '主標小字（如：地圖）',
        },
        {
          name: 'text',
          type: 'textarea',
          label: '說明（白字兩行）',
        },
      ],
    },
  ],
}
