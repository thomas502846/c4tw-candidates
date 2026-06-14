import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: '內文段落',
    plural: '內文段落',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: '眉標（圓點後小字，可選）',
    },
    {
      name: 'title',
      type: 'text',
      label: '標題',
    },
    {
      name: 'align',
      type: 'select',
      label: '標題／眉標對齊（無配圖時生效）',
      defaultValue: 'left',
      options: [
        { label: '靠左', value: 'left' },
        { label: '置中', value: 'center' },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA 按鈕文字（可選）',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA 連結（可選）',
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.ctaLabel),
      },
    },
    {
      name: 'richText',
      type: 'richText',
      label: '內文',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '配圖（單張，可選）',
      admin: {
        description: '若要多張錯位拼貼（如首頁品牌簡介 3 張情境照），請改用下方「配圖（多張錯位拼貼）」。兩者擇一即可，多張優先。',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: '配圖（多張錯位拼貼，可選）',
      labels: {
        singular: '配圖',
        plural: '配圖',
      },
      admin: {
        description:
          '依 Figma 首頁品牌簡介排列：第 1 張上方主圖、第 2 張右下小圖、第 3 張左下寬圖。可加／刪／拖曳排序，建議 3 張。',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '圖片',
          required: true,
        },
      ],
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: '配圖位置',
      defaultValue: 'none',
      options: [
        { label: '靠左', value: 'left' },
        { label: '靠右', value: 'right' },
        { label: '下方橫排（置中）', value: 'belowCenter' },
        { label: '不顯示', value: 'none' },
      ],
      admin: {
        condition: (_data, siblingData) =>
          Boolean(siblingData?.image) || (siblingData?.images?.length ?? 0) > 0,
      },
    },
  ],
}
