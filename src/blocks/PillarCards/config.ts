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
      maxLength: 200,
      admin: { description: '填標題上方的英文小標，可以不填。建議 30 個字以內。' },
    },
    {
      name: 'title',
      type: 'text',
      label: '標題（如：人才培育系統）',
      maxLength: 200,
      admin: { description: '填這個區塊的主標題，例如「人才培育系統」。建議 20 個字以內。' },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: '粗體副標（如：以 AIO 為核心的：四大學習地圖）',
      maxLength: 200,
      admin: { description: '填標題底下的副標一句話，建議 30 個字以內。' },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: '右欄導言段落',
      admin: { description: '填右邊欄位的導言段落，按 Enter 換行就會分段。' },
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
      admin: {
        description:
          '逐一新增直立色卡，建議放 4 張。卡片底色會依新增順序自動套用，並一高一低交錯排列，不需要自己設定。',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: '頂部小 pill 標籤（如：學習的內容）',
          maxLength: 60,
          admin: { description: '填卡片頂端的小標籤，例如「學習的內容」。請很簡短，建議 10 個字以內。' },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'icon（白圓內線稿，可選）',
          admin: {
            description:
              '上傳卡片白色圓圈內的小圖示，建議上傳 SVG 或去背 PNG，可以不填。不上傳時會自動帶入系統內建的線稿圖示。',
          },
        },
        {
          name: 'titleMain',
          type: 'text',
          label: '主標大字（如：課程）',
          required: true,
          maxLength: 200,
          admin: { description: '填卡片的主標大字，例如「課程」。請很簡短，建議 6 個字以內。' },
        },
        {
          name: 'titleSub',
          type: 'text',
          label: '主標小字（如：地圖）',
          maxLength: 30,
          admin: { description: '填主標旁邊接著的小字，例如「地圖」，可以不填。建議 6 個字以內。' },
        },
        {
          name: 'text',
          type: 'textarea',
          label: '說明（白字兩行）',
          maxLength: 1000,
          admin: { description: '填卡片底部的說明文字，約兩行，建議 40 個字以內。' },
        },
      ],
    },
  ],
}
