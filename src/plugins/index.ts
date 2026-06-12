import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Care For Taiwan 創照服務設計` : 'Care For Taiwan 創照服務設計'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  // S3 media storage：plugin 永遠註冊、用 enabled 開關（S3_BUCKET 未設 → 停用，fallback 本機磁碟）。
  // ⚠️ 不可用展開運算子把 plugin 從陣列中拿掉——config 形狀會隨 env 改變，
  // importMap（build 時生成）就會缺 storage-s3 的 client 元件，admin 在啟用 S3 的環境整個無聲空白。
  // 認證走 AWS SDK default credential chain，也可用 S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY 明確指定。
  s3Storage({
    enabled: Boolean(process.env.S3_BUCKET),
    collections: {
      media: true,
    },
    bucket: process.env.S3_BUCKET || 'placeholder-disabled',
    config: {
      region: process.env.S3_REGION || 'ap-northeast-2',
      ...(process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
        ? {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
          }
        : {}),
    },
  }),
]
