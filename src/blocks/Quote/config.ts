import type { Block } from 'payload'

import { responsiveFramePosition } from '@/fields/responsiveFramePosition'

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
      maxLength: 1000,
      admin: {
        description: '填想凸顯的一段話或推薦語，會以置中大字顯示。系統會自動加上「」引號，不用自己打。',
      },
    },
    {
      name: 'attribution',
      type: 'text',
      label: '出處／署名',
      maxLength: 200,
      admin: {
        description: '填說這句話的人或單位，例如「林依瑩 執行長」。會顯示在引言下方，可以留空。',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: '照片（可選）',
      admin: {
        description: '放說這句話的人的大頭照，會顯示成引言上方的圓形頭像。建議上傳正方形、600px 以上的照片。',
      },
    },
    responsiveFramePosition({
      imageField: 'photo',
      frames: { mobile: '1/1', tablet: '1/1', desktop: '1/1' },
    }),
  ],
}
