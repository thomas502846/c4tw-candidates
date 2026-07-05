import type { Block } from 'payload'

/**
 * 團隊介紹／創辦人（認識創照）——Tracy 2026-07-05「新增團隊/創辦人區塊」，
 * Figma About 留言「可左右滑動」：前台為可橫向滑動的成員卡輪播。
 */
export const TeamCarousel: Block = {
  slug: 'teamCarousel',
  interfaceName: 'TeamCarouselBlock',
  labels: {
    singular: '團隊介紹／創辦人',
    plural: '團隊介紹／創辦人',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: '眉標（圓點後小字，可選）',
      maxLength: 200,
      admin: {
        description: '填標題前的一行小字，通常放英文，例如 Our Team。沒有就留空。',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: '標題',
      maxLength: 200,
      admin: {
        description: '填這個區塊的主標題，例如「團隊介紹」或「創辦人的話」。',
      },
    },
    {
      name: 'lead',
      type: 'textarea',
      label: '導言（可選）',
      admin: {
        description: '填標題下方的一段引言或說明文字。沒有就留空。',
      },
    },
    {
      name: 'members',
      type: 'array',
      label: '成員',
      labels: {
        singular: '成員',
        plural: '成員',
      },
      admin: {
        description: '可加／刪／拖曳排序。前台會排成一列、可左右滑動瀏覽。',
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: '照片（可選）',
          admin: {
            description: '上傳成員照片，建議接近方形或直式。沒有就顯示佔位底。',
          },
        },
        {
          name: 'name',
          type: 'text',
          label: '姓名',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          label: '職稱／頭銜（可選）',
        },
        {
          name: 'bio',
          type: 'textarea',
          label: '簡介（可選）',
        },
      ],
    },
  ],
}
