import type { Block } from 'payload'

import { futureCollectionSlug } from '../futureSlug'

export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: {
    singular: '時間軸大事紀',
    plural: '時間軸大事紀',
  },
  fields: [
    {
      name: 'mode',
      type: 'select',
      label: '資料來源',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: '手動輸入', value: 'manual' },
        { label: '引用大事紀資料（timeline-events）', value: 'reference' },
      ],
      admin: {
        description: '選大事紀要怎麼來。選「手動輸入」就在下方一筆筆自己打；選「引用大事紀資料」就從共用的大事紀資料庫挑要顯示的項目。',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: '大事紀項目',
      labels: {
        singular: '項目',
        plural: '項目',
      },
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'manual',
        description: '每一筆是時間軸上的一個事件，會由上到下依序排列。可以新增、刪除、拖曳調整順序。',
      },
      fields: [
        {
          name: 'date',
          type: 'text',
          label: '年份／日期',
          required: true,
          maxLength: 200,
          admin: {
            description: '填這個事件的年份或日期，例如 2020 或 2020/03。',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: '標題',
          required: true,
          maxLength: 200,
          admin: {
            description: '填這個事件的標題，會顯示在綠色的圓角標籤裡。建議 14 個字以內。',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: '一句話描述',
          maxLength: 1000,
          admin: {
            description: '填這個事件的補充說明，只有在下方打開「顯示每筆說明文字」時才會出現。建議 25 個字以內。',
          },
        },
      ],
    },
    {
      name: 'events',
      type: 'relationship',
      // NOTE(接線): timeline-events collection 建立後可移除 futureCollectionSlug cast
      relationTo: futureCollectionSlug('timeline-events'),
      hasMany: true,
      label: '引用大事紀',
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'reference',
        description: '從共用的大事紀資料庫挑出要顯示的項目，可以挑多筆。系統會自動依年份排序。',
      },
    },
    {
      name: 'showDescription',
      type: 'checkbox',
      label: '顯示每筆說明文字（關閉＝乾淨單行 pill，符合 Figma about）',
      defaultValue: false,
      admin: {
        description: '打開後，每個事件的標籤下面會多顯示一句話描述。關閉時只顯示乾淨的單行標籤。',
      },
    },
  ],
}
