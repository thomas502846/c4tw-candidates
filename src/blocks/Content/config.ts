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
      label: '配圖（可選）',
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: '配圖位置',
      defaultValue: 'none',
      options: [
        { label: '靠左', value: 'left' },
        { label: '靠右', value: 'right' },
        { label: '不顯示', value: 'none' },
      ],
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.image),
      },
    },
  ],
}
