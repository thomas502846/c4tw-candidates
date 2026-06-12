import type { Block } from 'payload'

export const CtaBanner: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CtaBannerBlock',
  labels: {
    singular: 'CTA 橫幅',
    plural: 'CTA 橫幅',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '主標題',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: '副標題（可選）',
    },
    {
      name: 'cta',
      type: 'group',
      label: '行動按鈕（CTA）',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: '按鈕文字',
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址',
        },
      ],
    },
    {
      name: 'background',
      type: 'select',
      label: '背景色',
      required: true,
      defaultValue: 'primary',
      // 色票 token：視覺定稿後對應 Tailwind theme tokens
      options: [
        { label: '主色', value: 'primary' },
        { label: '輔色', value: 'secondary' },
        { label: '淺色底', value: 'muted' },
        { label: '深色底', value: 'dark' },
      ],
    },
  ],
}
