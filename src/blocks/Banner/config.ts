import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'style',
      type: 'select',
      admin: {
        description:
          '選一個提示樣式來決定底色與外框。Info 是一般說明（藍灰），Warning 是提醒注意（黃），Error 是錯誤或重要警告（紅），Success 是成功或好消息（綠）。',
      },
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      admin: {
        description:
          '填入要強調顯示的提示文字，建議一兩句話就好，太長會讓提示框變得擁擠。',
      },
      label: false,
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
}
