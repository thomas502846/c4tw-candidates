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
      maxLength: 1000,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'photoCards',
        description:
          '填照片連結卡上方的一段置中導言，可以多行，按 Enter 換行。建議在 40 個字以內。只有照片連結雙卡版型會用到。',
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
          admin: {
            description:
              '三磚版型上傳白色去背的線稿插圖，建議用 SVG 或去背 PNG，不填會用預設插圖；照片卡與全幅照片帶請上傳橫式照片，照片卡建議寬度 768px 以上、全幅照片帶建議寬度 1920px 以上。',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: '標語（如：我想成為照顧專業人才／我是企業 HR 或主管）',
          required: true,
          maxLength: 200,
          admin: {
            description:
              '填這張卡的標語，例如 我想成為照顧專業人才。建議在 14 個字以內，太長會換行。',
          },
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: '按鈕文字（三磚版型用，照片卡可留空）',
          maxLength: 60,
          admin: {
            description:
              '填按鈕上的文字，例如 立即了解。建議在 8 個字以內。照片連結卡不放按鈕，可以留空。',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: '連結網址',
          admin: {
            description:
              '填這張卡點下去要前往的網址。站內頁面用斜線開頭，例如 /school；頁內錨點用井號開頭，例如 #sheet；站外網址請填完整的 https 連結。',
          },
        },
      ],
    },
  ],
}
