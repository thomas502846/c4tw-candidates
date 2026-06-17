import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          '放在內文中間的圖片。建議上傳寬度 1200px 以上的清晰圖片。如果想加圖說，請到媒體庫的這張圖片裡填寫「caption」說明文字。',
      },
    },
  ],
}
