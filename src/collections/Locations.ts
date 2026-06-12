import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: {
    singular: '共生之家據點',
    plural: '共生之家據點',
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
    defaultColumns: ['name', 'address'],
  },
  fields: [
    {
      name: 'name',
      label: '據點名稱',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'address',
      label: '地址',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      label: '介紹',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'image',
      label: '照片',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: '選填',
      },
    },
  ],
  timestamps: true,
}
