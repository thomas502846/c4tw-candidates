import type { Block } from 'payload'

export const TabsBlock: Block = {
  slug: 'tabsBlock',
  interfaceName: 'TabsBlockBlock',
  labels: {
    singular: 'Tab 切換內容（課程地圖）',
    plural: 'Tab 切換內容（課程地圖）',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '置中標題（如：從學習到實踐，打造完整的照顧人才路徑）',
      maxLength: 200,
      admin: { description: '填整個區塊最上方的置中大標題，可以不填。建議 40 個字以內。' },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: '置中導言（換行＝分行）',
      maxLength: 1000,
      admin: {
        description: '填標題底下的置中導言，按 Enter 換行就會分行。建議 80 個字以內。',
      },
    },
    {
      name: 'tabs',
      type: 'array',
      label: 'Tab',
      labels: {
        singular: 'Tab',
        plural: 'Tab',
      },
      minRows: 1,
      admin: {
        description:
          '逐一新增每一個分頁。訪客點上方的分頁按鈕，下方面板就會切換成對應內容。版型最適合 4 個分頁。',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Tab 名稱（如：課程地圖）',
          required: true,
          maxLength: 60,
          admin: { description: '填分頁按鈕上的文字，例如「課程地圖」。請很簡短，建議 10 個字以內。' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '面板大圖（地圖圖表）',
          admin: {
            description:
              '上傳這個分頁面板最上方的大圖，例如地圖或圖表。建議上傳寬度 1075px 以上、接近 16:9 的橫式圖。顯示時會置中裁切，重要主體請置中、邊緣留空。',
          },
        },
        {
          name: 'pills',
          type: 'array',
          label: '小 pill 標籤列（如：AIO 課程／八大模組…）',
          labels: { singular: '標籤', plural: '標籤' },
          admin: { description: '大圖底下一整排的小圓角標籤，逐一新增，每個標籤填一個關鍵詞。' },
          fields: [
            {
              name: 'text',
              type: 'text',
              label: '標籤文字',
              required: true,
              maxLength: 1000,
              admin: { description: '填一個標籤的文字，請簡短，建議 12 個字以內。' },
            },
          ],
        },
        {
          name: 'heading',
          type: 'text',
          label: '面板標題（如：課程地圖）',
          maxLength: 200,
          admin: { description: '填面板內的大標題，例如「課程地圖」。請簡短，建議 16 個字以內。' },
        },
        {
          name: 'subheading',
          type: 'text',
          label: '橄欖綠小標（如：建立照顧知識與專業學習）',
          maxLength: 200,
          admin: { description: '填標題底下的橄欖綠色小標一句話，建議 30 個字以內。' },
        },
        {
          name: 'body',
          type: 'textarea',
          label: '面板內文（換行＝分段）',
          admin: { description: '填面板的主要說明文字，按 Enter 換行就會分段。' },
        },
        {
          name: 'featuresLabel',
          type: 'text',
          label: '特色區標題（如：學習特色）',
          maxLength: 200,
          admin: { description: '填特色清單上方的小標題，例如「學習特色」。建議 16 個字以內。' },
        },
        {
          name: 'features',
          type: 'array',
          label: '特色項目（橄欖綠標題＋說明，組間分隔線）',
          labels: { singular: '特色', plural: '特色' },
          admin: { description: '逐一新增這個分頁要列出的特色，每一項一個標題加一段說明。' },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: '標題',
              required: true,
              maxLength: 200,
              admin: { description: '填這一項特色的標題，請簡短，建議 20 個字以內。' },
            },
            {
              name: 'text',
              type: 'textarea',
              label: '說明',
              maxLength: 1000,
              admin: { description: '填這一項特色的說明文字，建議 80 個字以內。' },
            },
          ],
        },
      ],
    },
  ],
}
