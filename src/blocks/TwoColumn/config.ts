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
      ],
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
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '圖片',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: '標題',
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
      name: 'cta',
      type: 'group',
      label: 'CTA（可選）',
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
        },
        {
          name: 'title',
          type: 'text',
          label: '項目標題',
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
          label: '項目說明',
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
