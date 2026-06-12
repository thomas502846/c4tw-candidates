import type { Block } from 'payload'

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
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: '眉標（英文小標；填了標題/內文則圖移到右欄）',
    },
    {
      name: 'title',
      type: 'text',
      label: '左欄標題（可選；不填則資訊圖置中滿寬）',
    },
    {
      name: 'body',
      type: 'textarea',
      label: '左欄內文（換行＝分段；「・」可做 bullet）',
    },
    // ---- venn ----
    {
      name: 'leftLabel',
      type: 'text',
      label: '左圓標題（如：個人生活）',
      admin: { condition: (_, siblingData) => siblingData?.variant === 'venn' },
    },
    {
      name: 'rightLabel',
      type: 'text',
      label: '右圓標題（如：職場角色）',
      admin: { condition: (_, siblingData) => siblingData?.variant === 'venn' },
    },
    {
      name: 'leftStats',
      type: 'array',
      label: '左側衛星數據圓（最多 3）',
      maxRows: 3,
      labels: { singular: '數據', plural: '數據' },
      admin: { condition: (_, siblingData) => siblingData?.variant === 'venn' },
      fields: [
        { name: 'value', type: 'text', label: '大數字（如 8+／6成）', required: true },
        { name: 'label', type: 'text', label: '說明（如 平均照顧年數）', required: true },
      ],
    },
    {
      name: 'rightStats',
      type: 'array',
      label: '右側衛星數據圓（最多 3）',
      maxRows: 3,
      labels: { singular: '數據', plural: '數據' },
      admin: { condition: (_, siblingData) => siblingData?.variant === 'venn' },
      fields: [
        { name: 'value', type: 'text', label: '大數字（如 13.3萬）', required: true },
        { name: 'label', type: 'text', label: '說明', required: true },
      ],
    },
    // ---- ring ----
    {
      name: 'photos',
      type: 'array',
      label: '環上照片圓（4 張，45° 對角排列）',
      maxRows: 4,
      labels: { singular: '照片', plural: '照片' },
      admin: { condition: (_, siblingData) => siblingData?.variant === 'ring' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '照片（裁圓顯示）',
        },
      ],
    },
    // ---- radial ----
    {
      name: 'nodes',
      type: 'array',
      label: '菱形四圓（上／左／右／下）',
      maxRows: 4,
      labels: { singular: '圓', plural: '圓' },
      admin: { condition: (_, siblingData) => siblingData?.variant === 'radial' },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'icon（線稿圖，可選）',
        },
        { name: 'title', type: 'text', label: '標題', required: true },
        { name: 'text', type: 'textarea', label: '說明' },
      ],
    },
  ],
}
