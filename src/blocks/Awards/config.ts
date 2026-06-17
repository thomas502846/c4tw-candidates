import type { Block } from 'payload'

import { futureCollectionSlug } from '../futureSlug'

export const Awards: Block = {
  slug: 'awards',
  interfaceName: 'AwardsBlock',
  labels: {
    singular: '獎項展示',
    plural: '獎項展示',
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      label: '資料來源',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: '手動輸入', value: 'manual' },
        { label: '引用獎項資料（awards）', value: 'collection' },
      ],
      admin: {
        description: '選「手動輸入」就在這個區塊直接打獎項；選「引用獎項資料」則改從獎項資料庫挑選，適合多個頁面共用同一份清單。',
      },
    },
    {
      name: 'awards',
      type: 'relationship',
      // NOTE(接線): awards collection 建立後可移除 futureCollectionSlug cast
      relationTo: futureCollectionSlug('awards'),
      hasMany: true,
      label: '引用獎項',
      admin: {
        description: '從獎項資料庫挑選要顯示的獎項，可以選多筆。畫面會自動依年份由新到舊排序。',
        condition: (_data, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: '獎項項目',
      labels: {
        singular: '獎項',
        plural: '獎項',
      },
      admin: {
        description: '一筆一個獎項，會以條列清單顯示在左欄。可以新增多筆，建議由新到舊排列。',
        condition: (_data, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'year',
              type: 'text',
              label: '年',
              required: true,
              maxLength: 30,
              admin: { width: '50%', description: '填西元年份，例如 2025。' },
            },
            {
              name: 'month',
              type: 'text',
              label: '月（可選）',
              maxLength: 30,
              admin: { width: '50%', description: '填月份數字，例如 6。不確定月份可以留空。' },
            },
          ],
        },
        {
          name: 'name',
          type: 'text',
          label: '獎項名稱',
          required: true,
          maxLength: 200,
          admin: {
            description: '填完整的獎項名稱，例如「第 12 屆台灣社會企業獎」。',
          },
        },
        {
          name: 'recipient',
          type: 'text',
          label: '獲獎別稱',
          maxLength: 200,
          admin: {
            description: '填補充說明或得獎單位，例如「金獎」「年度團隊」。會顯示在獎項名稱後面，可以留空。',
          },
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: '頒獎照（可選）',
          admin: {
            description: '放這組獎項要搭配的照片，會顯示在右側大圖位置。建議上傳寬度 1920px 以上的橫式照片。多筆獎項只會取其中一張當代表圖。',
          },
        },
      ],
    },
  ],
}
