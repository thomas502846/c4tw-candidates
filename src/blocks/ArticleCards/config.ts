import type { Block } from 'payload'

export const ArticleCards: Block = {
  slug: 'articleCards',
  interfaceName: 'ArticleCardsBlock',
  labels: {
    singular: '文章卡組（案例故事／媒體報導）',
    plural: '文章卡組（案例故事／媒體報導）',
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      label: '卡片來源',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: '案例故事（case-stories）', value: 'case-stories' },
        { label: '媒體報導（media-coverage）', value: 'media-coverage' },
        { label: '手動卡片', value: 'manual' },
      ],
      admin: {
        description: '選資料來源：「案例故事」「媒體報導」會自動抓對應資料庫的內容；選「手動卡片」則在這個區塊自己一張一張填。',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: '眉標（媒體報導兩欄右側英文小標，可選）',
      maxLength: 200,
      admin: {
        description: '填標題上方的英文小字，例如 Media。只在媒體報導版型顯示，可以留空。',
        condition: (_data, siblingData) => siblingData?.source === 'media-coverage',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: '標題（媒體報導兩欄右側 H1，可選）',
      maxLength: 200,
      admin: {
        description: '填媒體報導區塊右側的大標題，例如「媒體報導」。只在媒體報導版型顯示。',
        condition: (_data, siblingData) => siblingData?.source === 'media-coverage',
      },
    },
    {
      name: 'leadImage',
      type: 'upload',
      relationTo: 'media',
      label: '左側代表圖（媒體報導兩欄；590×400）',
      admin: {
        description: '放媒體報導區塊左側的代表圖。建議上傳寬度 1920px 以上的橫式照片，顯示時會裁成接近 3:2 的比例。',
        condition: (_data, siblingData) => siblingData?.source === 'media-coverage',
      },
    },
    {
      name: 'batchSize',
      type: 'number',
      label: '每批顯示數',
      defaultValue: 3,
      min: 1,
      admin: {
        description: '設定一開始顯示幾張卡片，例如填 3 就先顯示 3 張，其餘按「載入更多」才出現。',
      },
    },
    {
      name: 'enableLoadMore',
      type: 'checkbox',
      label: '顯示「載入更多」',
      defaultValue: true,
      admin: {
        description: '勾選後，卡片數量超過上面設定時會出現「載入更多」按鈕。取消勾選則只顯示前面那批。',
      },
    },
    {
      name: 'cards',
      type: 'array',
      label: '手動卡片',
      labels: {
        singular: '卡片',
        plural: '卡片',
      },
      admin: {
        description: '一張卡片是一則內容，例如一篇報導或一個故事。只有資料來源選「手動卡片」時才需要填。',
        condition: (_data, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '卡片圖（可選）',
          admin: {
            description: '放這張卡片的圖片。建議上傳寬度 768px 以上、接近 4:3 的橫式圖，顯示時會自動裁切置中。',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: '標題',
          required: true,
          maxLength: 200,
          admin: {
            description: '填卡片標題，也就是這則內容的名稱，例如報導或故事的篇名。',
          },
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: '摘要',
          maxLength: 1000,
          admin: {
            description: '填標題下方的一兩句簡介，讓讀者快速知道內容在講什麼。可以留空。',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址',
          admin: {
            description: '填點擊卡片後要前往的網址，例如原始報導連結。記得連 https:// 一起填。沒有連結可以留空。',
          },
        },
      ],
    },
  ],
}
