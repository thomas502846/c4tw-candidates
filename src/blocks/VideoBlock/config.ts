import type { Block } from 'payload'

import { responsiveFramePosition } from '@/fields/responsiveFramePosition'

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
      admin: {
        description:
          '貼上 YouTube 影片連結（watch、youtu.be、shorts、embed 都可以），或填一個 mp4 影片檔的網址。影片還沒準備好可以先留空，點播放鈕會顯示即將上線的提示。',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: '封面圖（未播放時顯示；不填則灰底佔位）',
      admin: {
        description:
          '上傳影片未播放時顯示的封面圖。建議上傳寬度 1920px 以上的橫式大圖，比例接近 16:9。不填會顯示灰底佔位。',
      },
    },
    responsiveFramePosition({
      name: 'posterFramePos',
      imageField: 'poster',
      frames: { mobile: '16/9', tablet: '24/11', desktop: '24/11' },
    }),
  ],
}
