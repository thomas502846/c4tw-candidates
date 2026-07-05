import type { JSONField } from 'payload'

/** 各裝置預覽框的長寬比（W/H），讓 CMS 拖曳預覽呈現該裝置實際的裁切框。 */
export type FrameAspects = {
  mobile: string
  tablet: string
  desktop: string
}

type Options = {
  /** 欄位名稱，預設 framePos */
  name?: string
  /** 同一區塊內對應的圖片上傳欄位名稱，預設 image */
  imageField?: string
  /** 各裝置框長寬比，用於 CMS 拖曳預覽 */
  frames: FrameAspects
  /** 框比例隨同區塊某欄位（例如 variant）變化時，依該欄位值挑選預覽框 */
  variantField?: string
  framesByVariant?: Record<string, FrameAspects>
  label?: string
  description?: string
  /** 只在特定條件顯示（例如僅 hero 版型） */
  condition?: (data: unknown, siblingData: unknown) => boolean
}

/**
 * responsiveFramePosition — 可重用欄位工廠。
 *
 * 產生一個 json 欄位，掛上自訂拖曳＋縮放編輯器（src/fields/ResponsiveFramePosition/Field.tsx）。
 * 資料形狀見 src/utilities/framePositionCss.ts 的 FramePosition。
 * frames / imageField 透過 clientProps 傳給編輯器：用來抓同區塊的圖片網址、以正確框比例預覽。
 */
export const responsiveFramePosition = (opts: Options): JSONField => ({
  name: opts.name ?? 'framePos',
  type: 'json',
  label: opts.label ?? '照片裁切位置（手機／平板／電腦）',
  admin: {
    description:
      opts.description ??
      '分別針對手機、平板、電腦拖曳照片焦點、調整縮放，預覽框即是該裝置實際看到的範圍。未設定時沿用預設置中。英文版的照片與此裁切設定留空時，會自動沿用中文版；想讓英文版不同再各自調整即可。',
    ...(opts.condition ? { condition: opts.condition } : {}),
    components: {
      Field: {
        path: '@/fields/ResponsiveFramePosition/Field#ResponsiveFramePositionField',
        clientProps: {
          imageField: opts.imageField ?? 'image',
          frames: opts.frames,
          ...(opts.variantField ? { variantField: opts.variantField } : {}),
          ...(opts.framesByVariant ? { framesByVariant: opts.framesByVariant } : {}),
        },
      },
    },
  },
})
