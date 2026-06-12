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
    },
    {
      name: 'intro',
      type: 'textarea',
      label: '置中導言（換行＝分行）',
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
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Tab 名稱（如：課程地圖）',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '面板大圖（地圖圖表）',
        },
        {
          name: 'pills',
          type: 'array',
          label: '小 pill 標籤列（如：AIO 課程／八大模組…）',
          labels: { singular: '標籤', plural: '標籤' },
          fields: [{ name: 'text', type: 'text', label: '標籤文字', required: true }],
        },
        {
          name: 'heading',
          type: 'text',
          label: '面板標題（如：課程地圖）',
        },
        {
          name: 'subheading',
          type: 'text',
          label: '橄欖綠小標（如：建立照顧知識與專業學習）',
        },
        {
          name: 'body',
          type: 'textarea',
          label: '面板內文（換行＝分段）',
        },
        {
          name: 'featuresLabel',
          type: 'text',
          label: '特色區標題（如：學習特色）',
        },
        {
          name: 'features',
          type: 'array',
          label: '特色項目（橄欖綠標題＋說明，組間分隔線）',
          labels: { singular: '特色', plural: '特色' },
          fields: [
            { name: 'title', type: 'text', label: '標題', required: true },
            { name: 'text', type: 'textarea', label: '說明' },
          ],
        },
      ],
    },
  ],
}
