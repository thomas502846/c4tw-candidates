import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const TwoColumn: Block = {
  slug: 'twoColumn',
  interfaceName: 'TwoColumnBlock',
  labels: {
    singular: '圖文二欄',
    plural: '圖文二欄',
  },
  fields: [
    {
      name: 'direction',
      type: 'select',
      label: '排列方向',
      required: true,
      defaultValue: 'imageLeft',
      options: [
        { label: '左圖右文', value: 'imageLeft' },
        { label: '左文右圖', value: 'imageRight' },
      ],
    },
    {
      name: 'variant',
      type: 'select',
      label: '版型',
      defaultValue: 'standard',
      options: [
        { label: '標準圖文二欄', value: 'standard' },
        { label: '大圖引言（hero：大圖+疊文字卡）', value: 'hero' },
        { label: '引言卡二欄（quotes：左文＋右標題與綠引言卡，care 個人AIO）', value: 'quotes' },
        { label: '置中標題＋項目卡（centered：不顯示大圖，training 六大模組）', value: 'centered' },
      ],
    },
    {
      name: 'lead',
      type: 'text',
      label:
        '前導粗體標題（可選；standard＝跨欄置頂兩行 Bold、quotes＝右欄標題、centered＝置中副句；「\\n」換行）',
      maxLength: 1000,
      admin: {
        description:
          '填一句最上面的粗體前導標題，可以不填。想要分行的地方輸入 \\n。建議在 30 個字以內，超過會擠到版面。',
      },
    },
    {
      name: 'background',
      type: 'select',
      label: '區塊底色',
      defaultValue: 'none',
      options: [
        { label: '無（白底）', value: 'none' },
        { label: '暖米滿版帶', value: 'surface' },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: '眉標（英文小標，可選）',
      maxLength: 200,
      admin: {
        description:
          '填標題上方的一行英文小標，例如 Service，可以不填。建議在 12 個字母以內，只放一行短字。',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '圖片',
      required: true,
      admin: {
        description:
          '上傳這個區塊的主圖。建議上傳寬度 768px 以上、接近 4:3 的橫式照片；如果是大圖引言版型，建議上傳寬度 1920px 以上的橫式大圖。',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: '斜疊雙圖（可選；給 2 張時標準二欄圖側改用對角錯位疊圖，care 257:386）',
      maxRows: 2,
      labels: { singular: '圖片', plural: '圖片' },
      admin: {
        description:
          '想要做斜疊雙圖時，放滿兩張照片即可。只放一張或不放，就會使用上面的單張主圖。建議兩張都上傳寬度 768px 以上的橫式照片。',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '圖片',
          required: true,
          admin: {
            description: '上傳一張橫式照片，建議寬度 768px 以上。',
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: '標題',
      maxLength: 200,
      admin: {
        description: '填這個區塊的主標題。建議在 20 個字以內，太長會換很多行。',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      label: '內文',
      admin: {
        description: '填這個區塊的內文段落，可以分段、加上小標或粗體。',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA（可選）',
      admin: {
        description: '想在內文下方放一顆按鈕時，填按鈕文字和連結；兩個都填才會顯示。',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: '按鈕文字',
          maxLength: 60,
          admin: {
            description: '填按鈕上的文字，例如 了解更多。建議在 6 個字以內。',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址',
          admin: {
            description:
              '填按鈕點下去要前往的網址。站內頁面用斜線開頭，例如 /about；站外網址請填完整的 https 連結。',
          },
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: '重點項目卡（可選，顯示在圖文下方）',
      labels: {
        singular: '項目',
        plural: '項目',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '圖片／icon（可選）',
          admin: {
            description:
              '上傳這張卡的圖示或照片，可以不填，不填會用預設的圓形色塊。圖示建議用 SVG 或去背 PNG；照片建議正方形、寬度 600px 以上。',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: '項目標題',
          required: true,
          maxLength: 200,
          admin: {
            description: '填這張卡的標題。建議在 10 個字以內。',
          },
        },
        {
          name: 'text',
          type: 'textarea',
          label: '項目說明',
          maxLength: 1000,
          admin: {
            description: '填這張卡的一兩句說明，可以不填。建議在 40 個字以內。',
          },
        },
      ],
    },
    {
      name: 'itemsStyle',
      type: 'select',
      label: '項目卡版型',
      defaultValue: 'iconCards',
      options: [
        { label: 'icon 小卡列（圓 icon+標題+說明）', value: 'iconCards' },
        { label: '流程步驟（卡片間箭頭）', value: 'steps' },
        { label: '直立綠卡（深淺綠輪替）', value: 'pillars' },
        { label: '圖卡格（圖+綠標題列，2×3）', value: 'grid' },
        { label: '培育路徑（高低交錯直立卡）', value: 'pathway' },
      ],
    },
  ],
}
