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
      maxLength: 200,
      admin: {
        description: '填標題前的一行小字，會顯示在綠色圓點後面，通常放英文或分類字，例如 ABOUT。沒有就留空。',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: '標題',
      maxLength: 200,
      admin: {
        description: '填這個段落的主標題，會以灰綠色大字顯示。建議 16 個字以內。',
      },
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
      admin: {
        description: '選標題和眉標要靠左還是置中。只有在這個段落沒有放側邊配圖時才會生效。',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA 按鈕文字（可選）',
      maxLength: 60,
      admin: {
        description: '想在內文下方放一顆按鈕就填按鈕文字，例如「認識創照」。建議 6 個字以內。按鈕文字和連結都填了才會出現。',
      },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA 連結（可選）',
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.ctaLabel),
        description: '填點按鈕後要前往的網址。站內可以填以斜線開頭的路徑，例如 /about；站外請填完整網址。',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      label: '內文',
      admin: {
        description: '填這個段落的主要內容文字。可以分段、設定粗體、加上 H2／H3／H4 小標和連結。',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '配圖（單張，可選）',
      admin: {
        description: '放這個段落旁邊的一張配圖。建議上傳寬度 768px 以上、接近直式或方形的照片。若要多張錯位拼貼（如首頁品牌簡介 3 張情境照），請改用下方「配圖（多張錯位拼貼）」。兩者擇一即可，多張優先。',
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
          '依 Figma 首頁品牌簡介排列：第 1 張上方主圖、第 2 張右下小圖、第 3 張左下寬圖。可加／刪／拖曳排序，建議 3 張。每張建議上傳寬度 768px 以上的橫式照片。',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '圖片',
          required: true,
          admin: {
            description: '放一張情境照。建議上傳寬度 768px 以上、接近 4:3 的橫式照片。',
          },
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
        description: '選配圖要放在文字的哪一邊，或放在文字下方一整排。選「不顯示」就不會出現配圖。',
      },
    },
  ],
}
