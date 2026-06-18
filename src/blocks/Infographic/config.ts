import type { Block } from 'payload'

import { responsiveFramePosition } from '@/fields/responsiveFramePosition'

export const Infographic: Block = {
  slug: 'infographic',
  interfaceName: 'InfographicBlock',
  labels: {
    singular: 'SVG 資訊圖（Venn／環形／放射）',
    plural: 'SVG 資訊圖（Venn／環形／放射）',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: '圖型',
      required: true,
      defaultValue: 'venn',
      options: [
        { label: 'Venn 兩圓＋衛星數據圓（care AIO 痛點）', value: 'venn' },
        { label: '環形 donut＋照片圓（school 我們看見的問題）', value: 'ring' },
        { label: '四圓菱形排列（training 放射圖）', value: 'radial' },
      ],
      admin: {
        description:
          '選擇資訊圖的樣式。兩圓圖適合用兩個面向＋數字呈現現況痛點；環形圖適合在環上放四張照片帶出問題；菱形四圓適合並列四個面向。選好圖型後，下方會出現對應要填的欄位。',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: '眉標（英文小標；填了標題/內文則圖移到右欄）',
      maxLength: 200,
      admin: {
        description:
          '填標題上方的英文小標，例如一個英文短語，可以不填。填了標題或內文後，圖會移到右邊、文字在左邊。建議 30 個字以內。',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: '左欄標題（可選；不填則資訊圖置中滿寬）',
      maxLength: 200,
      admin: {
        description:
          '填左邊欄位的大標題，可以不填。標題和內文都不填時，資訊圖會置中放大滿版。建議 30 個字以內。',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: '左欄內文（換行＝分段；「・」可做 bullet）',
      admin: {
        description:
          '填左邊欄位的說明文字。按 Enter 換行就會分段；在開頭加「・」可以做成項目符號。',
      },
    },
    // ---- venn ----
    {
      name: 'leftLabel',
      type: 'text',
      label: '左圓標題（如：個人生活）',
      maxLength: 80,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'venn',
        description: '填左邊大圓中央的標題，例如「個人生活」。請簡短，建議 8 個字以內。',
      },
    },
    {
      name: 'rightLabel',
      type: 'text',
      label: '右圓標題（如：職場角色）',
      maxLength: 80,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'venn',
        description: '填右邊大圓中央的標題，例如「職場角色」。請簡短，建議 8 個字以內。',
      },
    },
    {
      name: 'leftStats',
      type: 'array',
      label: '左側衛星數據圓（最多 3）',
      maxRows: 3,
      labels: { singular: '數據', plural: '數據' },
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'venn',
        description: '左邊大圓周圍的小數據圓，最多放 3 顆，每顆放一組數字加說明。',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          label: '大數字（如 8+／6成）',
          required: true,
          maxLength: 30,
          admin: { description: '填要強調的數字，例如「8+」或「6成」。請簡短，建議 8 個字以內。' },
        },
        {
          name: 'label',
          type: 'text',
          label: '說明（如 平均照顧年數）',
          required: true,
          maxLength: 60,
          admin: { description: '填數字底下的說明，例如「平均照顧年數」。請簡短，建議 12 個字以內。' },
        },
      ],
    },
    {
      name: 'rightStats',
      type: 'array',
      label: '右側衛星數據圓（最多 3）',
      maxRows: 3,
      labels: { singular: '數據', plural: '數據' },
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'venn',
        description: '右邊大圓周圍的小數據圓，最多放 3 顆，每顆放一組數字加說明。',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          label: '大數字（如 13.3萬）',
          required: true,
          maxLength: 30,
          admin: { description: '填要強調的數字，例如「13.3萬」。請簡短，建議 8 個字以內。' },
        },
        {
          name: 'label',
          type: 'text',
          label: '說明',
          required: true,
          maxLength: 60,
          admin: { description: '填數字底下的說明文字。請簡短，建議 12 個字以內。' },
        },
      ],
    },
    // ---- ring ----
    {
      name: 'photos',
      type: 'array',
      label: '環上照片圓（4 張，45° 對角排列）',
      maxRows: 4,
      labels: { singular: '照片', plural: '照片' },
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'ring',
        description: '放在環形圖四角的照片，請放 4 張，順序為右上、右下、左下、左上。',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '照片（裁圓顯示）',
          admin: {
            description:
              '上傳一張照片，顯示時會裁成圓形。建議上傳正方形、寬度 600px 以上的照片，主體放中間比較不會被裁掉。',
          },
        },
        responsiveFramePosition({
          name: 'framePos',
          imageField: 'image',
          frames: { mobile: '590/400', tablet: '590/400', desktop: '590/400' },
        }),
      ],
    },
    // ---- radial ----
    {
      name: 'nodes',
      type: 'array',
      label: '菱形四圓（上／左／右／下）',
      maxRows: 4,
      labels: { singular: '圓', plural: '圓' },
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'radial',
        description: '菱形排列的四個圓，請放 4 個，順序為上、左、右、下，每個圓放一個面向。',
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'icon（線稿圖，可選）',
          admin: {
            description:
              '上傳圓內的小圖示，建議上傳 SVG 或去背 PNG，可以不填。不上傳時會自動帶入系統內建的線稿圖示。',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: '標題',
          required: true,
          maxLength: 200,
          admin: { description: '填這個圓的標題，請簡短，建議 16 個字以內。' },
        },
        {
          name: 'text',
          type: 'textarea',
          label: '說明',
          maxLength: 1000,
          admin: { description: '填標題底下的補充說明，一兩句話即可，建議 40 個字以內。' },
        },
      ],
    },
  ],
}
