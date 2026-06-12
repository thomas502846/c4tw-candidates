import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isAdmin, isAdminOrSelf, isAdminFieldLevel } from '../../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: '姓名',
      type: 'text',
    },
    {
      name: 'role',
      label: '角色',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: {
        // 只有 admin 能調整角色，避免 editor 自我升權
        // （create 不設限：能建 user 的本來就只有 admin，且不影響首位使用者建立流程）
        update: isAdminFieldLevel,
      },
      options: [
        {
          label: '管理員',
          value: 'admin',
        },
        {
          label: '審核',
          value: 'reviewer',
        },
        {
          label: '編輯',
          value: 'editor',
        },
      ],
    },
  ],
  timestamps: true,
}
