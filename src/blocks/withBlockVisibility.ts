import type { Block } from 'payload'

/**
 * Wraps a block config so every block instance gains a "顯示此區塊" toggle.
 *
 * The customer can uncheck it to hide a block from the website without
 * deleting its content — the data stays saved and the block can be shown
 * again at any time. `RenderBlocks` skips any block whose `enabled === false`.
 *
 * Defaults to `true`, so existing/older content keeps showing.
 *
 * Also sets a schematic wireframe thumbnail (public/block-thumbnails/<slug>.svg)
 * so the "add block" picker shows what each block looks like instead of
 * Payload's generic placeholder. Existing `admin` settings are preserved.
 *
 * Returns a shallow clone — the original block config is left untouched, so
 * the same block used elsewhere (e.g. inside rich-text) is unaffected.
 */
export const withBlockVisibility = (block: Block): Block => ({
  ...block,
  admin: {
    ...block.admin,
    images: {
      ...block.admin?.images,
      thumbnail: `/block-thumbnails/${block.slug}.svg`,
    },
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: '在網站上顯示此區塊',
      defaultValue: true,
      admin: {
        description:
          '取消勾選即可在網站上隱藏此區塊，內容仍會保留，隨時可再次勾選顯示。',
      },
    },
    ...block.fields,
  ],
})
