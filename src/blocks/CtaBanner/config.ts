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
      maxLength: 200,
      admin: {
        description: '填這個橫幅最大的一句話，用來吸引讀者，建議在 15 個字以內。',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: '副標題（可選）',
      maxLength: 200,
      admin: {
        description: '填一句補充說明，放在主標題下方（可以不填），建議在 30 個字以內。',
      },
    },
    {
      name: 'cta',
      type: 'group',
      label: '行動按鈕（CTA）',
      admin: {
        description: '設定橫幅下方的按鈕；按鈕文字和連結網址兩格都要填，按鈕才會出現。',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: '按鈕文字',
          maxLength: 60,
          admin: {
            description: '填按鈕上顯示的文字，建議在 6 個字以內，例如：立即聯絡、了解更多。',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址',
          admin: {
            description: '填按下按鈕後要前往的網址，可以放本站頁面（例如 /contact）或完整外部網址。',
          },
        },
      ],
    },
    {
      name: 'background',
      type: 'select',
      label: '背景色',
      required: true,
      defaultValue: 'primary',
      admin: {
        description: '選這個橫幅的底色，從主色、輔色、淺色底、深色底四種品牌色裡挑一個。',
      },
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
