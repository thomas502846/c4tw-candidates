import type { Block } from 'payload'

/**
 * 文章內頁照片牆 Photo Gallery（Tracy 2026-07-05）：
 *  - 縮圖 3×3 預覽
 *  - 超過 9 張時，第 9 張顯示「+N」數量覆蓋
 *  - 點擊任一照片開啟 Lightbox，支援左右箭頭切換，點背景或 X 關閉
 */
export const PostGallery: Block = {
  slug: 'postGallery',
  interfaceName: 'PostGalleryBlock',
  labels: {
    singular: '照片牆',
    plural: '照片牆',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      label: '照片',
      labels: { singular: '照片', plural: '照片' },
      minRows: 1,
      admin: {
        description: '可加／刪／拖曳排序。前台以 3×3 縮圖呈現，超過 9 張時第 9 張顯示「+N」，點擊開啟大圖瀏覽。',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '照片',
          required: true,
        },
      ],
    },
  ],
}
