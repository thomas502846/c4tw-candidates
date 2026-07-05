import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

/**
 * 文章瀏覽計數 +1（Tracy 2026-07-05：側欄「熱門內容」依點閱排序）。
 * context.disableRevalidate 避免每次瀏覽都觸發 revalidatePost（見 hooks/revalidatePost）。
 */
export async function POST(req: Request) {
  try {
    const { id } = (await req.json()) as { id?: string | number }
    if (!id) return NextResponse.json({ ok: false }, { status: 400 })

    const payload = await getPayload({ config: configPromise })
    const post = await payload.findByID({
      collection: 'posts',
      id,
      depth: 0,
      overrideAccess: true,
    })
    if (!post) return NextResponse.json({ ok: false }, { status: 404 })

    await payload.update({
      collection: 'posts',
      id,
      data: { views: (post.views ?? 0) + 1 },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
