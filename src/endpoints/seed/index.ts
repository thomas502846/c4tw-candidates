import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

import { promises as fsp } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const PHOTOS_DIR = path.resolve(dirname, '../../../content-assets/photos')
// Media collection 的 staticDir（src/collections/Media.ts: ../../public/media）
const MEDIA_DIR = path.resolve(dirname, '../../../public/media')

// 清空後重建的 collections（posts / categories / partners / redirects 不動）
const collectionsToClear: CollectionSlug[] = [
  'pages',
  'case-stories',
  'awards',
  'timeline-events',
  'media-coverage',
  'media',
]

// ---------------------------------------------------------------
// Lexical richText helpers
// ---------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RTNode = any

/** 段落 node */
const p = (text: string): RTNode => ({
  type: 'paragraph',
  version: 1,
  children: [{ type: 'text', version: 1, text }],
})

/**
 * 段落 node，支援混合 run（部分文字加粗）。
 * runs：{ text, bold? }；bold 的 run 以 Lexical format bit 1 輸出 → 前台渲成 <strong>
 * （Content block 的 prose-strong 會上果綠 #9C9F33，例：緣起「如果…」強調句）。
 */
const pRich = (...runs: { text: string; bold?: boolean }[]): RTNode => ({
  type: 'paragraph',
  version: 1,
  children: runs.map((r) => ({
    type: 'text',
    version: 1,
    text: r.text,
    format: r.bold ? 1 : 0,
  })),
})

/** 小標（h3）node：Sheet 的「小標：」用這個 */
const h3 = (text: string): RTNode => ({
  type: 'heading',
  tag: 'h3',
  version: 1,
  children: [{ type: 'text', version: 1, text }],
})

/** 任意 nodes 組 richText */
const rtNodes = (...nodes: RTNode[]) => ({
  root: {
    type: 'root',
    children: nodes,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

/** Lexical richText helper：一段文字一個段落 */
const rt = (...paragraphs: string[]) => rtNodes(...paragraphs.map(p))

const seedContext = { disableRevalidate: true }

// Next.js revalidation errors are normal when seeding without a running server
// (i.e. `pnpm seed`)。`Error hitting revalidate route for...` 可忽略。
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding Care For Taiwan content (Sheet 20260612)...')

  // ---------------------------------------------------------------
  // 0. 清空
  // ---------------------------------------------------------------
  payload.logger.info('— Clearing collections...')

  // 順序很重要：先清 versions、media 最後清——
  // 否則刪 media 觸發 FK SET NULL 會打到 _case_stories_v.version_image_id（NOT NULL）爆掉。
  for (const collection of collectionsToClear) {
    if (payload.collections[collection]?.config?.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }
  for (const collection of collectionsToClear.filter((c) => c !== 'media')) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }
  await payload.db.deleteMany({ collection: 'media', req, where: {} })

  // ---------------------------------------------------------------
  // 1. 媒體：8 張照顧現場情境照
  // ---------------------------------------------------------------
  payload.logger.info('— Seeding media (8 情境照)...')

  const photoAlts = [
    '照顧現場情境照：居家照顧服務員與長輩互動',
    '照顧現場情境照：跨專業團隊到宅服務',
    '照顧現場情境照：照顧學校培訓課程',
    '照顧現場情境照：返家照顧的日常陪伴',
    '照顧現場情境照：社區共生據點活動',
    '照顧現場情境照：居家照顧的生活協助',
    '照顧現場情境照：團隊與家屬討論照顧計畫',
    '照顧現場情境照：長輩在熟悉的家中安老',
  ]

  // S3 媒體上傳的根本問題（round-3、今天各踩一次）：
  // db.deleteMany('media') 只清 DB，不刪 S3 物件 → bucket 累積多代孤兒檔（-2/-4/-5/-16…）。
  // Payload 上傳遇同名會逐「尺寸」各自挑下一個沒被佔用的 -N 後綴，跨次 reseed 後綴會錯位，
  // 導致 DB 記錄指到的後綴在 S3 並非「主檔＋三尺寸」都齊全那一份 → 前台圖整批破。
  // 解法：reseed 前把 bucket 清空（命名重新乾淨無後綴），上傳後逐張 head 驗證齊全＋重試。
  // 鏡像 plugin（src/plugins/index.ts）的 region/credential 邏輯；S3_BUCKET 未設＝本機磁碟，跳過。
  const s3Bucket = process.env.S3_BUCKET
  let s3: import('@aws-sdk/client-s3').S3Client | null = null
  if (s3Bucket) {
    const { S3Client } = await import('@aws-sdk/client-s3')
    s3 = new S3Client({
      region: process.env.S3_REGION || 'ap-northeast-2',
      ...(process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
        ? {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
          }
        : {}),
    })
  }

  // reseed 前清空 bucket（分批刪，每批 ≤1000），讓本次上傳取得乾淨無後綴檔名。
  if (s3 && s3Bucket) {
    const { ListObjectsV2Command, DeleteObjectsCommand } = await import('@aws-sdk/client-s3')
    let cleared = 0
    let token: string | undefined
    do {
      const listed = await s3.send(
        new ListObjectsV2Command({ Bucket: s3Bucket, ContinuationToken: token }),
      )
      const objects = (listed.Contents ?? []).map((o) => ({ Key: o.Key! }))
      if (objects.length > 0) {
        await s3.send(
          new DeleteObjectsCommand({ Bucket: s3Bucket, Delete: { Objects: objects } }),
        )
        cleared += objects.length
      }
      token = listed.IsTruncated ? listed.NextContinuationToken : undefined
    } while (token)
    payload.logger.info(`— Cleared ${cleared} stale object(s) from s3://${s3Bucket}`)
  }

  // ⭐ 真正的根本原因：Payload 的同名檔去重是查 staticDir（public/media）本機磁碟，
  // 不是查 S3。歷次 reseed 在 public/media 累積了 16 代殘檔（-1…-16，共數百檔），
  // 於是 `_2.jpg` 被去重成 `_2-16.jpg`，DB 記下這個後綴名、再以此名上傳 S3——
  // 但跨代殘檔讓「DB 記到的後綴」與「S3 真正齊全的那一份」錯位 → 前台圖整批破。
  // 解法：reseed 前一併清空 public/media，讓本次檔名乾淨無後綴、DB↔磁碟↔S3 三方一致。
  try {
    const entries = await fsp.readdir(MEDIA_DIR)
    let removed = 0
    for (const name of entries) {
      if (name === '.gitkeep') continue
      await fsp.rm(path.join(MEDIA_DIR, name), { force: true, recursive: true })
      removed += 1
    }
    payload.logger.info(`— Cleared ${removed} stale file(s) from ${MEDIA_DIR}`)
  } catch (err) {
    // 目錄不存在等情形不致命
    payload.logger.warn(`— Could not clear ${MEDIA_DIR}: ${(err as Error).message}`)
  }

  // 取一個 media doc 的所有 S3 key（主檔＋每個尺寸），用 doc 實際回傳檔名（不猜尺寸後綴）。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mediaKeys = (doc: any): string[] => {
    const keys: string[] = []
    const prefix = doc?.prefix ? `${doc.prefix}/` : ''
    if (doc?.filename) keys.push(`${prefix}${doc.filename}`)
    for (const size of Object.values(doc?.sizes ?? {})) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fn = (size as any)?.filename
      if (fn) keys.push(`${prefix}${fn}`)
    }
    return keys
  }

  // head-object 驗證一個 key 是否真的進了 S3。
  const headExists = async (key: string): Promise<boolean> => {
    if (!s3 || !s3Bucket) return true
    const { HeadObjectCommand } = await import('@aws-sdk/client-s3')
    try {
      await s3.send(new HeadObjectCommand({ Bucket: s3Bucket, Key: key }))
      return true
    } catch {
      return false
    }
  }

  // 序列上傳（一張完成才下一張）＋上傳後驗證主檔與所有尺寸齊全；缺檔則刪 doc 重試（最多 3 次）。
  const photos = []
  for (let i = 0; i < 8; i++) {
    const filePath = path.resolve(PHOTOS_DIR, `LINE_ALBUM_情境照_260610_${i + 1}.jpg`)
    let doc: Awaited<ReturnType<typeof payload.create>> | null = null
    for (let attempt = 1; attempt <= 3; attempt++) {
      const created = await payload.create({
        collection: 'media',
        // ⚠️ 每次上傳給「全新」context 物件，不可共用 seedContext：
        // cloud-storage plugin 的 preserveFileData hook 會把 req.file 暫存進
        // req.context._payloadCloudStorage，afterChange 又會塞 skipCloudStorage。
        // 共用同一個 context 物件 → 上一張的暫存檔/旗標殘留到下一張，
        // 後續圖片的 afterChange 走 skip 分支或拿到 stale file，主檔＋縮圖整批不進 S3。
        context: { ...seedContext },
        data: { alt: photoAlts[i] },
        filePath,
      })
      const keys = mediaKeys(created)
      const missing: string[] = []
      for (const key of keys) {
        if (!(await headExists(key))) missing.push(key)
      }
      if (missing.length === 0) {
        doc = created
        break
      }
      payload.logger.warn(
        `— media[${i + 1}] attempt ${attempt}/3: ${missing.length} S3 object(s) missing (${missing.join(', ')}); retrying...`,
      )
      // 刪掉這次的 doc（連帶刪它已上傳的部分檔），避免後綴累積。
      await payload.delete({ collection: 'media', id: created.id, context: { ...seedContext } })
    }
    if (!doc) {
      throw new Error(
        `media[${i + 1}] failed S3 upload verification after 3 attempts (${filePath})`,
      )
    }
    photos.push(doc)
  }

  // ---------------------------------------------------------------
  // 1b. Figma 真實素材：依 content-assets/photos/figma/_manifest.json 具名上傳。
  //     blocks 以 fig('school-banner.jpg') 取得 media id，取代通用 photos[] 佔位照。
  // ---------------------------------------------------------------
  const FIGMA_DIR = path.resolve(PHOTOS_DIR, 'figma')
  const figMap = new Map<string, Awaited<ReturnType<typeof payload.create>>>()
  let figManifest: { file: string; alt: string }[] = []
  try {
    figManifest = JSON.parse(
      await fsp.readFile(path.resolve(FIGMA_DIR, '_manifest.json'), 'utf8'),
    )
  } catch {
    payload.logger.warn('— No Figma image manifest found; skipping named assets')
  }
  if (figManifest.length) {
    payload.logger.info(`— Seeding Figma named media (${figManifest.length})...`)
    for (const entry of figManifest) {
      const filePath = path.resolve(FIGMA_DIR, entry.file)
      let doc: Awaited<ReturnType<typeof payload.create>> | null = null
      for (let attempt = 1; attempt <= 3; attempt++) {
        const created = await payload.create({
          collection: 'media',
          context: { ...seedContext },
          data: { alt: entry.alt },
          filePath,
        })
        const missing: string[] = []
        for (const key of mediaKeys(created)) {
          if (!(await headExists(key))) missing.push(key)
        }
        if (missing.length === 0) {
          doc = created
          break
        }
        payload.logger.warn(
          `— fig[${entry.file}] attempt ${attempt}/3: ${missing.length} S3 object(s) missing; retrying...`,
        )
        await payload.delete({ collection: 'media', id: created.id, context: { ...seedContext } })
      }
      if (!doc) throw new Error(`fig media ${entry.file} failed S3 upload verify after 3 attempts`)
      figMap.set(entry.file, doc)
    }
  }
  // 具名取圖；找不到就丟錯（抓拼字），未接線的 block 仍用 photos[] 不受影響。
  const fig = (name: string) => {
    const d = figMap.get(name)
    if (!d) throw new Error(`fig('${name}') not in manifest — check content-assets/photos/figma/`)
    return d
  }

  // ---------------------------------------------------------------
  // 2. 大事紀 timeline-events（zh-TW + en）
  //    Sheet about 05 歷程＝空白待客戶補；先沿用舊站內容當第一階段佔位。
  // ---------------------------------------------------------------
  payload.logger.info('— Seeding timeline events...')

  const timelineData: {
    year: number
    sortOrder: number
    zh: { title: string; description: string }
    en: { title: string; description: string }
  }[] = [
    {
      year: 2007,
      sortOrder: 1,
      zh: {
        title: '不老騎士出發',
        description: '於弘道老人福利基金會推動「不老騎士」，開創活躍老化的多元創新模式。',
      },
      en: {
        title: 'Go Grandriders',
        description:
          'Launched the “Go Grandriders” movement at Hondao Senior Citizen’s Welfare Foundation, pioneering active-aging innovation in Taiwan.',
      },
    },
    {
      year: 2013,
      sortOrder: 2,
      zh: {
        title: 'ALL IN ONE 服務起步',
        description: '從照顧秘書、外籍監護工外展服務到醫院微停照顧站，整合照顧的雛形在現場成形。',
      },
      en: {
        title: 'ALL IN ONE services begin',
        description:
          'Care secretaries, outreach for migrant caregivers, and in-hospital care stations — integrated care took shape on the front lines.',
      },
    },
    {
      year: 2017,
      sortOrder: 3,
      zh: {
        title: '陪出院：跨專業整合服務',
        description: '於台中市政府推動「陪出院」，讓長照的銜接從住院那一刻就開始。',
      },
      en: {
        title: 'Hospital-to-home transition program',
        description:
          'Launched the discharge-accompaniment program with the Taichung City Government, starting long-term care from the hospital bed.',
      },
    },
    {
      year: 2018,
      sortOrder: 4,
      zh: {
        title: '部落整合照顧',
        description: '在台中和平原住民部落推動居家照顧、跨專業整合與居家醫療服務。',
      },
      en: {
        title: 'Integrated care in Indigenous communities',
        description:
          'Home care, cross-disciplinary teamwork, and home-based medical services in the Heping Indigenous communities of Taichung.',
      },
    },
    {
      year: 2021,
      sortOrder: 5,
      zh: {
        title: '微光守護',
        description: '新北微光守護與部落微光，為確診高風險家庭送進居家照顧、遠距醫療與智慧照護。',
      },
      en: {
        title: 'Glimmer Care during COVID-19',
        description:
          'Brought home care, telemedicine, and smart care to high-risk COVID-affected families in New Taipei and Indigenous communities.',
      },
    },
    {
      year: 2022,
      sortOrder: 6,
      zh: {
        title: '創照服務設計成立',
        description:
          '成立 Care For Taiwan，以人才培育為核心，讓 ALL IN ONE 照顧服務在全台遍地開花。',
      },
      en: {
        title: 'Care For Taiwan founded',
        description:
          'Care For Taiwan was founded to cultivate care talent and spread the ALL IN ONE care model across Taiwan.',
      },
    },
  ]

  const timelineDocs = []
  for (const item of timelineData) {
    const doc = await payload.create({
      collection: 'timeline-events',
      context: seedContext,
      locale: 'zh-TW',
      data: {
        year: item.year,
        sortOrder: item.sortOrder,
        title: item.zh.title,
        description: item.zh.description,
      },
    })
    await payload.update({
      collection: 'timeline-events',
      id: doc.id,
      context: seedContext,
      locale: 'en',
      data: { title: item.en.title, description: item.en.description },
    })
    timelineDocs.push(doc)
  }

  // ---------------------------------------------------------------
  // 3. 獲獎紀錄 awards（Sheet about 06 公信力：年份+名稱逐字照抄）
  // ---------------------------------------------------------------
  payload.logger.info('— Seeding awards...')

  const awardsData: { year: number; zh: string; en: string }[] = [
    {
      year: 2025,
      zh: '星展銀行社會企業獎勵金計畫',
      en: 'DBS Bank Social Enterprise Grant Program',
    },
    {
      year: 2025,
      zh: '懷世代公益加速器',
      en: 'WhatsGen Social Impact Accelerator',
    },
    {
      year: 2022,
      zh: '日月光控股-女性永續創新人才培育競賽及築夢計畫',
      en: 'ASE Holdings — Women in Sustainability Innovation Talent Competition and Dream Project',
    },
    {
      year: 2022,
      zh: '財團法人信義公益基金會-共好行動',
      en: 'Sinyi Charity Foundation — Common Good Action',
    },
    {
      year: 2021,
      zh: '羅布森-善益空間共享計畫',
      en: 'Robinson — Goodwill Space Sharing Program',
    },
    {
      year: 2021,
      zh: '第18屆夢想資助計畫KEEP WALKING',
      en: 'The 18th KEEP WALKING Fund',
    },
  ]

  const awardDocs = []
  for (const [index, item] of awardsData.entries()) {
    const doc = await payload.create({
      collection: 'awards',
      context: seedContext,
      locale: 'zh-TW',
      data: {
        year: item.year,
        name: item.zh,
        // Awards block 右側大圖取第一筆有照片的獎項（無照片時 surface 佔位）
        ...(index === 0 ? { photo: fig('about-award.jpg').id } : {}),
      },
    })
    await payload.update({
      collection: 'awards',
      id: doc.id,
      context: seedContext,
      locale: 'en',
      data: { name: item.en },
    })
    awardDocs.push(doc)
  }

  // ---------------------------------------------------------------
  // 4. 媒體報導 media-coverage（Sheet about 07 品牌曝光：19 則，日期+標題逐字）
  //    url：Sheet 標「連結待補」→ 以 '#' 佔位（collection url 為必填）
  //    outlet：可由標題判讀者填入；判讀不出者以「待補」佔位（collection outlet 為必填）
  // ---------------------------------------------------------------
  payload.logger.info('— Seeding media coverage (19 則)...')

  const mediaCoverageData: { date: string; title: string; outlet: string }[] = [
    {
      date: '2024-08-14',
      title: '養雞、遛雞、賣雞蛋，寵物雞打破長照困境！｜友雞陪伴｜公視 #獨立特派員 第864集',
      outlet: '公視 獨立特派員',
    },
    {
      date: '2024-07-05',
      title: '「不老騎士」繼續推向國際！ 林依瑩前進蒙古國協助社福長照',
      outlet: '待補',
    },
    {
      date: '2024-06-30',
      title:
        '未成年孩子如何扛起家庭的照顧與生計？被迫長大的孩子如何生存？【失去的童年 囡仔照顧者】2024.06.30 台灣記事簿 第247集',
      outlet: '台灣記事簿',
    },
    {
      date: '2024-06-20',
      title: '照顧現場專欄｜婆婆拒絕媳婦帶跌倒的媽媽回家照顧，「在家住院」上路就夠了嗎？',
      outlet: '照顧現場專欄',
    },
    {
      date: '2024-05-21',
      title: '照顧現場專欄｜微小改變不如精準改革！衝破險境，新政府須落實長照三支箭',
      outlet: '照顧現場專欄',
    },
    {
      date: '2024-05-16',
      title: '一顆蛋的友善循環！伯拉罕合作社，協助部落長者養雞，賣蛋支持公益晚餐，人雞社區共好',
      outlet: '待補',
    },
    {
      date: '2024-04-18',
      title: 'S4EP1｜困住照顧者的致命繩索！未來照顧是不是能活得像個「人」呢？⋯⋯ ft.林依瑩',
      outlet: '待補',
    },
    {
      date: '2024-04-16',
      title: '照顧現場專欄｜失智也能幸福自主！獲世界設計大獎的日照中心如何實踐共生？',
      outlet: '照顧現場專欄',
    },
    {
      date: '2024-03-28',
      title:
        'S3EP12｜照顧殺人悲歌，是否有停止時間點？大安溪畔的奇蹟，是台灣長照困境解方？！！⋯⋯ ft.林依瑩',
      outlet: '待補',
    },
    {
      date: '2024-03-25',
      title: 'EP492 黃越綏｜【名人專訪】進擊的不老夢：前台中市副市長變身長照先鋒！Feat. 林依瑩',
      outlet: '待補',
    },
    {
      date: '2024-03-20',
      title: '獨家｜比芬蘭養老院更厲害的失智照顧！台灣原住民部落竟然有這招',
      outlet: '待補',
    },
    {
      date: '2024-03-14',
      title: '【世界一把抓】陳永峰 feat.林依瑩《老人是問題嗎？》',
      outlet: '世界一把抓',
    },
    {
      date: '2024-03-11',
      title: '林依瑩專欄｜住院就暫停造成三輸，被制約的長照2.0看不見人的需求？',
      outlet: '待補',
    },
    {
      date: '2024-02-27',
      title:
        'S4EP11 當長照走入部落：長照如何成為傳承族群文化與青年返鄉的契機？ ft. 伯拉罕共生照顧勞動合作社 林依瑩',
      outlet: '待補',
    },
    {
      date: '2024-02-25',
      title: 'EP.08 林依瑩/伯拉罕共生照顧勞動合作社理事主席',
      outlet: '待補',
    },
    {
      date: '2024-01-28',
      title: '林依瑩：讓大家喜歡老 才是長壽社會的終極目標',
      outlet: '待補',
    },
    {
      date: '2024-01-09',
      title: '少子女化對策 1 | ft. 林依瑩 (時代力量)',
      outlet: '待補',
    },
    {
      date: '2024-01-03',
      title:
        '【第三勢力投票指南】時代力量 林依瑩：台灣長照體系要健全必須產業化，但實際卻走向了社福化',
      outlet: '待補',
    },
    {
      date: '2023-11-02',
      title: '假資訊化、一堆紙本，長照天天在砍樹！請唐鳯部長站出來推動SDGs',
      outlet: '待補',
    },
  ]

  for (const item of mediaCoverageData) {
    const doc = await payload.create({
      collection: 'media-coverage',
      context: seedContext,
      locale: 'zh-TW',
      data: {
        title: item.title,
        outlet: item.outlet,
        date: item.date,
        url: '#', // 連結待補（Sheet 標註）
      },
    })
    // EN：草稿水準，先鏡像 zh 標題（客戶 6/22 給正式英譯）
    await payload.update({
      collection: 'media-coverage',
      id: doc.id,
      context: seedContext,
      locale: 'en',
      data: { title: item.title, outlet: item.outlet },
    })
  }

  // ---------------------------------------------------------------
  // 5. 案例故事 case-stories（取自舊站真實內容，4 篇 → 3+載入更多可示範）
  // ---------------------------------------------------------------
  payload.logger.info('— Seeding case stories...')

  const caseStoriesData = [
    {
      page: 'care' as const,
      image: photos[0].id,
      zh: {
        title: '新竹返家：陪出院推動計畫',
        summary:
          '住院照顧奔波、重症返家無人接手——與伯拉罕共生照顧勞動合作社共同推動「新竹縣陪出院計畫」，從住院評估到返家整合服務，一案到底。',
        body: rt(
          '2024年開春，因結識新竹縣議會邱靖雅議員，看見新竹縣民面對住院照顧奔波、重症照顧的辛勞，創照服務設計與伯拉罕共生照顧勞動合作社共同倡議「新竹縣陪出院推動計畫」。',
          '計畫分三階段：住院期間完成長照失能等級評估與家庭照顧會議；返家前到宅評估居家環境、照顧床與儀器設備；返家後展開 AIO 整合服務——照顧日程化的計畫擬定、居家與跨專業密切協作，並導入智慧科技。',
          '符合公益援助資格且需要服務的家庭，由專人到府評估、規劃合適的照顧計畫，一起打造 ALL IN ONE 以人為本的幸福長照。',
        ),
      },
      en: {
        title: 'Hsinchu homecoming: the discharge-accompaniment program',
        summary:
          'From hospital assessment to integrated home care — a joint program with the Plahan Co-op that walks families through every step of bringing a loved one home.',
        body: rt(
          'In early 2024, Care For Taiwan and the Plahan Co-op launched the Hsinchu discharge-accompaniment program for families facing the exhausting gap between hospital and home.',
          'The program runs in three stages: in-hospital assessment and family care meetings; pre-discharge home visits to prepare the environment, care bed, and equipment; then integrated ALL IN ONE services at home with smart-care technology.',
        ),
      },
    },
    {
      page: 'care' as const,
      image: photos[3].id,
      zh: {
        title: '部落微光：確診高風險家庭的居家照顧',
        summary:
          '疫情之下，照顧不能停。居家照顧、跨專業整合、遠距醫療與 AI 進到部落與社區，守住確診高風險家庭的日常。',
        body: rt(
          '2021 年新北微光守護、2022 年部落微光，面對 Covid 確診高風險家庭，照顧現場不能等。居家照顧服務、跨專業整合、遠距醫療與 AI 智慧照護一起進場，讓被隔離的家庭依然有人看顧。',
          '這段經驗也讓 ALL IN ONE 模式更加純熟——共生照顧、24 小時居家照顧、重症返家、居家安寧陸續實踐成形，在宅安老直至生命最後，不再是遙不可及的夢。',
        ),
      },
      en: {
        title: 'Glimmer in the tribe: home care for high-risk COVID families',
        summary:
          'Home care, cross-disciplinary teams, telemedicine, and AI — keeping daily life going for high-risk families during the pandemic.',
        body: rt(
          'During the pandemic, care could not pause. The Glimmer Care programs in New Taipei (2021) and Indigenous communities (2022) brought home care, telemedicine, and smart care to high-risk COVID-affected families.',
          'The experience matured the ALL IN ONE model — symbiotic care, 24-hour home care, returning home with critical illness, and home hospice all took root.',
        ),
      },
    },
    {
      page: 'training' as const,
      image: photos[4].id,
      zh: {
        title: '杜格納合作社：林口社宅的社區互助實驗',
        summary:
          '受住都中心之託，在林口社宅從零開始籌組社區互助合作社——從烘焙課到「第一桶金行動」，讓社區自己長出照顧彼此的能力。',
        body: rt(
          '創照服務設計接受國家住宅及都市更新中心之託，在林口社宅籌備成立「杜格納合作社」。「杜格納」取自挪威語，原意是社區互助活動，在北歐已是社區的傳統。',
          '從 2023 年 4 月進駐空無一物的處所開始，以母親節送蛋糕、烘焙課程認識住民、招收種子人力，一起協助社區內急需幫助的住民——清潔打掃、課後輔導、獨老照顧。',
          '2024 年試辦「第一桶金行動」，社員從產品設計、定價、分工生產到擺攤販售與分紅全程實作，凝聚向心力，也練習合作社未來如何獨立營運。任務完成時退場、讓社員自行營運，是我們最看重的目標。',
        ),
      },
      en: {
        title: 'Dugnad Co-op: a mutual-aid experiment in Linkou social housing',
        summary:
          'Commissioned by the National Housing and Urban Regeneration Center, a community co-op grew from zero — baking classes, seed members, and a “first bucket of gold” pilot.',
        body: rt(
          '“Dugnad” is Norwegian for communal volunteer work. Starting from an empty space in April 2023, the co-op met residents through baking classes, recruited seed members, and helped neighbors in need.',
          'In 2024 the “first bucket of gold” pilot let members run the full co-op cycle — product design, pricing, production, market stalls, and profit sharing — building the skills and solidarity to operate independently.',
        ),
      },
    },
    {
      page: 'training' as const,
      image: photos[2].id,
      zh: {
        title: '一貫道樂齡據點：讓道場成為社區的祝福',
        summary:
          '與寶光建德慈善基金會攜手，在三重、新竹、台中三處道場推動樂齡據點——用運動、療癒與知識課程，讓長輩成為彼此的照顧者。',
        body: rt(
          '2024 年初，寶光建德慈善基金會與創照攜手合作「讓道場成為社區的祝福——一貫道樂齡據點計畫」，以三重天合宮、新竹天成宮及台中天一宮為試辦場域。',
          '依各道場成員的年齡與喜好設計課程：靜態歌唱與小組團康、經絡拳拍打、營養講座與繪畫課程；並參考日本「居場所」概念，培訓長輩成為據點志工，學習智能生命量測，翻轉被照顧的刻板印象。',
          '長輩說：「讓整個身體細胞都活動起來了！」「對人生越來越有樂趣，不因年紀大！」——預防臥床與失智、活化社區空間、導入智能健康管理，據點一步步達成。',
        ),
      },
      en: {
        title: 'Active-aging hubs at I-Kuan Tao temples',
        summary:
          'With the Baoguang Jiande Charity Foundation, three temples became community hubs for healthy aging — exercise, healing arts, and health literacy for elders, by elders.',
        body: rt(
          'In early 2024, Care For Taiwan partnered with the Baoguang Jiande Charity Foundation to pilot active-aging community hubs at three temples in Sanchong, Hsinchu, and Taichung.',
          'Programs are tailored to each community — singing and group games, meridian exercise, nutrition talks, and painting. Elders train as hub volunteers and learn smart health monitoring, flipping the script on being “the cared-for.”',
        ),
      },
    },
  ]

  for (const story of caseStoriesData) {
    const doc = await payload.create({
      collection: 'case-stories',
      context: seedContext,
      locale: 'zh-TW',
      data: {
        title: story.zh.title,
        summary: story.zh.summary,
        body: story.zh.body,
        image: story.image,
        page: story.page,
      },
    })
    await payload.update({
      collection: 'case-stories',
      id: doc.id,
      context: seedContext,
      locale: 'en',
      data: {
        title: story.en.title,
        summary: story.en.summary,
        body: story.en.body,
      },
    })
  }

  // ---------------------------------------------------------------
  // 6. 六頁 pages（zh-TW 建立 → en 更新；layout 為 localized 欄位）
  //    文字真理 = docs/content/sheet-full-20260612.md，逐字照抄。
  // ---------------------------------------------------------------
  payload.logger.info('— Seeding pages...')

  const heroNone = { type: 'none' as const }

  type PageSeed = {
    slug: string
    zh: {
      title: string
      metaTitle: string
      metaDescription: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      layout: any[]
    }
    en: {
      title: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      layout: any[]
    }
  }

  // Sheet training 03「什麼是AIO？」（training 版小標：從「人」出發）
  const aioZh = {
    blockType: 'content',
    align: 'center',
    title: '什麼是 AIO解決方案？',
    richText: rtNodes(
      h3('從「人」出發的 AIO 整合照顧模式'),
      p(
        'AIO是源自於創辦人（林依瑩）發展「All In One」的照顧理念，認為好的照顧應該是依照個案的需求出發，透過整合醫療、照顧、社區與生活資源，串連不同階段所需的協助，建構人性化的長照、提供更多元且完整的照顧支持。',
      ),
    ),
    // Figma mid1：標題/副標/內文置中，下方三圖橫排置中
    images: [{ image: photos[1].id }, { image: photos[4].id }, { image: photos[6].id }],
    imagePosition: 'belowCenter',
  }

  const aioEn = {
    blockType: 'content',
    align: 'center',
    title: 'What is the AIO Solution?',
    richText: rtNodes(
      h3('An integrated, person-centered care model'),
      p(
        'AIO comes from founder Lin Yi-ying’s “All In One” care philosophy: good care starts from each person’s needs, integrating medical, care, community, and daily-life resources to connect the support needed at every stage — building humane long-term care with more complete support.',
      ),
    ),
    images: [{ image: photos[1].id }, { image: photos[4].id }, { image: photos[6].id }],
    imagePosition: 'belowCenter',
  }

  // care 專屬：AIO 區帶眉標「AIO Solutions」+ care 版小標「一套以人為本的AIO整合照顧模式」
  // （Sheet care 03 與 training 03 小標不同，故 care 不再 spread aioZh）
  const aioZhCare = {
    blockType: 'content',
    align: 'center',
    eyebrow: 'AIO Solutions',
    title: '什麼是 AIO整合照顧模式？',
    richText: rtNodes(
      h3('從「人」出發的 AIO 整合照顧模式'),
      p('「需求之所在，服務之所在」這句話是 AIO 整合照顧模式的靈魂。'),
      p(
        '源自創辦人林依瑩的初衷，我們認為好的照顧，是從需要中變化出靈活且人性化的服務。透過串連碎片化的醫療、長照、社區與生活資源，讓家屬不再四處奔波找幫手；並藉由「賦能」陪伴個案重新長出面對生活的觸角，打造真正以人為本且尊嚴的照顧體系。',
      ),
    ),
    images: [
      { image: fig('care-aio-1.jpg').id },
      { image: fig('care-aio-2.jpg').id },
      { image: fig('care-aio-3.jpg').id },
    ],
    imagePosition: 'belowCenter',
  }
  const aioCareImages = [
    { image: fig('care-aio-1.jpg').id },
    { image: fig('care-aio-2.jpg').id },
    { image: fig('care-aio-3.jpg').id },
  ]
  const aioEnCare = { ...aioEn, eyebrow: 'AIO Solutions', images: aioCareImages }

  /*
   * Sheet 首頁 03 品牌簡介【替代版】（CMS content block 無備用欄位，先留存於此，
   * 待後台需要時切換）：
   * 標題：在熟悉之處，尊嚴安老；用創新照顧，支持生活的無限可能。
   * 創照服務設計聚焦臺灣高齡社會的在地需求，投注於跨領域合作、服務創新與專業人才深度養成，
   * 致力陪伴更多家庭找到最適切且安心的照顧支持。 我們推動 AIO（All In One）整合照顧模式，
   * 緊密串連醫療、長照與社區資源，在落實以人為本生活照顧服務的同時，我們更深耕長照從業人員
   * 的專業價值，讓投入這份志業的人才被社會看見並珍視，期盼這份溫暖的力量能永續，共創一個
   * 溫馨在地安老社會。
   */

  const pagesData: PageSeed[] = [
    {
      slug: 'home',
      zh: {
        title: '首頁',
        metaTitle: '創新照顧，開啟照顧無限可能',
        metaDescription:
          '創照服務設計（Care For Taiwan）以 ALL IN ONE 整合照顧服務陪伴長照家庭：返家照顧、人才培育、組織培力與照顧科技。',
        layout: [
          // Sheet 首頁 01 Banner：每張圖各自帶文字（圖＋文一起滑）。
          // 預設三張同一句 Slogan（客戶可在後台逐張改成不同文字）。
          {
            blockType: 'hero',
            // 三句皆取自文案 Sheet（Banner slogan + 品牌簡介兩版標題），示範「每張圖各自文字」。
            // 客戶可於後台逐張改成想要的文字，或全部設成同一句。
            images: [
              {
                image: fig('home-kv.jpg').id,
                title: '讓需要照顧的人獲得更完整的支持，',
                subtitle: '讓投入照顧的人擁有更好的成長與發展。',
              },
              {
                image: fig('home-kv.jpg').id,
                title: '創新照顧，開啟照顧無限可能。',
              },
              {
                image: fig('home-kv.jpg').id,
                title: '在熟悉之處，尊嚴安老；',
                subtitle: '用創新照顧，支持生活的無限可能。',
              },
            ],
          },
          // Sheet 首頁 02 最新消息條：垂直輪播需多則才會動（範例文字照 Sheet）
          {
            blockType: 'newsTicker',
            enabled: false,
            items: [
              {
                text: '開學日 2026/03/07（六）09:00–16:30　·　CFT 照顧學校（414 臺中市烏日區溪岸路 8-3 號）',
                enabled: true,
              },
              {
                text: '「新竹縣陪出院推動計畫」進行中，歡迎符合公益援助資格的家庭洽詢',
                url: '/care',
                enabled: true,
              },
              {
                text: 'CFT 照顧學校課程陸續開放報名，歡迎有意投入照顧的夥伴了解',
                url: 'https://school.carefortaiwan.com.tw',
                enabled: true,
              },
              {
                text: '杜格納合作社於林口社宅持續招募社區夥伴，一起在地共老',
                url: '/training',
                enabled: true,
              },
            ],
          },
          // Sheet 首頁 03 品牌簡介（Figma 230:803：左圖右文 + About 眉標 + 認識創照 pill）
          {
            blockType: 'content',
            eyebrow: 'About Us',
            title: '在熟悉之處，尊嚴安老；用創新照顧，支持生活的無限可能。',
            ctaLabel: '了解更多',
            ctaUrl: '/about',
            richText: rt(
              '「需求之所在，服務之所在」創照服務設計緊扣這份初衷。',
              '聚焦臺灣高齡社會的在地需求，推動 AIO（All In One）整合照顧模式，緊密串連醫療、長照與社區資源，致力陪伴更多家庭找到最適切且安心的照顧支持。',
              '在落實以人為本生活照顧服務的同時，我們更深耕長照從業人員的專業價值，讓投入這份志業的人才被社會看見並珍視，期盼這份溫暖的力量能永續，共創一個溫馨的在地安老社會。',
            ),
            // Figma 230:803：用設計稿合成好的三圖拼貼（489×576 單一圖）
            images: [{ image: fig('home-3pics.png').id }],
            imagePosition: 'left',
          },
          // Sheet 首頁 04 三大服務（1-3）＝編號特色大區（01/02/03 交錯帶）
          {
            blockType: 'numberedFeatures',
            eyebrow: 'Services',
            items: [
              {
                number: '01',
                title: '整合服務創新',
                text: '照顧需求不只存在於醫院，也存在於返家後的每一天。面對出院返家後繁瑣的照顧安排與需求，我們透過跨專業團隊整合照顧資源，提供從醫療到居家的全方位支持，陪伴家庭度過照顧轉換期。',
                image: fig('home-service1.jpg').id,
              },
              {
                number: '02',
                title: '人才培育創新',
                text: '面對長照人才職涯受限、薪資停滯與專業發展不足的現況，我們成立 Care for Taiwan（CFT）照顧學校，培育AIO照顧服務員、AIO照顧教練、AIO照顧設計師及AIO在宅醫師等跨專業人才，發展社區／居家融合照顧模式。',
                image: fig('home-service2.jpg').id,
              },
              {
                number: '03',
                title: '照顧科技創新',
                text: 'All In One（AIO）整合照顧模式參與對象有照顧服務員、專業人員、家屬等多種角色，為提升照顧協作與服務效率，打造出全新、以人為本的溝通系統-Connect 10，希望藉由此系統達到資訊共享，讓整體照顧歷程能被即時看見、延續與回饋，也讓照顧決策更貼近個案的需求。',
                image: fig('home-service3.jpg').id,
              },
            ],
          },
          // Sheet 首頁 05 案例輪播：創照分享（客戶 6/16 隱藏；文字為舊站真實內容，但分類/封面為佔位，故維持隱藏待資料齊全）
          { blockType: 'content', enabled: false, eyebrow: 'Insights', title: '創照分享', align: 'center' },
          {
            blockType: 'articleCards',
            enabled: false,
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: false,
          },
          // Sheet 首頁 06 CTA按鈕 1-3（TA 導流三磚；視覺順序 school / training / care）
          {
            blockType: 'taCta',
            variant: 'tiles',
            cards: [
              {
                title: '我想探索照顧專業的更多可能',
                buttonLabel: '認識照顧學校',
                url: '/school',
              },
              {
                title: '我想導入AIO整合照顧模式到組織',
                buttonLabel: '洽詢組織培力合作模式',
                url: '/training',
              },
              {
                title: '我需要整合照顧',
                buttonLabel: '了解 AIO 整合照顧模式',
                url: '/care',
              },
            ],
          },
          // Sheet 首頁 07 氛圍收尾：品牌影片（Figma 82:233＝淺灰 #D9D9D9 placeholder＋中央播放鈕；
          // 影片網址與封面圖待客戶提供，先留 Figma 灰底佔位，不套深色照片以免播放鈕被吃掉）
          { blockType: 'videoBlock', enabled: false },
        ],
      },
      en: {
        title: 'Home',
        layout: [
          {
            blockType: 'hero',
            images: [
              {
                image: fig('home-kv.jpg').id,
                title: 'More complete support for those who need care,',
                subtitle: 'and better growth and development for those who give care.',
              },
              {
                image: fig('home-kv.jpg').id,
                title: 'Innovating care, opening every possibility.',
              },
              {
                image: fig('home-kv.jpg').id,
                title: 'Ageing with dignity in familiar surroundings,',
                subtitle: 'supported by innovative care.',
              },
            ],
          },
          {
            blockType: 'newsTicker',
            enabled: false,
            items: [
              {
                text: 'Opening Day 2026/03/07 (Sat) 09:00–16:30 · CFT Care School (No. 8-3, Xi’an Rd., Wuri Dist., Taichung 414)',
                enabled: true,
              },
              {
                text: 'The Hsinchu County “Companion-Home Discharge” program is underway — families eligible for public-benefit support are welcome to enquire.',
                url: '/en/care',
                enabled: true,
              },
              {
                text: 'CFT Care School courses are opening for enrollment — partners interested in caregiving are welcome to learn more.',
                url: 'https://school.carefortaiwan.com.tw',
                enabled: true,
              },
            ],
          },
          {
            blockType: 'content',
            eyebrow: 'About Us',
            title:
              'Ageing with dignity in familiar surroundings; supporting life’s endless possibilities through innovative care.',
            ctaLabel: 'Learn more',
            ctaUrl: '/en/about',
            richText: rt(
              '“Where the need is, there the service is.” This is the conviction at the heart of Care For Taiwan’s service design.',
              'We focus on the local needs of Taiwan’s aging society and advance the AIO (All In One) integrated care model, tightly connecting medical, long-term care, and community resources — committed to helping more families find the most fitting and reassuring care support.',
              'While delivering person-centered everyday care, we also deepen the professional value of long-term care workers, so those who devote themselves to this calling are seen and cherished by society. We hope this warm strength can endure, together creating a caring society where people age well in their own communities.',
            ),
            // Figma 230:803: 3-photo offset collage
            images: [{ image: fig('home-3pics.png').id }],
            imagePosition: 'left',
          },
          {
            blockType: 'numberedFeatures',
            eyebrow: 'Services',
            items: [
              {
                number: '01',
                title: 'Integrated service innovation',
                text: 'Care needs exist not only in hospitals but in every day after returning home. Facing the complex care arrangements and needs after discharge, we integrate care resources through cross-disciplinary teams, providing full support from medical care to home life, accompanying families through care transitions.',
                image: fig('home-service1.jpg').id,
              },
              {
                number: '02',
                title: 'Talent cultivation innovation',
                text: 'Facing limited career paths, stagnant pay, and insufficient professional development in long-term care, we founded the Care for Taiwan (CFT) Care School — cultivating AIO care workers, AIO care coaches, AIO care designers, and AIO home physicians, and developing community/home integrated care models.',
                image: fig('home-service2.jpg').id,
              },
              {
                number: '03',
                title: 'Care technology innovation',
                text: 'The All In One (AIO) integrated care model involves many roles — care workers, professionals, family members, and more. To improve care collaboration and service efficiency, we built a new, person-centered communication system — Connect 10 — so that information is shared, the whole care journey can be seen, continued, and fed back in real time, and care decisions stay closer to each person’s needs.',
                image: fig('home-service3.jpg').id,
              },
            ],
          },
          { blockType: 'content', enabled: false, eyebrow: 'Insights', title: 'Stories', align: 'center' },
          {
            blockType: 'articleCards',
            enabled: false,
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: false,
          },
          {
            blockType: 'taCta',
            variant: 'tiles',
            cards: [
              {
                title: 'I want to become a care professional',
                buttonLabel: 'Explore the Care School and courses',
                url: '/en/school',
              },
              {
                title: 'I want to strengthen my organization’s care capacity',
                buttonLabel: 'Ask about organizational training',
                url: '/en/training',
              },
              {
                title: 'I am looking for care services',
                buttonLabel: 'Learn about AIO family care services',
                url: '/en/care',
              },
            ],
          },
          { blockType: 'videoBlock', enabled: false },
        ],
      },
    },
    {
      slug: 'about',
      zh: {
        title: '認識創照',
        metaTitle: '認識創照',
        metaDescription:
          '創照服務設計的緣起與願景：從照顧一個人，到改變一個照顧系統。ALL IN ONE 以人為本的照顧模式一路走來。',
        layout: [
          // Sheet about 01 Banner：頁首綠帶
          {
            blockType: 'pageHeader',
            title: '認識創照',
            eyebrow: 'About',
            image: fig('about-banner.jpg').id,
          },
          // Sheet about 02 品牌故事(Why)：緣起
          {
            blockType: 'content',
            eyebrow: 'Beginning',
            title: '緣起',
            richText: rtNodes(
              h3('從照顧一個人，到改變一個照顧系統'),
              p(
                '臺灣邁入超高齡社會，照顧需求急遽攀升，許多家庭仍受困於資源分散、資訊複雜的困境。多年來，我們深入社區與照顧第一線，深刻體會到——照顧不只是服務項目的加總，更是一段陪伴、理解與整合的過程。為此，我們持續發展AIO（All In One）整合照顧模式，串連跨專業團隊、社區資源與人才，將零散轉化為陪伴家庭的支持系統。',
              ),
              p(
                '我們致力於人才培育與服務創新，讓照顧成為被尊重且永續的專業力量，攜手建立以人為本的AIO照顧生態系。',
              ),
            ),
            image: fig('about-begin.jpg').id,
            imagePosition: 'right',
          },
          // Sheet about 03 品牌願景(Vision)：宣言帶（滿版照片底＋白字標語＋三圓）
          {
            blockType: 'missionCircles',
            variant: 'band',
            slogan: '讓需要照顧的人，獲得完整的支持；\n讓投入照顧的人，擁有更好的成長與發展。',
            backgroundImage: fig('about-vision-bg.jpg').id,
            circles: [
              { label: '培育-照顧的人' },
              { label: '支持-照顧的路' },
              { label: '創造-照顧的未來' },
            ],
          },
          // Sheet about 04 影響力：Sheet 空白——數字為佔位，待客戶補
          {
            blockType: 'statsCards',
            enabled: false,
            cards: [
              { number: '500', suffix: '+', label: '照顧學校學員' },
              { number: '15', suffix: '+', label: '合作組織' },
              { number: '10', suffix: 'yrs+', label: '創新照顧經驗' },
              { number: '8', suffix: '+', label: '社區參與' },
            ],
          },
          // Sheet about 05 歷程：先以既有大事紀佔位（Figma 乾淨單行 pill→不顯示說明文）
          {
            blockType: 'timeline',
            enabled: false,
            mode: 'reference',
            showDescription: false,
            events: timelineDocs.map((doc) => doc.id),
          },
          // Sheet about 06 公信力：獲獎記錄
          {
            blockType: 'awards',
            source: 'collection',
            awards: awardDocs.map((doc) => doc.id),
          },
          // Sheet about 07 品牌曝光(Press)：媒體報導（左圖+右側 Press眉標/H1/列表，米色帶）
          {
            blockType: 'articleCards',
            enabled: false,
            source: 'media-coverage',
            eyebrow: 'Press',
            heading: '媒體報導',
            leadImage: photos[1].id,
            batchSize: 3,
            enableLoadMore: true,
          },
          // Sheet about 08 CTA按鈕：聯絡我們（頁尾全幅照片帶；round4 #1→指向 /contact 詢問表單錨點 #sheet）
          {
            blockType: 'taCta',
            variant: 'photoBand',
            cards: [
              {
                title: '聯絡我們',
                buttonLabel: '聯絡我們',
                url: '/contact/#sheet',
                image: fig('about-cta.jpg').id,
              },
            ],
          },
        ],
      },
      en: {
        title: 'About Us',
        layout: [
          {
            blockType: 'pageHeader',
            title: 'About Us',
            eyebrow: 'About',
            image: fig('about-banner.jpg').id,
          },
          {
            blockType: 'content',
            eyebrow: 'Beginning',
            title: 'Our Story',
            richText: rtNodes(
              h3('From caring for one person to changing a care system'),
              p(
                'As Taiwan enters a super-aged society, care needs are rising sharply, and many families are still caught in scattered resources and complex information. For years, we have worked deep in communities and on the front lines of care, coming to understand that care is not merely the sum of services — it is a journey of companionship, understanding, and integration. That is why we keep developing the All In One (AIO) care model, connecting cross-disciplinary teams, community resources, and talent, turning the scattered into a support system that walks with families.',
              ),
              p(
                'Committed to talent cultivation and service innovation, we make care a respected and sustainable profession — building a person-centered All In One care ecosystem together.',
              ),
            ),
            image: fig('about-begin.jpg').id,
            imagePosition: 'right',
          },
          {
            blockType: 'missionCircles',
            variant: 'band',
            slogan:
              'Complete support for those who need care;\nbetter growth and development for those who give care.',
            backgroundImage: fig('about-vision-bg.jpg').id,
            circles: [
              { label: 'Cultivating the people of care' },
              { label: 'Supporting the journey of care' },
              { label: 'Creating the future of care' },
            ],
          },
          {
            blockType: 'statsCards',
            enabled: false,
            cards: [
              { number: '500', suffix: '+', label: 'Care School learners' },
              { number: '15', suffix: '+', label: 'partner organizations' },
              { number: '10', suffix: 'yrs+', label: 'of care innovation' },
              { number: '8', suffix: '+', label: 'communities engaged' },
            ],
          },
          {
            blockType: 'timeline',
            enabled: false,
            mode: 'reference',
            showDescription: false,
            events: timelineDocs.map((doc) => doc.id),
          },
          {
            blockType: 'awards',
            source: 'collection',
            awards: awardDocs.map((doc) => doc.id),
          },
          {
            blockType: 'articleCards',
            enabled: false,
            source: 'media-coverage',
            eyebrow: 'Press',
            heading: 'Media Coverage',
            leadImage: photos[1].id,
            batchSize: 3,
            enableLoadMore: true,
          },
          {
            blockType: 'taCta',
            variant: 'photoBand',
            cards: [
              {
                title: 'Contact Us',
                buttonLabel: 'Contact Us',
                url: '/en/contact/#sheet',
                image: fig('about-cta.jpg').id,
              },
            ],
          },
        ],
      },
    },
    {
      slug: 'care',
      zh: {
        title: '家庭照顧服務',
        metaTitle: 'AIO整合照顧服務',
        metaDescription:
          '從需求評估、整合照顧到返家支持，我們陪伴每個家庭走向穩定的長照生活。AIO 整合照顧模式：個人 AIO 服務。',
        layout: [
          // Sheet care 01 Banner（Figma 共用 master Banner）
          {
            blockType: 'pageHeader',
            title: 'AIO整合照顧服務',
            eyebrow: 'AIO Solution-Continuum of Care',
            image: fig('care-banner.jpg').id,
            gradient: 'lime',
            // care-banner 人物臉部在照片上半部，裁切對齊上方（預設下方會切到助行器/腿）
            focal: 'top',
          },
          // Sheet care 02 Hero 引言（Figma hero 大圖+引言卡）
          {
            blockType: 'twoColumn',
            variant: 'hero',
            direction: 'imageLeft',
            image: fig('care-hero.jpg').id,
            richText: rt('從需求評估、整合照顧到返家支持，我們陪伴每個家庭走向穩定的長照生活。'),
          },
          // Sheet care 03 什麼是AIO？（care 版帶「AIO Solutions」眉標）
          aioZhCare,
          // Sheet care 04 痛點介紹（Figma 306:606 Venn＋衛星數據圓）
          {
            blockType: 'infographic',
            variant: 'venn',
            leftLabel: '個人生活影響',
            rightLabel: '職場角色影響',
            leftStats: [
              { value: '8年', label: '平均照顧年限為' },
              { value: '6-7成', label: '照顧者出現身心耗損' },
              { value: '前6個月', label: '最混亂也最無助' },
            ],
            rightStats: [
              { value: '13.3萬', label: '每年因照顧離職人數' },
              { value: '45-49歲', label: '離職高峰主力' },
              { value: '5倍', label: '流失一位員工，約損失其年薪' },
            ],
          },
          // Sheet care 04 服務內容（Figma 257:387 左文右圖）
          {
            blockType: 'twoColumn',
            direction: 'imageRight',
            eyebrow: 'Family Care Services',
            image: fig('care-model-1.jpg').id,
            // Figma care 257:386：右側 pic1+pic2 對角錯位斜疊
            images: [{ image: fig('care-model-1.jpg').id }, { image: fig('care-model-2.jpg').id }],
            title: 'AIO整合照顧服務模式',
            richText: rtNodes(
              h3('從理解需求開始，陪伴每一段照顧歷程'),
              p('家庭照顧壓力，正悄悄影響著個人的生活，也影響著工作職場角色⋯'),
              p(
                '有人正在面對家人出院返家的照顧安排、為失智照顧與長期照護感到徬徨，也有人在工作與照顧責任之間來回奔波。照顧需求往往不只發生在某一個時刻，而是伴隨著家庭狀況的改變，持續出現新的挑戰與選擇。',
              ),
              p(
                '我們以 AIO 整合照顧模式為核心，透過理解你的需求、釐清問題開始，逐步串連所需的照顧資源與支持系統，協助家庭找到適合的照顧方式；同時也協助企業建立照顧支持機制，讓員工在面對照顧責任時，能獲得更多理解與支持！',
              ),
              p(
                '我們相信照顧不該由個人獨自承擔，而是透過專業團隊與資源整合，共同找到更安心、更可持續的照顧解方。',
              ),
            ),
          },
          // Figma care-icon 258:640：運作 4 米色橫卡
          {
            blockType: 'iconFeatures',
            enabled: false,
            variant: 'cards',
            items: [
              { title: '需求評估', text: '梳理照顧困境' },
              { title: '設計規劃', text: '照顧策略與規劃' },
              { title: '串連資源', text: '醫療、照顧與社區資源' },
              { title: '持續陪伴', text: '建立友善照顧支持機制' },
            ],
          },
          // Sheet care 05 導流（Figma ta 米色帶 95:509 + 雙連結卡；EAP 隱藏故兩按鈕暫連 /contact）
          {
            blockType: 'taCta',
            variant: 'photoCards',
            intro: '我們提供兩種切入方式。\n企業可以透過系統性支持員工；一般個人也可以直接預約諮詢，快速得到照顧規劃的協助。',
            cards: [
              { title: '我是企業 HR 或主管', image: photos[6].id, url: '/contact/#sheet' },
              { title: '我是家屬', image: photos[3].id, url: '/contact/#sheet' },
            ],
          },
          // Figma photowall 263:431：全寬 5 圖橫向視差帶（導流與個人 AIO 之間）
          {
            blockType: 'photoStrip',
            parallax: true,
            images: [
              { image: fig('care-wall-1.jpg').id },
              { image: fig('care-wall-2.jpg').id },
              { image: fig('care-wall-3.jpg').id },
              { image: fig('care-wall-4.jpg').id },
              { image: fig('care-wall-5.jpg').id },
            ],
          },
          // Sheet care 07 個人AIO服務（Figma 263:442 米色帶：左文＋右 slogan＋綠引言卡）
          {
            blockType: 'twoColumn',
            variant: 'quotes',
            direction: 'imageRight',
            eyebrow: 'Personal AIO Service',
            lead: '照顧需求出現時，\n我們不需要單打獨鬥',
            image: photos[3].id,
            title: '個人 AIO 服務',
            richText: rtNodes(
              p(
                '每個家庭面對的照顧情境都不同，有人正在準備出院返家，有人面臨失智照顧挑戰，也有人希望減輕長期照顧帶來的壓力。許多家庭都曾經歷相同的困惑：不知道該找誰協助、不確定有哪些資源可以運用，也難以在短時間內做出適合的照顧安排。',
              ),
              p(
                'AIO（All In One）整合照顧模式，從需求評估、照顧規劃到資源串連與持續陪伴，協助家庭找到適合自己的照顧方式，減少家庭照顧壓力。',
              ),
            ),
            items: [
              { title: '「老父親剛出院，醫院說可以回家了，但我完全不知道怎麼照顧他。」' },
              { title: '「一邊上班一邊照顧媽媽，已經很久沒有睡好了，不知道還能撐多久。」' },
            ],
          },
          // Figma personal-icon 269:648：5 直卡深淺綠輪替
          {
            blockType: 'iconFeatures',
            variant: 'pillars',
            items: [
              { title: '出院返家支持', text: '協助銜接返家後的照顧安排' },
              { title: '長期照顧規劃', text: '依需求共同討論照顧方向與安排' },
              { title: '醫療與照顧資源整合', text: '串連醫療、長照與社區支持系統' },
              { title: '跨專業團隊協作', text: '整合不同專業角色，共同回應照顧需求' },
              { title: '持續追蹤陪伴', text: '陪伴照顧者與被照顧者，給予支持' },
            ],
          },
          // Sheet care 06 企業EAP方案（Figma 269:655：跨欄 slogan＋左圖右文）
          {
            blockType: 'twoColumn',
            enabled: false,
            direction: 'imageLeft',
            lead: '工作與照顧角色之間的拉扯，\n企業也能成為支持的力量',
            eyebrow: 'Enterprise EAP Program',
            image: photos[6].id,
            title: '企業 EAP 方案',
            richText: rtNodes(
              p(
                '台灣已進入超高齡社會，每天都有員工為照顧家人，悄悄地分心、請假、甚至離職。當照顧需求增加，往往影響專注、出勤與身心狀態，也讓主管與團隊面臨新的挑戰。',
              ),
              p(
                '透過企業EAP方案，從照顧風險調查、員工諮詢到後續轉介服務，協助企業建立友善照顧支持機制、讓員工找到適合的資源與解方，也讓企業在照顧員工的同時，守護團隊的穩定與發展。',
              ),
            ),
          },
          // Figma eap-icon 263:421：整寬米色卡 3 步驟
          {
            blockType: 'stepsBlock',
            enabled: false,
            variant: 'cardRow',
            items: [
              {
                title: 'Step 1 員工家庭照顧壓力指數調查',
                text: '評估員工的照顧壓力、工作影響與身心狀態',
              },
              {
                title: 'Step 2 高風險員工舒壓相談會',
                text: '照顧諮詢，陪伴員工釐清困境與精準需求，提供即時支持',
              },
              {
                title: 'Step 3 AIO 評估與個案轉介',
                text: '連結政府長照與跨專業資源，制定可持續照顧計畫，降低員工照顧壓力',
              },
            ],
          },
          // Sheet care 07 真實案例
          { blockType: 'content', enabled: false, title: '案例分享' },
          {
            blockType: 'articleCards',
            enabled: false,
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: true,
          },
          // Sheet care 08 CTA（Figma 97:559 照片帶＋置中 pill 按鈕）
          {
            blockType: 'taCta',
            enabled: false,
            variant: 'photoBand',
            cards: [
              {
                title: '諮詢家庭照顧服務',
                buttonLabel: '諮詢家庭照顧服務',
                url: '/contact/#sheet',
                image: photos[7].id,
              },
            ],
          },
        ],
      },
      en: {
        title: 'Family Care Services',
        layout: [
          {
            blockType: 'pageHeader',
            title: 'AIO Solutions — Family Care Services',
            eyebrow: 'AIO Solutions — Family Care Services',
            image: fig('care-banner.jpg').id,
            gradient: 'lime',
          },
          {
            blockType: 'twoColumn',
            variant: 'hero',
            direction: 'imageLeft',
            image: fig('care-hero.jpg').id,
            richText: rt(
              'From needs assessment and integrated care to homecoming support, we walk with every family toward a stable long-term care life.',
            ),
          },
          aioEnCare,
          {
            blockType: 'infographic',
            variant: 'venn',
            leftLabel: 'Personal life',
            rightLabel: 'Work roles',
            leftStats: [
              { value: '8+ yrs', label: 'average caregiving duration' },
              { value: '60%', label: 'of caregivers face burnout' },
              { value: '6 mo.', label: 'first months are the hardest' },
            ],
            rightStats: [
              { value: '133K', label: 'leave jobs for caregiving each year' },
              { value: '45', label: 'peak age of caregiving resignations' },
              { value: '5x', label: 'annual salary lost per departure' },
            ],
          },
          {
            blockType: 'twoColumn',
            direction: 'imageRight',
            eyebrow: 'Family Care Services',
            image: fig('care-model-1.jpg').id,
            images: [{ image: fig('care-model-1.jpg').id }, { image: fig('care-model-2.jpg').id }],
            title: 'How family care services work',
            richText: rtNodes(
              h3('Starting from understanding, accompanying every care journey'),
              p('Family caregiving pressure quietly affects personal life — and work roles too.'),
              p(
                'Some are arranging care after a family member’s discharge; some feel lost facing dementia and long-term care; others shuttle between work and caregiving. Care needs change as family situations change, bringing new challenges and choices.',
              ),
              p(
                'With the AIO integrated care model at the core, we start by understanding your needs, then connect the care resources and support systems required — helping families find the right way to care, and helping companies build care-friendly support for employees.',
              ),
              p(
                'We believe care should not be carried alone. Through professional teams and resource integration, we find safer, more sustainable care solutions together.',
              ),
            ),
          },
          {
            blockType: 'iconFeatures',
            enabled: false,
            variant: 'cards',
            items: [
              { title: 'Needs assessment', text: 'Untangling care challenges' },
              { title: 'Care design', text: 'Care strategy and planning' },
              { title: 'Resource connection', text: 'Medical, care, and community resources' },
              { title: 'Ongoing companionship', text: 'Building friendly care support systems' },
            ],
          },
          {
            blockType: 'taCta',
            variant: 'photoCards',
            intro:
              'Whatever care situation you are facing, you can book a consultation directly\nand let us help you find a fitting care plan.',
            cards: [
              {
                title: 'I am an HR manager or supervisor',
                image: photos[6].id,
                url: '/en/contact/#sheet',
              },
              {
                title: 'I am a family member',
                image: photos[3].id,
                url: '/en/contact/#sheet',
              },
            ],
          },
          // Figma photowall 263:431：full-width 5-image horizontal parallax band
          {
            blockType: 'photoStrip',
            parallax: true,
            images: [
              { image: fig('care-wall-1.jpg').id },
              { image: fig('care-wall-2.jpg').id },
              { image: fig('care-wall-3.jpg').id },
              { image: fig('care-wall-4.jpg').id },
              { image: fig('care-wall-5.jpg').id },
            ],
          },
          {
            blockType: 'twoColumn',
            variant: 'quotes',
            direction: 'imageRight',
            eyebrow: 'Personal AIO Service',
            lead: 'When care needs arise,\nno one has to face them alone',
            image: photos[3].id,
            title: 'Personal AIO Services',
            richText: rtNodes(
              p(
                'Every family’s care situation is different — preparing for discharge, facing dementia care, or easing long-term caregiving pressure. Many share the same confusion: not knowing whom to ask, what resources exist, or how to arrange care in time.',
              ),
              p(
                'Personal AIO services are built on the All In One integrated care model — from needs assessment and care planning to resource connection and ongoing companionship — helping families find their own way to care with less trial and error.',
              ),
            ),
            items: [
              {
                title:
                  '“My father was just discharged. The hospital says he can go home, but I have no idea how to care for him.”',
              },
              {
                title:
                  '“Working while caring for my mother, I haven’t slept well for a long time. I don’t know how much longer I can hold on.”',
              },
            ],
          },
          {
            blockType: 'iconFeatures',
            variant: 'pillars',
            items: [
              {
                title: 'Discharge-to-home support',
                text: 'Bridging care arrangements after returning home',
              },
              {
                title: 'Long-term care planning',
                text: 'Discussing care directions based on needs',
              },
              {
                title: 'Medical & care resource integration',
                text: 'Connecting medical, LTC, and community systems',
              },
              {
                title: 'Cross-disciplinary teamwork',
                text: 'Integrating professional roles to respond to care needs',
              },
              { title: 'Ongoing follow-up', text: 'Accompanying families through care challenges' },
            ],
          },
          {
            blockType: 'twoColumn',
            enabled: false,
            direction: 'imageLeft',
            lead: 'Caught between work and caregiving,\ncompanies can be a source of support',
            eyebrow: 'Enterprise EAP Program',
            image: photos[6].id,
            title: 'Corporate EAP Program',
            richText: rtNodes(
              p(
                'Taiwan is now a super-aged society. Every day, employees quietly lose focus, take leave, or even resign to care for family. Growing care needs affect attendance and well-being, and bring new challenges to managers and teams.',
              ),
              p(
                'Through the corporate EAP program — from care-risk surveys and employee consultations to referral services — we help companies build care-friendly support, help employees find the right resources and solutions, and protect team stability while caring for staff.',
              ),
            ),
          },
          {
            blockType: 'stepsBlock',
            enabled: false,
            variant: 'cardRow',
            items: [
              {
                title: 'Step 1 Family-caregiving stress survey',
                text: 'Assess employees’ caregiving stress, work impact, and well-being',
              },
              {
                title: 'Step 2 Relief sessions for high-risk employees',
                text: 'Clarify challenges and needs, with timely support',
              },
              {
                title: 'Step 3 AIO assessment and case referral',
                text: 'Connect government LTC and cross-disciplinary resources for a sustainable care plan',
              },
            ],
          },
          { blockType: 'content', enabled: false, title: 'Case Stories' },
          {
            blockType: 'articleCards',
            enabled: false,
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: true,
          },
          {
            blockType: 'taCta',
            enabled: false,
            variant: 'photoBand',
            cards: [
              {
                title: 'Ask about family care services',
                buttonLabel: 'Ask about family care services',
                url: '/en/contact/#sheet',
                image: photos[7].id,
              },
            ],
          },
        ],
      },
    },
    {
      slug: 'training',
      zh: {
        title: '組織培力',
        metaTitle: 'AIO解決方案－組織培力',
        metaDescription:
          '從人才培育到在地共創，陪伴組織打造具影響力的照顧行動。六大培力模組，結合企業、基金會與地方組織，共同推動台灣照顧創新。',
        layout: [
          // Sheet training 01 Banner
          {
            blockType: 'pageHeader',
            title: 'AIO組織培力',
            eyebrow: 'AIO Solution-Organization Support',
            image: fig('training-banner.jpg').id,
            gradient: 'lime',
          },
          // Sheet training 02 Hero 引言
          {
            blockType: 'twoColumn',
            variant: 'hero',
            direction: 'imageLeft',
            image: photos[2].id,
            richText: rt('從人才培育到在地共創，陪伴組織打造具影響力的照顧行動。'),
          },
          // Sheet training 03 什麼是AIO？（同 care 03 全文）
          aioZh,
          // Sheet training 04 痛點介紹（Figma 306:609 放射 4 圓：左文右圖）
          {
            blockType: 'infographic',
            variant: 'radial',
            title: '想為組織/地方帶來更多照顧突破嗎？',
            body: '台灣邁入超高齡社會，照顧人力不足與偏鄉資源落差，深深影響著無數家庭。許多地方組織渴望回應挑戰，期盼培力具備人本思維的照服員、社工與主管；然而，如何起步、摸索合適的合作路徑，往往在第一步就讓人卡關。\n\n創照服務設計憑藉多年人才培育與地方陪伴經驗，協助組織從理念出發，發展出符合自身特性的照顧模式。我們陪您將改變的心願化為具體行動，穩紮穩打，累積翻轉在地的溫暖。',
            nodes: [
              { title: '專業培力不易', text: '缺乏系統化技術訓練' },
              { title: '找人留人不易', text: '升遷路徑單一 薪資無法突破' },
              { title: '服務模式受限', text: '現有思維 難以因應複雜需求' },
              { title: '外部支持有限', text: '因地域限制 難引進跨界資源' },
            ],
          },
          // Sheet training 04 核心價值（Figma impact 280:444：外框卡＋↓）
          {
            blockType: 'stepsBlock',
            variant: 'outline',
            eyebrow: 'Organizational Value',
            heading: '培力價值',
            title: '將專業帶回崗位，內化為單位的即戰力',
            body: '我們始終相信，最好的培訓，是把改變帶回日常中實踐。\n來到這裡的夥伴，不只帶走專業知識，更帶回能落地應用的實務能力。',
            footnote: '當學習落地為日常習慣，不只提升了照顧品質，更凝聚了團隊的默契。',
            items: [
              { title: '對第一線夥伴', text: '在面對個案的多元需求時，能更從容、更有彈性地應對。' },
              { title: '對負責人/管理者', text: '掌握良好的溝通要領，搭起團隊與員工之間的橋樑。' },
            ],
          },
          // Sheet training 05 合作模式（Figma support 288:390 米色帶 左文右圖）
          // D3：底部流程併入同一米色帶（itemsStyle steps），移除原獨立白底 stepsBlock
          {
            blockType: 'twoColumn',
            direction: 'imageRight',
            background: 'surface',
            eyebrow: 'Organization Support',
            image: photos[7].id,
            title: '打造適合組織的照顧發展路徑',
            richText: rtNodes(
              h3('結合地方組織、社區、企業，共同推動台灣照顧創新'),
              p(
                '每個組織在推動照顧的路上，出發點與面臨的挑戰都不盡相同：有人希望深耕人才、有人渴望走入社區，也有人正在思索服務的轉型與永續。正因創照理解這些難題，我們重視每個組織的獨特，將依現況與目標，攜手規劃最合適的合作方案。',
              ),
              p(
                '對企業組織而言：您參與的不只是一場培訓，而是一套能自主運轉的「人才循環」。被培育的夥伴回到組織後，能持續服務社區、陪伴家庭，進而吸引更多人投入照顧。',
              ),
            ),
            itemsStyle: 'steps',
            items: [{ title: '組織需求' }, { title: '客製培力方案' }, { title: '社會影響力' }],
          },
          // Sheet training 06 六大培力模組（Figma six model 288:393：置中標題＋3×2 圖卡格）
          {
            blockType: 'twoColumn',
            variant: 'centered',
            image: photos[1].id,
            title: '六大培力模組',
            lead: '根據組織的現況和需求，一起找到最適合的彈性模組。',
            itemsStyle: 'grid',
            items: [
              { image: fig('training-six-1.jpg').id, title: 'AIO演講', text: '建立專業照顧觀念與共同語言' },
              { image: fig('training-six-2.jpg').id, title: '參訪交流', text: '走進真實場域看見可能' },
              { image: fig('training-six-3.jpg').id, title: 'AIO之路討論', text: '對標組織面對的挑戰與願景' },
              { image: fig('training-six-4.jpg').id, title: '長照人才培育', text: '培訓/實習/研修，累積照顧真功夫' },
              { image: fig('training-six-5.jpg').id, title: 'AIO服務梯隊', text: '深入組織場域或社區實踐服務' },
              { image: fig('training-six-6.jpg').id, title: '組織轉型', text: '發展長期照顧策略與模式' },
            ],
          },
          // Sheet training 07 社會影響力（Figma Frame 174 288:658：\ 與我們一起行動 / 三實心圓）
          {
            blockType: 'missionCircles',
            enabled: false,
            variant: 'plain',
            title: '\\ 與我們一起行動 /',
            circles: [
              { label: '企業 ESG', description: '尋找有深度的社會影響力專案' },
              { label: '基金會與公部門', description: '培養在地照顧人才與社區力量' },
              { label: '社會使命 類型組織', description: '打造永續的台灣創新照顧模式' },
            ],
          },
          // Sheet training 08 真實案例（Figma：● Care Stories 眉標、置中）
          { blockType: 'content', enabled: false, eyebrow: 'Care Stories', title: '案例分享', align: 'center' },
          {
            blockType: 'articleCards',
            enabled: false,
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: true,
          },
          // Sheet training 09 CTA（指向 /contact 表單錨點 #sheet）
          {
            blockType: 'taCta',
            variant: 'photoBand',
            cards: [
              {
                title: '諮詢組織培力',
                buttonLabel: '諮詢組織培力',
                url: '/contact/#sheet',
                image: fig('about-cta.jpg').id,
              },
            ],
          },
        ],
      },
      en: {
        title: 'Organizational Training',
        layout: [
          {
            blockType: 'pageHeader',
            title: 'AIO Solutions — Organizational Training',
            image: fig('training-banner.jpg').id,
            gradient: 'lime',
          },
          {
            blockType: 'twoColumn',
            variant: 'hero',
            direction: 'imageLeft',
            image: photos[2].id,
            richText: rt(
              'From talent cultivation to local co-creation, we help organizations build impactful care initiatives.',
            ),
          },
          aioEn,
          {
            blockType: 'infographic',
            variant: 'radial',
            title: 'Wanting social impact, but not knowing where to start',
            body: 'Taiwan is now a super-aged society. Care workforce shortages, rural resource gaps, and aging challenges affect more and more communities and families. Many companies, foundations, and local organizations want to respond — but finding the right partnership model, cultivating local talent, and building long-term impact can make the first step hard.\n\nCare For Taiwan combines years of care practice, talent cultivation, and local companionship to help organizations start from their mission, develop training programs that fit their goals, and turn ideas into concrete action — steadily building the power of local change.',
            nodes: [
              {
                title: 'Hard to recruit and retain',
                text: 'A single promotion path; pay that cannot break through',
              },
              {
                title: 'Limited external support',
                text: 'Geography makes cross-sector resources hard to bring in',
              },
              {
                title: 'Hard to build capacity',
                text: 'Lacking systematic, hands-on skills training',
              },
              {
                title: 'Service models constrained',
                text: 'Existing mindsets struggle to meet complex needs',
              },
            ],
          },
          {
            blockType: 'stepsBlock',
            variant: 'outline',
            eyebrow: 'Organizational Value',
            heading: 'The value of capacity-building',
            title: 'Bringing expertise back to the workplace as ready capability',
            body: 'We have always believed the best training brings change into everyday practice.\nPartners who come here take away not just professional knowledge, but practical, applicable ability.',
            footnote:
              'When learning becomes a daily habit, it lifts not only care quality but also the team’s shared rapport.',
            items: [
              {
                title: 'For frontline partners',
                text: 'Responding to clients’ diverse needs with more ease and flexibility.',
              },
              {
                title: 'For owners/managers',
                text: 'Mastering communication to bridge the team and its members.',
              },
            ],
          },
          {
            blockType: 'twoColumn',
            direction: 'imageRight',
            background: 'surface',
            eyebrow: 'Organization Support',
            image: photos[7].id,
            title: 'A care development path that fits your organization',
            richText: rtNodes(
              h3('Companies, foundations, and local organizations driving care innovation together'),
              p(
                'Some want to cultivate talent, some to go deep into communities, others are rethinking service transformation and sustainability. Through flexible training modules, we co-design the partnership that fits each organization’s situation and goals.',
              ),
              p(
                'For companies, the support sustains a continuous talent-cultivation cycle — trained talent returns to serve communities, accompany families, and draw more people into care work.',
              ),
              p(
                'For local organizations, one fully trained caregiver may accompany a community for ten years or more. Talent growth and retention often bring further-reaching impact than one-off resources.',
              ),
            ),
            itemsStyle: 'steps',
            items: [
              { title: 'Organizational needs' },
              { title: 'Tailored training program' },
              { title: 'Social impact' },
            ],
          },
          {
            blockType: 'twoColumn',
            variant: 'centered',
            image: photos[1].id,
            title: 'Six training modules',
            lead: 'Based on your organization’s situation and needs, we find the right flexible modules together.',
            itemsStyle: 'grid',
            items: [
              {
                image: fig('training-six-1.jpg').id,
                title: 'AIO talks',
                text: 'Building shared professional care concepts and language',
              },
              {
                image: fig('training-six-2.jpg').id,
                title: 'Site visits',
                text: 'Seeing possibilities at Plahan and real care settings',
              },
              {
                image: fig('training-six-3.jpg').id,
                title: 'AIO roadmap sessions',
                text: 'Mapping organizational challenges and vision',
              },
              {
                image: fig('training-six-4.jpg').id,
                title: 'LTC talent cultivation',
                text: 'Training, internships, and field study',
              },
              {
                image: fig('training-six-5.jpg').id,
                title: 'AIO service teams',
                text: 'Serving deep in communities and rural areas',
              },
              {
                image: fig('training-six-6.jpg').id,
                title: 'Organizational transformation',
                text: 'Developing long-term care strategy and models',
              },
            ],
          },
          {
            blockType: 'missionCircles',
            enabled: false,
            variant: 'plain',
            title: '\\ Act with us /',
            circles: [
              { label: 'Corporate ESG', description: 'Seeking social-impact projects with depth' },
              {
                label: 'Foundations & public sector',
                description: 'Cultivating local care talent and community strength',
              },
              {
                label: 'Mission-driven organizations',
                description: 'Building sustainable care models',
              },
            ],
          },
          { blockType: 'content', enabled: false, title: 'Case Stories' },
          {
            blockType: 'articleCards',
            enabled: false,
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: true,
          },
          {
            blockType: 'taCta',
            variant: 'photoBand',
            cards: [
              {
                title: 'Ask about organizational training',
                buttonLabel: 'Ask about organizational training',
                url: '/en/contact/#sheet',
                image: fig('about-cta.jpg').id,
              },
            ],
          },
        ],
      },
    },
    {
      slug: 'school',
      zh: {
        title: '關於照顧學校',
        metaTitle: '關於照顧學校 ABOUT Care For Taiwan（CFT）',
        metaDescription:
          'Care For Taiwan（CFT）照顧學校：為台灣長照而教的人才培育基地。四大學習地圖：課程、實作、證照、職涯。',
        layout: [
          // Sheet school 01 Banner（Figma 共用 master Banner，團體照）
          {
            blockType: 'pageHeader',
            title: '關於照顧學校',
            eyebrow: 'ABOUT Care For Taiwan（CFT）',
            image: fig('school-banner.jpg').id,
          },
          // Sheet school 02 關於學校 (What)：左圖右文
          {
            blockType: 'content',
            eyebrow: 'About CFT',
            title: '關於照顧學校',
            richText: rtNodes(
              h3('為台灣長照而教的人才培育基地'),
              p(
                'Care For Taiwan（CFT）照顧學校，致力於培育照顧專業人才，落實社區/居家融合創新長照，推動 All In One（AIO）整合照顧模式。我們相信，好的照顧不只是完成服務，而是理解人的需求、看見生活的樣貌，並整合跨專業資源，陪伴每個人在熟悉的環境中持續生活。',
              ),
              p(
                '面對超高齡社會帶來的照顧需求，照顧學校發展各式長照課程，並透過四大學習地圖：涵括課程學習、實作服務、證照管理與職涯支持等多層次內容，讓學員不只是理解照顧，更能將所學轉化為實際能力。我們建立一套從入門到進階的人才培育系統，協助更多人投入照顧工作，也讓照顧成為一條能夠長期發展的專業道路。',
              ),
              p(
                '在這裡，學習從不侷限於教室，我們也透過開設「真功夫加強班」，帶領學員走進真實的服務現場；在與人的互動中，以及動手實踐與深刻反思，真正淬鍊出貼近照顧需求的扎實真功夫。',
              ),
            ),
            image: fig('school-about.jpg').id,
            imagePosition: 'left',
          },
          // Sheet school 03 我們看見的問題（C4：原環形圖改為單張照片，照片待提供）
          {
            blockType: 'infographic',
            variant: 'ring',
            eyebrow: 'Problematic',
            title: '我們看見的問題',
            body: '社會中的照顧需求日益攀升，我們也在照顧現場看見：\n1.職涯單一路徑：照顧工作常缺乏成長與發展機會，難以吸引人才長期投入。\n2.薪資與價值落差：照顧工作的重要性逐年提升，但專業價值仍未被充分看見。\n3.專業彼此分散：醫療、照護、社區與家庭之間缺乏整合，導致照顧者與家庭承擔更多壓力。\n因此，我們希望透過人才培育，建立以人為本的觀點思維，以及與時俱進的溝通能力。',
            photos: [{ image: fig('school-problem.jpg').id }],
          },
          // Sheet school 04 學員角色（Figma school TA 619:640：「學員樣貌」標題 + 4 portrait 置中卡）
          {
            blockType: 'iconFeatures',
            variant: 'roles',
            heading: '學員樣貌',
            items: [
              { title: '探索方向的長照新鮮人', text: '想了解照顧產業、尋找有意義的工作方向' },
              { title: '想突破現況的照顧工作者', text: '希望提升專業能力、擴展職涯可能性' },
              { title: '正照顧家人的家庭照顧者', text: '想獲得更好的照顧知識與支持系統' },
              { title: '關心高齡與照顧議題的你', text: '不論背景，都能從課程中理解以人為本的照顧精神' },
            ],
          },
          // Sheet school 05 培育系統 (How)：四柱高低卡（Figma class 304:605）
          {
            blockType: 'pillarCards',
            eyebrow: 'Learning Pathway',
            title: '人才培育系統',
            subtitle: '以AIO整合照顧模式為核心：四大學習地圖',
            intro:
              '照顧不只是學習一項技能，需要設身理解人的需求、累積現場經驗，並逐步發展成能獨立思考與整合資源的專業能力。因此，照顧學校以 AIO（All In One）整合照顧模式為核心，結合課程學習、實務參與、能力認證與職涯發展，建立一套循序漸進的人才培育系統。',
            cards: [
              { tag: '學習的內容', titleMain: '課程', titleSub: '地圖', text: '建立照顧知識與專業技術' },
              { tag: '練習的途徑', titleMain: '實作', titleSub: '地圖', text: '在真實場域累積照顧經驗' },
              { tag: '專業的認可', titleMain: '證照', titleSub: '地圖', text: '建立專業認證與學習履歷' },
              { tag: '未來的發展', titleMain: '職涯', titleSub: '地圖', text: '探索照顧工作的更多可能' },
            ],
          },
          // Sheet school 06 課程內容 tabs（Figma Frame 177 317:622）
          {
            blockType: 'tabsBlock',
            title: '從學習到實踐，打造完整的照顧人才路徑',
            intro:
              '無論是剛接觸長照領域的新鮮人、正在第一線服務的照顧工作者，\n或是希望提升照顧能力的家庭照顧者，\n都能依照自己的學習階段找到適合的成長路徑。',
            tabs: [
              {
                label: '課程地圖',
                pills: [
                  { text: 'AIO 課程' },
                  { text: '八大模組' },
                  { text: '真功夫加強班' },
                  { text: '共學活動' },
                ],
                heading: '課程地圖',
                subheading: '建立照顧知識與專業技術',
                body: '照顧能力的建立，來自系統化學習與持續累積。課程地圖整合 AIO 課程、真功夫加強班、身心靈年會串聯與協力實證研究，引導學員從照顧理念出發，逐步建立完整的專業基礎與實務能力。',
                image: fig('school-courses-hero.jpg').id,
                featuresLabel: '學習特色',
                features: [
                  {
                    title: 'AIO 課程',
                    text: '內含八大模組（人本照顧導論、舒適照顧真功夫、全方位療癒、高齡全人照顧、失智症全人照顧、身心障礙全人照顧、社區共生創新照顧、共學圈）及模組PLUS豐富主題，從不同面向建立照顧專業知識與跨領域視野。',
                  },
                  {
                    title: '真功夫加強班',
                    text: '讓課堂的「知識」落地為手邊的「技術」，並在反覆演練照顧動作的過程中，把技術昇華為內化的「能力」，在關鍵時刻真正派上用場。',
                  },
                  {
                    title: '身心靈年會串聯',
                    text: '不定期組團參與各式照顧議題之活動，例如：在宅醫療年會、蘇帆海洋基金會-不老水手...等，過程中會將大家的關係變更緊密，亦有機會促成各種發展。',
                  },
                  {
                    title: '協力實證研究',
                    text: '部分醫事人員有定期產出期刊之需求，若欲研究AIO整合照顧模式相關議題，我們將協力實證研究。',
                  },
                ],
              },
              {
                label: '實作地圖',
                heading: '實作地圖',
                subheading: '在真實場域累積照顧經驗',
                body: '「移地訓練」是照顧學校最珍貴且無可取代的特色。我們打破傳統課堂的邊界，擁有全臺灣最獨特且多元的實作場域，帶領學員走出教室、跨越地域。透過 AIO 服務梯隊、共生之家、日間照顧與國際研修，學員將走進生命現場，在實踐中逐步長出敏銳的照顧判斷與解決問題的跨界能力。',
                featuresLabel: '學習特色',
                features: [
                  {
                    title: 'AIO 服務梯隊｜走進偏鄉落實文化照顧',
                    text: '走進偏鄉部落與社區，在 AIO 照顧設計師與 AIO 教練帶領下，學員直接參與真實照顧。從零學習需求評估、陪伴與團隊協作，在最需要支持的地方，累積接地氣的第一線經驗。',
                  },
                  {
                    title: '共生之家｜打破制度高牆的在地實踐',
                    text: '深入社區，理解「共生」意涵，體會照顧與在地居民、社區生活的融合。學習陪伴長者在熟悉環境自在生活，練就因地制宜、靈活不設限的照顧思維。',
                  },
                  {
                    title: '日間照顧｜日常照顧的創新應用',
                    text: '進駐日間照顧中心，觀察並參與日常服務。從長者生活細節出發，理解尊嚴照顧、學習創新活動設計，看懂整體長照支持系統，建立對現場全面且立體的認識。',
                  },
                  {
                    title: '國際研修｜跨越國界的沉浸式體驗',
                    text: '飛越東海，深入日本標竿長照單位沉浸式實作，不只是參訪，更投注於深度在地文化與照顧哲學的體驗，在異國視野激盪下拓展思維，帶回臺灣創新落地的無限可能。',
                  },
                ],
              },
              {
                label: '證照地圖',
                heading: '證照地圖',
                subheading: '建立專業認證與學習履歷',
                body: '協助學員逐步取得核心資格，建立專業可信度。透過完善的證照制度與數位化系統，清晰記錄專業歷程，精準掌握學習進度與成長軌跡。',
                featuresLabel: '學習特色',
                features: [
                  {
                    title: 'AIO 照顧服務員證書',
                    text: '奠定扎實的第一線照顧基礎，掌握核心實務，落實以人為本的尊嚴照顧。',
                  },
                  {
                    title: 'AIO 照顧教練證書',
                    text: '具備實務指導與引領能力，在真實場域陪伴學員淬鍊技術，深化即戰力。',
                  },
                  {
                    title: 'AIO 照顧設計師證書',
                    text: '發揮核心設計思維，跨專業串連醫療與長照資源，量身打造最適切的照顧方案。',
                  },
                  {
                    title: 'AIO 在宅醫師證書',
                    text: '深耕在宅醫療與社區共生，結合在地資源，全面支持長者在熟悉處尊嚴安老。',
                  },
                ],
              },
              {
                label: '職涯地圖',
                heading: '職涯地圖',
                subheading: '探索照顧工作的更多可能',
                body: '串連職涯諮詢、就業媒合、專長培育與跨領域合作機會，協助學員找到適合自己的發展方向，讓學習不只帶來能力成長，也開啟更多人生選擇。',
              },
            ],
          },
          // Sheet school 07 學習成果 (Proof)：課程回顧（CMS 自動抓取最新三篇；專屬資料源待接，先以案例故事佔位）
          { blockType: 'content', enabled: false, eyebrow: 'Stories', title: '課程回顧' },
          {
            blockType: 'articleCards',
            enabled: false,
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: false,
          },
          // photowall（Figma 85:287）：羅布森空間之前的滿版 5 格照片橫帶
          {
            blockType: 'photoStrip',
            images: [
              { image: fig('school-wall-1.jpg').id },
              { image: fig('school-wall-2.jpg').id },
              { image: fig('school-wall-3.jpg').id },
              { image: fig('school-wall-4.jpg').id },
              { image: fig('school-wall-5.jpg').id },
            ],
          },
          // Sheet school 08 線下場域 (Proof)：羅布森空間＝在地地形圖＋pin（Figma Frame 179 341:639）
          {
            blockType: 'mapLocations',
            eyebrow: 'CFT Space',
            title: '羅布森空間',
            subtitle: '照顧學校的培訓場域',
            intro:
              '這裡曾是承諾「十年不關」的獨立書店，現由羅布森企業無償捐贈為大眾共有的公益基地。\n照顧學校接棒這份善意，將其轉化為一座打破傳統課堂框架、強調「生活感」的共學基地，讓學習自然融入日常。\n這個場域如何支持我們的夥伴深度共學：',
            sections: [
              {
                heading: '非典型課堂，開啟靈活思維',
                text: '空間完整保留了獨立書店特有的書香與對話氛圍，在自然環繞的放鬆環境中，學員能褪去生硬的教學框架，以更開闊、靈活的心態投入共學。',
              },
              {
                heading: '並肩同行，讓知識落地於日常',
                text: '場域內建檜木造的榻榻米、雅房與下廚設備。學員在這裡一起做飯、共餐、暢談、住宿，來自全台不同背景的照顧經驗，在生活感十足的互動中，自然內化為彼此的養分。',
              },
              {
                heading: '社區共生，最真實的照顧實踐',
                text: '空間對溪尾社區全面開放，在地的長輩與孩子能隨意進出走動。空間的多重用途，更是融入「共生」的信念，使得學員們能體會人與人之間最真實的連結與陪伴。',
              },
            ],
            closing: '我們深信，人與人的相遇、交流，本身就是照顧學習最核心的一部分。',
            storyUrl: 'https://www.lobsanglift.com/newsdetail_tw.php?id=9914',
            image: fig('school-location-bg.png').id,
            spaceImage: fig('school-robson-building.jpg').id,
            locations: [{ name: '臺中溪尾', nameEn: 'Taichung,Xiwei' }],
          },
          // Sheet school 09 CTA按鈕（照片帶＋兩顆 pill；按鈕2 課程表 URL 待客戶補，先連學習平台）
          {
            blockType: 'taCta',
            variant: 'darkBand',
            cards: [
              {
                title: '加入照顧學校',
                buttonLabel: '加入照顧學校',
                url: 'https://school.carefortaiwan.com.tw',
                image: fig('school-cta.jpg').id,
              },
              {
                title: '了解課程內容',
                buttonLabel: '了解課程內容',
                url: 'https://school.carefortaiwan.com.tw',
              },
            ],
          },
        ],
      },
      en: {
        title: 'About the Care School',
        layout: [
          {
            blockType: 'pageHeader',
            title: 'About the Care School',
            eyebrow: 'ABOUT Care For Taiwan (CFT)',
            image: fig('school-banner.jpg').id,
          },
          {
            blockType: 'content',
            eyebrow: 'About CFT',
            title: 'About the Care School',
            richText: rtNodes(
              h3('A talent-cultivation base teaching for Taiwan’s long-term care'),
              p(
                'The Care For Taiwan (CFT) Care School cultivates care professionals, delivers innovative community/home integrated long-term care, and advances the All In One (AIO) integrated care model. We believe good care is not just completing services — it is understanding people’s needs, seeing how they live, integrating cross-disciplinary resources, and accompanying everyone to keep living in familiar surroundings.',
              ),
              p(
                'Facing the care needs of a super-aged society, the Care School develops long-term care courses through four learning maps — courses, practice, certification, and career — so learners not only understand care but turn learning into real ability. We build a talent system from entry to advanced levels, helping more people join care work and making care a profession with long-term growth.',
              ),
              p(
                'Here, learning is never confined to the classroom. Through the monthly “Hands-on Intensive,” we lead learners into real service settings — in human connection, hands-on practice, and deep reflection, forging the solid, real skills that truly meet care needs.',
              ),
            ),
            image: fig('school-about.jpg').id,
            imagePosition: 'left',
          },
          {
            blockType: 'infographic',
            variant: 'ring',
            eyebrow: 'Problematic',
            title: 'The problems we see',
            body: 'As care needs keep rising, on the care front lines we see:\n1. A single career path: care work often lacks clear growth paths and development opportunities, making long-term commitment hard to attract.\n2. A pay-and-value gap: care work matters more every year, but its professional value is still not fully seen.\n3. Scattered professions: medical, care, community, and family lack integration; cross-disciplinary collaboration is hard to build and connect.\nThat is why we cultivate talent — to build person-centered thinking and communication skills that keep pace with the times.',
            photos: [{ image: fig('school-problem.jpg').id }],
          },
          {
            blockType: 'iconFeatures',
            variant: 'roles',
            heading: 'Student profiles',
            items: [
              { title: 'Newcomers exploring long-term care', text: 'Wanting to understand the care field and find meaningful work' },
              { title: 'Care workers seeking a breakthrough', text: 'Hoping to grow professionally and expand career possibilities' },
              { title: 'Family caregivers', text: 'Wanting better care knowledge and a support system' },
              { title: 'Anyone who cares about aging and care', text: 'Whatever your background, learn person-centered care in our courses' },
            ],
          },
          {
            blockType: 'pillarCards',
            eyebrow: 'Learning Pathway',
            title: 'Talent cultivation system',
            subtitle: 'Four learning maps with AIO at the core',
            intro:
              'Care is more than one skill — it takes understanding people’s needs, accumulating field experience, and growing into a professional who can think independently and integrate resources. The Care School builds a step-by-step talent system around the AIO person-centered care model, combining course learning, hands-on practice, certification, and career development.',
            cards: [
              {
                tag: 'What to learn',
                titleMain: 'Course',
                titleSub: 'Map',
                text: 'Building care knowledge and professional learning',
              },
              {
                tag: 'Where to practice',
                titleMain: 'Practice',
                titleSub: 'Map',
                text: 'Gaining care experience in real settings',
              },
              {
                tag: 'Professional recognition',
                titleMain: 'Certification',
                titleSub: 'Map',
                text: 'Building credentials and a learning record',
              },
              {
                tag: 'Future development',
                titleMain: 'Career',
                titleSub: 'Map',
                text: 'Exploring more possibilities in care work',
              },
            ],
          },
          {
            blockType: 'tabsBlock',
            title: 'From learning to practice: a complete path for care talent',
            intro:
              'Whether you are new to long-term care, serving on the front lines,\nor a family caregiver building care skills,\nyou can find a growth path that fits your learning stage.',
            tabs: [
              {
                label: 'Course Map',
                pills: [
                  { text: 'AIO courses' },
                  { text: 'Eight modules' },
                  { text: 'Hands-on intensives' },
                  { text: 'Co-learning activities' },
                ],
                heading: 'Course Map',
                subheading: 'Building care knowledge and professional learning',
                body: 'Care capability comes from systematic learning and steady accumulation. The course map integrates AIO courses, the eight modules, hands-on intensives, the co-learning circle, and the mind-body-spirit annual gathering — guiding learners from care philosophy outward to build a complete professional foundation and practical ability.',
                image: fig('school-courses-hero.jpg').id,
                featuresLabel: 'Learning features',
                features: [
                  {
                    title: 'AIO courses',
                    text: 'Centered on the All In One model — from person-centered care and whole-person support to community symbiosis — building complete care thinking and practice methods.',
                  },
                  {
                    title: 'Eight modules',
                    text: 'Spanning an introduction to person-centered care, comfort-care techniques, holistic healing, whole-person elder care, whole-person dementia care, whole-person disability care, innovative community-symbiosis care, the co-learning circle, and module PLUS topics — building professional knowledge and cross-disciplinary perspective from many angles.',
                  },
                  {
                    title: 'Hands-on intensives',
                    text: 'Turning classroom “knowledge” into hands-on “technique,” then — through repeated practice of care movements — refining technique into internalized “skill” that truly serves at the critical moment.',
                  },
                  {
                    title: 'Co-learning activities',
                    text: 'Course sharing, themed exchanges, book clubs, and cross-disciplinary discussion — a care community that supports each other and keeps growing.',
                  },
                ],
              },
              {
                label: 'Practice Map',
                heading: 'Practice Map',
                subheading: 'Gaining care experience in real settings',
                body: '“Field training” is the Care School’s most precious and irreplaceable feature. We break the boundaries of the traditional classroom, with the most unique and diverse hands-on settings in Taiwan, leading learners out of the classroom and across regions. Through AIO service teams, symbiosis homes, day care, and international study, learners step into the heart of life — growing keen care judgment and cross-boundary problem-solving through practice.',
                featuresLabel: 'Learning features',
                features: [
                  {
                    title: 'AIO service teams｜Cultural care in rural communities',
                    text: 'Entering rural tribes and communities, learners take part in real care under AIO care designers and coaches — learning needs assessment, companionship, and teamwork from the ground up, gaining down-to-earth front-line experience where support is needed most.',
                  },
                  {
                    title: 'Symbiosis homes｜Local practice beyond institutional walls',
                    text: 'Going deep into communities to understand what “symbiosis” means and how care blends with local residents and community life — learning to accompany elders living freely in familiar surroundings, and to think flexibly and adapt to each setting.',
                  },
                  {
                    title: 'Day care｜Innovation in everyday care',
                    text: 'Embedding in day-care centers to observe and join daily service. Starting from the details of elders’ lives, learners grasp dignified care, learn innovative activity design, and read the whole long-term care support system — building a full, three-dimensional understanding of the field.',
                  },
                  {
                    title: 'International study｜An immersive experience across borders',
                    text: 'Crossing the East Sea for immersive practice at Japan’s benchmark long-term care units — not just a visit, but a deep experience of local culture and care philosophy, broadening thinking through a foreign lens and bringing endless possibilities for innovation back to Taiwan.',
                  },
                ],
              },
              {
                label: 'Certification Map',
                heading: 'Certification Map',
                subheading: 'Building credentials and a learning record',
                body: 'We help learners earn core qualifications step by step and build professional credibility. Through a complete certification system and a digital platform, each learner’s professional journey is clearly recorded, with precise tracking of learning progress and growth.',
                featuresLabel: 'Learning features',
                features: [
                  {
                    title: 'AIO Care Worker Certificate',
                    text: 'Laying a solid front-line care foundation, mastering core practice, and delivering person-centered, dignified care.',
                  },
                  {
                    title: 'AIO Care Coach Certificate',
                    text: 'Equipped to guide and lead in practice — accompanying learners in real settings to refine technique and deepen battle-ready skills.',
                  },
                  {
                    title: 'AIO Care Designer Certificate',
                    text: 'Applying core design thinking to connect medical and long-term care resources across disciplines, tailoring the most fitting care plans.',
                  },
                  {
                    title: 'AIO Home Physician Certificate',
                    text: 'Deepening home medical care and community symbiosis, combining local resources to fully support elders ageing with dignity in familiar surroundings.',
                  },
                ],
              },
              {
                label: 'Career Map',
                heading: 'Career Map',
                subheading: 'Exploring more possibilities in care work',
                body: 'Connecting career consulting, job matching, specialty development, and cross-disciplinary collaboration — helping learners find their direction, so learning brings not only growth but more life choices.',
              },
            ],
          },
          { blockType: 'content', enabled: false, eyebrow: 'Stories', title: 'Course Stories' },
          {
            blockType: 'articleCards',
            enabled: false,
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: false,
          },
          {
            blockType: 'photoStrip',
            images: [
              { image: fig('school-wall-1.jpg').id },
              { image: fig('school-wall-2.jpg').id },
              { image: fig('school-wall-3.jpg').id },
              { image: fig('school-wall-4.jpg').id },
              { image: fig('school-wall-5.jpg').id },
            ],
          },
          {
            blockType: 'mapLocations',
            eyebrow: 'CFT Space',
            title: 'The Robinson Space',
            subtitle: 'The Care School’s training grounds',
            intro:
              'Once an independent bookstore that promised to “stay open for ten years,” this place was donated by the Robinson Group as a shared public space for all.\nThe Care School carries on that goodwill, turning it into a co-learning base that breaks the traditional classroom mold and emphasizes a sense of everyday life.\nHow this space supports our partners in deep co-learning:',
            sections: [
              {
                heading: 'An unconventional classroom for flexible thinking',
                text: 'The space keeps the reading and conversation atmosphere unique to an independent bookstore. In a relaxed, nature-surrounded setting, learners shed rigid teaching frameworks and engage with a more open, flexible mindset.',
              },
              {
                heading: 'Side by side, grounding knowledge in daily life',
                text: 'With cypress tatami rooms, private rooms, and cooking facilities, learners cook, dine, talk, and stay together here. Care experiences from across Taiwan become shared nourishment through life-filled interaction.',
              },
              {
                heading: 'Community symbiosis, the most authentic care practice',
                text: 'The space is fully open to the Xiwei community; local elders and children come and go freely. Its many uses embody the belief in “symbiosis,” letting learners feel the most genuine human connection and companionship.',
              },
            ],
            closing:
              'We believe that the encounters and exchanges between people are themselves the very heart of learning care.',
            storyUrl: 'https://www.lobsanglift.com/newsdetail_tw.php?id=9914',
            image: fig('school-location-bg.png').id,
            spaceImage: fig('school-robson-building.jpg').id,
            locations: [{ name: 'Taichung, Xiwei' }],
          },
          {
            blockType: 'taCta',
            variant: 'darkBand',
            cards: [
              {
                title: 'Join the Care School',
                buttonLabel: 'Join the Care School',
                url: 'https://school.carefortaiwan.com.tw',
                image: fig('school-cta.jpg').id,
              },
              {
                title: 'Explore the courses',
                buttonLabel: 'Explore the courses',
                url: 'https://school.carefortaiwan.com.tw',
              },
            ],
          },
        ],
      },
    },
    {
      slug: 'contact',
      zh: {
        title: '聯絡我們',
        metaTitle: '聯絡我們',
        metaDescription:
          '創照服務設計聯絡方式：049-2526-611，carefortaiwan2022@gmail.com，臺中市烏日區溪岸路8-3號。',
        layout: [
          // 聯絡表單＋聯絡資訊固定在 /contact route（不入 CMS，客戶定案）；
          // 此 CMS doc 只維護頁首 Banner（pageHeader block，客戶可在後台換圖）。
          {
            blockType: 'pageHeader',
            title: '聯絡我們',
            eyebrow: 'CONTACT',
            // Figma 聯絡我們頁首 banner（contact/banner.png＝羅布森建物外觀），非通用情境照 photos[6]
            image: fig('contact-banner.jpg').id,
          },
        ],
      },
      en: {
        title: 'Contact Us',
        layout: [
          {
            blockType: 'pageHeader',
            title: 'Contact Us',
            eyebrow: 'CONTACT',
            // Figma 聯絡我們頁首 banner（contact/banner.png＝羅布森建物外觀），非通用情境照 photos[6]
            image: fig('contact-banner.jpg').id,
          },
        ],
      },
    },
  ]

  for (const page of pagesData) {
    const doc = await payload.create({
      collection: 'pages',
      context: seedContext,
      locale: 'zh-TW',
      depth: 0,
      data: {
        title: page.zh.title,
        slug: page.slug,
        hero: heroNone,
        layout: page.zh.layout,
        meta: {
          title: page.zh.metaTitle,
          description: page.zh.metaDescription,
        },
        _status: 'published',
      },
    })
    await payload.update({
      collection: 'pages',
      id: doc.id,
      context: seedContext,
      locale: 'en',
      depth: 0,
      data: {
        title: page.en.title,
        hero: heroNone,
        layout: page.en.layout,
        _status: 'published',
      },
    })
  }

  // ---------------------------------------------------------------
  // 7. Navigation global（zh-TW → 讀回 row id → en label）
  // ---------------------------------------------------------------
  payload.logger.info('— Seeding navigation global...')

  await payload.updateGlobal({
    slug: 'navigation',
    context: seedContext,
    locale: 'zh-TW',
    data: {
      items: [
        { label: '認識創照', type: 'internal', url: '/about' },
        {
          label: '我們的服務',
          type: 'internal',
          url: '#',
          subItems: [
            { label: 'AIO整合照顧服務', type: 'internal', url: '/care' },
            { label: 'AIO組織培力', type: 'internal', url: '/training' },
          ],
        },
        { label: '聯絡我們', type: 'internal', url: '/contact' },
        {
          label: 'CFT照顧學校',
          type: 'internal',
          url: '#',
          highlight: true,
          subItems: [
            { label: '關於照顧學校', type: 'internal', url: '/school' },
            { label: '學習平台', type: 'external', url: 'https://school.carefortaiwan.com.tw' },
          ],
        },
      ],
    },
  })

  // label 是 array 內的 localized 欄位：en 版需帶相同 row id 才會對到同一列
  const navZh = await payload.findGlobal({ slug: 'navigation', locale: 'zh-TW', depth: 0 })
  const navLabelEn: Record<string, string> = {
    認識創照: 'About Us',
    我們的服務: 'Our Services',
    AIO整合照顧服務: 'AIO Integrated Care',
    AIO組織培力: 'AIO Organizational Training',
    聯絡我們: 'Contact Us',
    CFT照顧學校: 'CFT Care School',
    關於照顧學校: 'About the Care School',
    學習平台: 'Learning Platform',
  }

  await payload.updateGlobal({
    slug: 'navigation',
    context: seedContext,
    locale: 'en',
    data: {
      items: (navZh.items ?? []).map((item) => ({
        ...item,
        label: navLabelEn[item.label] ?? item.label,
        subItems: (item.subItems ?? []).map((sub) => ({
          ...sub,
          label: navLabelEn[sub.label] ?? sub.label,
        })),
      })),
    },
  })

  // ---------------------------------------------------------------
  // 8. SiteFooter global
  // ---------------------------------------------------------------
  payload.logger.info('— Seeding site footer global...')

  await payload.updateGlobal({
    slug: 'site-footer',
    context: seedContext,
    locale: 'zh-TW',
    data: {
      columns: [
        {
          title: '關於我們',
          links: [
            { label: '認識創照', url: '/about' },
            { label: 'AIO整合照顧模式', url: '/care' },
            { label: 'AIO組織培力', url: '/training' },
            { label: '關於照顧學校', url: '/school' },
            { label: '聯絡我們', url: '/contact' },
          ],
        },
        {
          title: '聯絡資訊',
          links: [
            { label: '049-2526-611', url: '/contact' },
            { label: 'carefortaiwan2022@gmail.com', url: '/contact' },
            { label: '臺中市烏日區溪岸路8-3號', url: '/contact' },
            { label: '官方 LINE：@564enhuc', url: 'https://lin.ee/xQ63Ufj' },
            { label: '官方 Facebook：CFT 照顧學校', url: 'https://www.facebook.com/p/CFT-照顧學校-61571463056013/' },
          ],
        },
      ],
      // 家族事業欄位刪除（Sheet「反紅部分刪除」+ Figma footer 僅兩欄）；保留欄位於 global config 供未來 CMS 再開
      familyVentures: [],
      socialLinks: [],
      copyright: `© ${new Date().getFullYear()} 創照服務設計股份有限公司 All rights reserved.`,
    },
  })

  const footerZh = await payload.findGlobal({ slug: 'site-footer', locale: 'zh-TW', depth: 0 })
  const footerLabelEn: Record<string, string> = {
    關於我們: 'About Us',
    聯絡資訊: 'Contact',
    認識創照: 'About Us',
    AIO整合照顧模式: 'AIO Integrated Care Model',
    AIO組織培力: 'AIO Organizational Training',
    關於照顧學校: 'About the Care School',
    聯絡我們: 'Contact Us',
    '臺中市烏日區溪岸路8-3號': 'No. 8-3, Xi’an Rd., Wuri Dist., Taichung City, Taiwan',
    '官方 LINE：@564enhuc': 'Official LINE: @564enhuc',
    '官方 Facebook：CFT 照顧學校': 'Official Facebook: CFT Care School',
    創照服務設計: 'Care For Taiwan',
    'CFT 照顧學校': 'CFT Care School',
    伯拉罕共生照顧勞動合作社: 'Plahan Co-op',
    鄰里123: 'Neighborhood 123',
  }

  await payload.updateGlobal({
    slug: 'site-footer',
    context: seedContext,
    locale: 'en',
    data: {
      columns: (footerZh.columns ?? []).map((column) => ({
        ...column,
        title: footerLabelEn[column.title] ?? column.title,
        links: (column.links ?? []).map((link) => ({
          ...link,
          label: footerLabelEn[link.label] ?? link.label,
        })),
      })),
      familyVentures: (footerZh.familyVentures ?? []).map((venture) => ({
        ...venture,
        name: footerLabelEn[venture.name] ?? venture.name,
      })),
      copyright: `© ${new Date().getFullYear()} Care For Taiwan Co., Ltd. All rights reserved.`,
    },
  })

  // ---------------------------------------------------------------
  // 9. 確保有可登入的管理員（僅在沒有任何使用者時建立）
  // ---------------------------------------------------------------
  const users = await payload.find({ collection: 'users', limit: 1, depth: 0 })
  if (users.totalDocs === 0) {
    payload.logger.info('— No users found, creating dev admin...')
    await payload.create({
      collection: 'users',
      context: seedContext,
      data: {
        name: 'Dev Admin',
        email: 'dev@carefortaiwan.com.tw',
        password: 'carefortaiwan-dev',
        role: 'admin',
      },
    })
  }

  payload.logger.info('Seeded database successfully!')
}
