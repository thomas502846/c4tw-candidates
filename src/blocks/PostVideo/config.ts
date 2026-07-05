import type { Block } from 'payload'

/**
 * 文章內頁影片（Tracy 2026-07-05：點擊播放後開啟 Lightbox，
 * 點背景或右上角 X 關閉）。支援 YouTube 連結或 mp4 網址。
 */
export const PostVideo: Block = {
  slug: 'postVideo',
  interfaceName: 'PostVideoBlock',
  labels: {
    singular: '影片',
    plural: '影片',
  },
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      label: '影片連結',
      required: true,
      admin: {
        description: '填影片連結（YouTube 或 mp4 網址）。前台顯示封面＋播放鈕，點擊以浮層播放。',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: '封面圖（可選）',
      admin: {
        description: '影片播放前顯示的封面圖。沒填就顯示淺灰底＋播放鈕。',
      },
    },
  ],
}
