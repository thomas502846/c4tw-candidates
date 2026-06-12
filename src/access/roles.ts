import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

/**
 * 三級權限：
 * - admin    管理員：全能，含 users / site-settings 管理
 * - reviewer 審核：可發布（publish）與修改內容
 * - editor   編輯：可建立／編輯 draft，但不可 publish、不可碰 users / site-settings
 */

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

export const isAdminOrReviewer: Access = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'reviewer'

/**
 * Publish 守門：套在有 drafts 的 collections（pages / posts）的 create / update。
 * admin / reviewer 一律放行；editor 僅能存 draft —— 當這次寫入要把
 * _status 設為 published 時擋下（Payload 的 Publish 按鈕即是這種寫入）。
 */
export const canCreateOrUpdateWithPublishGate: Access = ({ req: { user }, data }) => {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'reviewer') return true
  // editor：禁止把文件發布
  if (data?._status === 'published') return false
  return true
}

/** Users collection：admin 全能；其他人只能讀／改自己 */
export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return String(user.id) === String(id)
}

/** 欄位層級：只有 admin 能改（例如 users.role） */
export const isAdminFieldLevel: FieldAccess<User> = ({ req: { user } }) =>
  user?.role === 'admin'
