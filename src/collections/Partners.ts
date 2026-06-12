import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: '合作單位',
    plural: '合作單位',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  versions: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'url'],
  },
  fields: [
    {
      name: 'name',
      label: '名稱',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'url',
      label: '網站連結',
      type: 'text',
      admin: {
        description: '選填，完整網址，例如 https://...',
      },
    },
    {
      name: 'type',
      label: '類型',
      type: 'select',
      required: true,
      defaultValue: 'partner',
      options: [
        {
          label: '合作單位',
          value: 'partner',
        },
        {
          label: '家族事業',
          value: 'family',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
