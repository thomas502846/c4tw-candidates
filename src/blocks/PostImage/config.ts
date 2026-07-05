import type { Block } from 'payload'

/**
 * 文章內頁單張照片＋照片說明（Tracy 2026-07-05）：
 *  - 橫式預設 16:9、寬滿版
 *  - 直式預設 3:5、寬 315px
 *  - 照片不可點擊放大
 */
export const PostImage: Block = {
  slug: 'postImage',
  interfaceName: 'PostImageBlock',
  labels: {
    singular: '單張照片',
    plural: '單張照片',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '照片',
      required: true,
    },
    {
      name: 'orientation',
      type: 'select',
      label: '方向',
      defaultValue: 'horizontal',
      options: [
        { label: '橫式（16:9，滿版寬）', value: 'horizontal' },
        { label: '直式（3:5，寬 315px）', value: 'vertical' },
      ],
    },
    {
      name: 'caption',
      type: 'text',
      label: '照片說明（可選）',
      maxLength: 200,
    },
  ],
}
