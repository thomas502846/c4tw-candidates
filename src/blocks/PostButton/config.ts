import type { Block } from 'payload'

/**
 * 文章內頁按鈕（Tracy 2026-07-05：可新增按鈕，僅能調整文字；
 * hover/press 變色、文字恆白、Background #dcd020、0.3s ease）。
 */
export const PostButton: Block = {
  slug: 'postButton',
  interfaceName: 'PostButtonBlock',
  labels: {
    singular: '按鈕',
    plural: '按鈕',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: '按鈕文字',
      required: true,
      maxLength: 40,
    },
    {
      name: 'url',
      type: 'text',
      label: '連結（可選）',
      admin: {
        description: '填點按鈕後要前往的網址。站內可填以斜線開頭的路徑，例如 /contact；站外請填完整網址。留空則不連結。',
      },
    },
  ],
}
