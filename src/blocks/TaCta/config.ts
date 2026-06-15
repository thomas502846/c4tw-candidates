import type { Block } from 'payload'

export const TaCta: Block = {
  slug: 'taCta',
  interfaceName: 'TaCtaBlock',
  labels: {
    singular: 'TA 導流磚（綠磚卡／照片連結卡）',
    plural: 'TA 導流磚（綠磚卡／照片連結卡）',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: '版型',
      required: true,
      defaultValue: 'tiles',
      options: [
        { label: '首頁三磚（米色帶＋三綠磚卡＋白底按鈕）', value: 'tiles' },
        { label: '照片連結雙卡（照片＋亮綠色條＋箭頭）', value: 'photoCards' },
        { label: '全幅照片帶＋單一按鈕（頁尾 CTA，取第 1 張卡）', value: 'photoBand' },
        { label: '深底雙按鈕帶（深灰底＋灰綠/亮綠 pill，School 頁尾 CTA）', value: 'darkBand' },
      ],
    },
    {
      name: 'intro',
      type: 'textarea',
      label: '置中導言（多行，照片連結卡版型用）',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'photoCards',
      },
    },
    {
      name: 'cards',
      type: 'array',
      label: '導流卡',
      labels: {
        singular: '卡片',
        plural: '卡片',
      },
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '插圖／照片（三磚＝白色線稿插圖；照片卡＝上方照片）',
        },
        {
          name: 'title',
          type: 'text',
          label: '標語（如：我想成為照顧專業人才／我是企業 HR 或主管）',
          required: true,
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: '按鈕文字（三磚版型用，照片卡可留空）',
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址',
        },
      ],
    },
  ],
}
