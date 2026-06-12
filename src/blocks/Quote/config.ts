import type { Block } from 'payload'

export const Quote: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: {
    singular: '引言／推薦語',
    plural: '引言／推薦語',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      label: '引言內容',
      required: true,
    },
    {
      name: 'attribution',
      type: 'text',
      label: '出處／署名',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: '照片（可選）',
    },
  ],
}
