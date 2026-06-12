import type { CollectionSlug } from 'payload'

/**
 * 暫時 cast helper：
 * timeline-events / awards / case-stories / media-coverage / partners 等 collections
 * 由接線 agent 建立。建立並重新生成 payload-types 之後，
 * 各 block config 可改回字面值 slug 並刪除本檔。
 */
export const futureCollectionSlug = (slug: string): CollectionSlug => slug as CollectionSlug
