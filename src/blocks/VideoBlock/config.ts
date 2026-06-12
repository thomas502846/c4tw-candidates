import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'videoBlock',
  interfaceName: 'VideoBlockBlock',
  labels: {
    singular: '影片區（滿版＋播放鈕）',
    plural: '影片區（滿版＋播放鈕）',
  },
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      label: '影片網址（YouTube 連結或 mp4 檔；待客戶提供可留空）',
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: '封面圖（未播放時顯示；不填則灰底佔位）',
    },
  ],
}
