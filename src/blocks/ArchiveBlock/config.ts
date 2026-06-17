import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      admin: {
        description:
          '這個區塊會自動把最新消息或文章列出來。這裡填寫列表上方的開頭文字，例如一個標題或一段簡短說明，可以留空。',
      },
      label: 'Intro Content',
    },
    {
      name: 'populateBy',
      type: 'select',
      admin: {
        description:
          '選擇要怎麼挑文章。選「Collection」會依分類自動帶出最新文章，選「Individual Selection」則由你逐一手動指定要顯示哪幾篇。',
      },
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        description: '選擇要從哪一種內容自動列出，目前可以選文章（Posts）。',
      },
      defaultValue: 'posts',
      label: 'Collections To Show',
      options: [
        {
          label: 'Posts',
          value: 'posts',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        description:
          '選擇要顯示哪些分類的文章，可以複選。留空的話會列出所有分類的最新文章。',
      },
      hasMany: true,
      label: 'Categories To Show',
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        description: '填入最多要顯示幾篇文章，例如填 6 就是最多列出 6 篇。',
        step: 1,
      },
      defaultValue: 10,
      label: 'Limit',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
        description: '逐一挑選想要顯示的文章，顯示順序就是你加入的先後順序。',
      },
      hasMany: true,
      label: 'Selection',
      relationTo: ['posts'],
    },
  ],
  labels: {
    plural: 'Archives',
    singular: 'Archive',
  },
}
