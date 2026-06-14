import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const PHOTOS_DIR = path.resolve(dirname, '../../../content-assets/photos')

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

  const photos = []
  for (let i = 0; i < 8; i++) {
    const doc = await payload.create({
      collection: 'media',
      context: seedContext,
      data: { alt: photoAlts[i] },
      filePath: path.resolve(PHOTOS_DIR, `LINE_ALBUM_情境照_260610_${i + 1}.jpg`),
    })
    photos.push(doc)
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
        ...(index === 0 ? { photo: photos[2].id } : {}),
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

  // Sheet care/training 03「什麼是AIO？」共用全文
  const aioZh = {
    blockType: 'content',
    title: '什麼是 AIO解決方案？',
    richText: rtNodes(
      h3('一套以人為本的整合照顧模式'),
      p(
        'AIO是源自於創辦人（林依瑩）發展「All In One」的照護理念，認為好的照顧應該是依照個案的需求出發，透過整合醫療、照顧、社區與生活資源，串連不同階段所需的協助，建構人性化的長照、提供更多元且完整的照顧支持。',
      ),
    ),
    image: photos[1].id,
    imagePosition: 'right',
  }

  const aioEn = {
    blockType: 'content',
    title: 'What is the AIO Solution?',
    richText: rtNodes(
      h3('An integrated, person-centered care model'),
      p(
        'AIO comes from founder Lin Yi-ying’s “All In One” care philosophy: good care starts from each person’s needs, integrating medical, care, community, and daily-life resources to connect the support needed at every stage — building humane long-term care with more complete support.',
      ),
    ),
    image: photos[1].id,
    imagePosition: 'right',
  }

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
                image: photos[0].id,
                title: '讓需要照顧的人獲得更完整的支持，',
                subtitle: '讓投入照顧的人擁有更好的成長與發展。',
              },
              {
                image: photos[1].id,
                title: '創新照顧，開啟照顧無限可能。',
              },
              {
                image: photos[7].id,
                title: '在熟悉之處，尊嚴安老；',
                subtitle: '用創新照顧，支持生活的無限可能。',
              },
            ],
          },
          // Sheet 首頁 02 最新消息條：垂直輪播需多則才會動（範例文字照 Sheet）
          {
            blockType: 'newsTicker',
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
            eyebrow: 'About',
            title: '創新照顧，開啟照顧無限可能',
            ctaLabel: '認識創照',
            ctaUrl: '/about',
            richText: rt(
              '創照服務設計關注臺灣高齡化社會中的照顧需求，致力於人才培育、服務創新與跨領域合作，陪伴更多人找到適合自己的照顧支持。',
              '我們透過 All In One（AIO）整合照顧模式，串連醫療、長照、社福與社區資源，培育跨專業人才，推動以人為本的長照模式落地臺灣，也串起照顧現場的每個角色——讓需要照顧的人獲得支持，也讓投入照顧的人才被看見與培育。',
            ),
            image: photos[1].id,
            imagePosition: 'left',
          },
          // Sheet 首頁 04 三大服務（1-3）＝編號特色大區（01/02/03 交錯帶）
          {
            blockType: 'numberedFeatures',
            eyebrow: 'Service',
            items: [
              {
                number: '01',
                title: '人才培育創新',
                text: '面對長照人才職涯受限、薪資停滯與專業發展不足的現況，我們成立 Care for Taiwan（CFT）照顧學校，培育照顧服務員、照顧教練、照顧設計師及在宅醫師等跨專業人才，發展社區／居家融合照顧模式。',
                image: photos[2].id,
              },
              {
                number: '02',
                title: '整合服務創新',
                text: '照顧需求不只存在於醫院，也存在於返家後的每一天。面對住院返家後繁瑣的照顧安排與需求，我們透過跨專業團隊整合照顧資源，提供從醫療到居家的全方位支持，陪伴家庭度過照顧轉換期。',
                image: photos[3].id,
              },
              {
                number: '03',
                title: '照顧科技創新',
                text: '隨著照顧需求日益複雜，資訊與服務的協作效率也變得更加重要。我們將智齡科技結合 All In One（AIO）整合照顧模式，提升照顧協作與服務效率，打造出全新、以人為本的AI平台。',
                image: photos[5].id,
              },
            ],
          },
          // Sheet 首頁 05 案例輪播：創照分享（Figma 217:601：NEWS 眉標+標題置中，CMS 自動抓取最新三篇）
          { blockType: 'content', eyebrow: 'NEWS', title: '創照分享', align: 'center' },
          {
            blockType: 'articleCards',
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: false,
          },
          // Sheet 首頁 06 CTA按鈕 1-3（TA 導流三磚）
          {
            blockType: 'taCta',
            variant: 'tiles',
            cards: [
              {
                title: '我想成為照顧專業人才',
                buttonLabel: '探索照顧學校與課程學習',
                url: '/school',
              },
              {
                title: '我正在尋找照顧服務',
                buttonLabel: '了解 AIO 家庭照顧服務',
                url: '/care',
              },
              {
                title: '我希望提升組織照顧能力',
                buttonLabel: '洽詢組織培力與合作模式',
                url: '/training',
              },
            ],
          },
          // Sheet 首頁 07 氛圍收尾：品牌影片（Figma 82:233＝淺灰 #D9D9D9 placeholder＋中央播放鈕；
          // 影片網址與封面圖待客戶提供，先留 Figma 灰底佔位，不套深色照片以免播放鈕被吃掉）
          { blockType: 'videoBlock' },
        ],
      },
      en: {
        title: 'Home',
        layout: [
          {
            blockType: 'hero',
            images: [
              {
                image: photos[0].id,
                title: 'More complete support for those who need care,',
                subtitle: 'and better growth and development for those who give care.',
              },
              {
                image: photos[1].id,
                title: 'Innovating care, opening every possibility.',
              },
              {
                image: photos[7].id,
                title: 'Ageing with dignity in familiar surroundings,',
                subtitle: 'supported by innovative care.',
              },
            ],
          },
          {
            blockType: 'newsTicker',
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
            eyebrow: 'About',
            title: 'Innovating care, opening every possibility',
            ctaLabel: 'About us',
            ctaUrl: '/en/about',
            richText: rt(
              'Care For Taiwan focuses on the care needs of Taiwan’s aging society, committed to talent cultivation, service innovation, and cross-disciplinary collaboration — helping more people find the care support that fits them.',
              'Through the All In One (AIO) integrated care model, we connect medical, long-term care, social welfare, and community resources, cultivate cross-disciplinary talent, and bring person-centered long-term care to Taiwan — supporting those who need care, and recognizing and cultivating those who give it.',
            ),
            image: photos[1].id,
            imagePosition: 'left',
          },
          {
            blockType: 'numberedFeatures',
            eyebrow: 'Service',
            items: [
              {
                number: '01',
                title: 'Talent cultivation innovation',
                text: 'Facing limited career paths, stagnant pay, and insufficient professional development in long-term care, we founded the Care for Taiwan (CFT) Care School — cultivating care workers, care coaches, care designers, and home physicians, and developing community/home integrated care models.',
                image: photos[2].id,
              },
              {
                number: '02',
                title: 'Integrated service innovation',
                text: 'Care needs exist not only in hospitals but in every day after returning home. We integrate care resources through cross-disciplinary teams, providing full support from medical care to home life, accompanying families through care transitions.',
                image: photos[3].id,
              },
              {
                number: '03',
                title: 'Care technology innovation',
                text: 'As care needs grow more complex, efficient collaboration matters more than ever. We combine Jubo technology with the All In One (AIO) integrated care model to improve care collaboration and service efficiency — building a new, person-centered AI platform.',
                image: photos[5].id,
              },
            ],
          },
          { blockType: 'content', eyebrow: 'NEWS', title: 'Stories', align: 'center' },
          {
            blockType: 'articleCards',
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
                title: 'I am looking for care services',
                buttonLabel: 'Learn about AIO family care services',
                url: '/en/care',
              },
              {
                title: 'I want to strengthen my organization’s care capacity',
                buttonLabel: 'Ask about organizational training',
                url: '/en/training',
              },
            ],
          },
          { blockType: 'videoBlock' },
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
            image: photos[4].id,
          },
          // Sheet about 02 品牌故事(Why)：緣起
          {
            blockType: 'content',
            eyebrow: 'Beginning',
            title: '緣起',
            richText: rtNodes(
              h3('從照顧一個人，到改變一個照顧系統'),
              p(
                '台灣邁入超高齡社會，照顧需求持續增加。然而許多家庭在面對長照時，仍常陷入資源分散、資訊複雜、人才不足的困境。',
              ),
              p(
                '多年來，創照團隊深入社區、家庭與照顧現場，看見照顧除了服務、制度的提供之外，更是一段需要陪伴、理解與整合的過程。',
              ),
              p(
                '因此，我們開始思考：如果照顧從「跨專業整合、以人為本、扎根在地」的核心出發，會是什麼模樣？',
              ),
              p(
                '帶著這個問題，我們持續發展 All In One（AIO）照顧模式，串連跨專業團隊、社區資源與照顧人才，讓照顧成為一套能陪伴家庭走過不同階段的支持系統。',
              ),
              p(
                '我們透過人才培育、整合服務與創新實踐，讓照顧成為被尊重且能持續發展的專業力量，並建立一個以人為本的照顧生態系。',
              ),
            ),
            image: photos[6].id,
            imagePosition: 'right',
          },
          // Sheet about 03 品牌願景(Vision)：宣言帶（滿版照片底＋白字標語＋三圓）
          {
            blockType: 'missionCircles',
            variant: 'band',
            slogan: '讓需要照顧的人獲得更完整的支持，\n讓投入照顧的人擁有更好的成長與發展。',
            backgroundImage: photos[7].id,
            circles: [
              { label: '培育照顧的人' },
              { label: '支持照顧的路' },
              { label: '創造照顧的未來' },
            ],
          },
          // Sheet about 04 影響力：Sheet 空白——數字為佔位，待客戶補
          {
            blockType: 'statsCards',
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
                image: photos[3].id,
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
            image: photos[4].id,
          },
          {
            blockType: 'content',
            eyebrow: 'Beginning',
            title: 'Our Story',
            richText: rtNodes(
              h3('From caring for one person to changing a care system'),
              p(
                'Taiwan has entered a super-aged society, and care needs keep growing. Yet many families facing long-term care are still caught in scattered resources, complex information, and a shortage of care talent.',
              ),
              p(
                'For years, the Care For Taiwan team has worked deep in communities, families, and the front lines of care — seeing that care is not only services and systems, but a journey that needs companionship, understanding, and integration.',
              ),
              p(
                'So we began to ask: what would care look like if it started from cross-disciplinary integration, person-centered values, and local roots?',
              ),
              p(
                'With that question, we keep developing the All In One (AIO) care model — connecting cross-disciplinary teams, community resources, and care talent, so care becomes a support system that walks with families through every stage.',
              ),
              p(
                'Through talent cultivation, integrated services, and innovative practice, we make care a respected and sustainable profession — and build a person-centered care ecosystem.',
              ),
            ),
            image: photos[6].id,
            imagePosition: 'right',
          },
          {
            blockType: 'missionCircles',
            variant: 'band',
            slogan:
              'More complete support for those who need care,\nand better growth and development for those who give care.',
            backgroundImage: photos[7].id,
            circles: [
              { label: 'Cultivating the people of care' },
              { label: 'Supporting the journey of care' },
              { label: 'Creating the future of care' },
            ],
          },
          {
            blockType: 'statsCards',
            cards: [
              { number: '500', suffix: '+', label: 'Care School learners' },
              { number: '15', suffix: '+', label: 'partner organizations' },
              { number: '10', suffix: 'yrs+', label: 'of care innovation' },
              { number: '8', suffix: '+', label: 'communities engaged' },
            ],
          },
          {
            blockType: 'timeline',
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
                image: photos[3].id,
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
        metaTitle: 'AIO解決方案－家庭照顧服務',
        metaDescription:
          '從需求評估、整合照護到返家支持，我們陪伴每個家庭走向穩定的長照生活。AIO 整合照顧模式：企業 EAP 方案與個人 AIO 服務。',
        layout: [
          // Sheet care 01 Banner（Figma 共用 master Banner）
          {
            blockType: 'pageHeader',
            title: 'AIO解決方案－家庭照顧服務',
            eyebrow: 'Family Care Services',
            image: photos[5].id,
          },
          // Sheet care 02 Hero 引言（Figma hero 大圖+引言卡）
          {
            blockType: 'twoColumn',
            variant: 'hero',
            direction: 'imageLeft',
            image: photos[3].id,
            richText: rt('從需求評估、整合照護到返家支持，我們陪伴每個家庭走向穩定的長照生活。'),
          },
          // Sheet care 03 什麼是AIO？
          aioZh,
          // Sheet care 04 痛點介紹（Figma 306:606 Venn＋衛星數據圓）
          {
            blockType: 'infographic',
            variant: 'venn',
            leftLabel: '個人生活影響',
            rightLabel: '職場角色影響',
            leftStats: [
              { value: '8+年', label: '平均照顧' },
              { value: '6成', label: '照顧者出現身心耗損' },
              { value: '前6個月', label: '最混亂也最無助' },
            ],
            rightStats: [
              { value: '13.3萬', label: '每年因照顧離職人數' },
              { value: '45歲', label: '離職高峰主力' },
              { value: '5倍', label: '消失一人約損失年薪' },
            ],
          },
          // Sheet care 04 服務內容（Figma 257:387 左文右圖）
          {
            blockType: 'twoColumn',
            direction: 'imageRight',
            eyebrow: 'Family Care Services',
            image: photos[0].id,
            // Figma care 257:386：右側 pic1+pic2 對角錯位斜疊
            images: [{ image: photos[0].id }, { image: photos[1].id }],
            title: '家庭照顧服務如何運作',
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
            variant: 'cards',
            items: [
              { title: '需求評估', text: '梳理照顧困境' },
              { title: '設計規劃', text: '照顧策略與規劃' },
              { title: '串連資源', text: '醫療、照顧與社區資源' },
              { title: '持續陪伴', text: '建立友善照顧支持機制' },
            ],
          },
          // Sheet care 05 導流（Figma ta 米色帶 95:509 + 雙連結卡 269:650；錨點到 06/07）
          {
            blockType: 'taCta',
            variant: 'photoCards',
            intro:
              '我們提供兩種切入方式。\n企業可以透過 EAP 方案系統性支持員工；\n一般個人也可以直接預約諮詢，快速得到照顧規劃的協助。',
            cards: [
              { title: '我是企業HR或主管', image: photos[6].id, url: '#企業EAP方案' },
              { title: '我是一般照顧者或家屬', image: photos[3].id, url: '#個人AIO服務' },
            ],
          },
          // Sheet care 06 企業EAP方案（Figma 269:655：跨欄 slogan＋左圖右文）
          {
            blockType: 'twoColumn',
            direction: 'imageLeft',
            lead: '工作與照顧角色之間的拉扯，\n企業也能成為支持的力量',
            eyebrow: 'Enterprise EAP Program',
            image: photos[6].id,
            title: '企業EAP方案',
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
            variant: 'cardRow',
            items: [
              {
                title: 'Step 1 員工家庭照顧壓力指數調查',
                text: '評估員工的照顧壓力、工作影響與身心狀態',
              },
              {
                title: 'Step 2 高風險員工舒壓相談會',
                text: '陪伴員工釐清困境與精準需求，提供即時支持',
              },
              {
                title: 'Step 3 AIO 評估與個案轉介',
                text: '連結政府長照與跨專業資源，制定可持續照顧計畫，降低員工照顧壓力',
              },
            ],
          },
          // Figma photowall 263:431：全寬 5 圖橫向視差帶（EAP 與個人 AIO 之間）
          {
            blockType: 'photoStrip',
            parallax: true,
            images: [
              { image: photos[0].id },
              { image: photos[1].id },
              { image: photos[2].id },
              { image: photos[3].id },
              { image: photos[4].id },
            ],
          },
          // Sheet care 07 個人AIO服務（Figma 263:442 米色帶：左文＋右 slogan＋綠引言卡）
          {
            blockType: 'twoColumn',
            variant: 'quotes',
            direction: 'imageRight',
            background: 'surface',
            eyebrow: 'Personal AIO Service',
            lead: '照顧需求出現時，\n我們不需要單打獨鬥',
            image: photos[3].id,
            title: '個人AIO服務',
            richText: rtNodes(
              p(
                '每個家庭面對的照顧情境都不同，有人正在準備出院返家，有人面臨失智照顧挑戰，也有人希望減輕長期照顧帶來的壓力。許多家庭都曾經歷相同的困惑：不知道該找誰協助、不確定有哪些資源可以運用，也難以在短時間內做出適合的照顧安排。',
              ),
              p(
                '個人 AIO 服務以 AIO（All In One）整合照顧模式為核心，從需求評估、照顧規劃到資源串連與持續陪伴，協助家庭找到適合自己的照顧方式，減少獨自摸索的負擔。',
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
              { title: '持續追蹤陪伴', text: '陪伴家屬面對照顧歷程中的挑戰' },
            ],
          },
          // Sheet care 07 真實案例
          { blockType: 'content', title: '案例分享' },
          { blockType: 'articleCards', source: 'case-stories', batchSize: 3, enableLoadMore: true },
          // Sheet care 08 CTA（Figma 97:559 照片帶＋置中 pill 按鈕）
          {
            blockType: 'taCta',
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
            image: photos[5].id,
          },
          {
            blockType: 'twoColumn',
            variant: 'hero',
            direction: 'imageLeft',
            image: photos[3].id,
            richText: rt(
              'From needs assessment and integrated care to homecoming support, we walk with every family toward a stable long-term care life.',
            ),
          },
          aioEn,
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
            image: photos[0].id,
            images: [{ image: photos[0].id }, { image: photos[1].id }],
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
              'There are two ways in.\nCompanies can support employees systematically through our EAP program;\nindividuals can book a consultation directly for quick care-planning help.',
            cards: [
              {
                title: 'I am an HR manager or supervisor',
                image: photos[6].id,
                url: '#Corporate-EAP-Program',
              },
              {
                title: 'I am a caregiver or family member',
                image: photos[3].id,
                url: '#Personal-AIO-Services',
              },
            ],
          },
          {
            blockType: 'twoColumn',
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
          // Figma photowall 263:431：full-width 5-image horizontal parallax band
          {
            blockType: 'photoStrip',
            parallax: true,
            images: [
              { image: photos[0].id },
              { image: photos[1].id },
              { image: photos[2].id },
              { image: photos[3].id },
              { image: photos[4].id },
            ],
          },
          {
            blockType: 'twoColumn',
            variant: 'quotes',
            direction: 'imageRight',
            background: 'surface',
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
          { blockType: 'content', title: 'Case Stories' },
          { blockType: 'articleCards', source: 'case-stories', batchSize: 3, enableLoadMore: true },
          {
            blockType: 'taCta',
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
            title: 'AIO解決方案－組織培力',
            eyebrow: 'AIO Solutions-Organization Support',
            image: photos[4].id,
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
            title: '想投入社會影響力，卻不知道從哪裡開始',
            body: '台灣已進入超高齡社會，照顧人力不足、偏鄉資源落差與高齡化挑戰，也正在影響越來越多社區與家庭。許多企業、基金會與地方組織，希望回應這些社會議題，為地方帶來改變，但光是找到合適的合作模式、培育在地人才，並建立長期影響力，就不知道如何踏出第一步。\n\n創照服務設計結合多年照顧實務、人才培育與地方陪伴經驗，協助組織從理念出發，發展符合自身目標的培力方案，將想法轉化為具體行動，逐步累積在地改變的力量。',
            nodes: [
              { title: '高齡化需求增加', text: '台灣超高齡化社會來臨' },
              { title: '照顧人才不足', text: '在地自主照顧能量缺乏' },
              { title: '偏鄉資源落差', text: '服務取得與支持有限' },
              { title: '在地培力不易', text: '人才培育與留任困難' },
            ],
          },
          // Sheet training 04 核心價值（Figma impact 280:444：外框卡＋↓）
          {
            blockType: 'stepsBlock',
            variant: 'outline',
            items: [
              { title: '培養願意留在地方的人才', text: '累積自主照顧能量' },
              { title: '乘數效應', text: '讓被培育的人繼續培育下一個人' },
              { title: '影響力循環', text: '同時創造地方改變與組織價值' },
            ],
          },
          // Sheet training 05 合作模式（Figma support 288:390 米色帶 左文右圖）
          {
            blockType: 'twoColumn',
            direction: 'imageRight',
            background: 'surface',
            eyebrow: 'Organization Support',
            image: photos[7].id,
            title: '打造適合組織的照顧發展路徑',
            richText: rtNodes(
              h3('結合企業、基金會與地方組織，共同推動台灣照顧創新'),
              p(
                '有些希望培育人才，有些希望深入社區，有些則正在思考服務轉型與永續發展。 創照透過彈性的培力模組，依據組織現況與目標，共同設計最適合的合作方式。',
              ),
              p(
                '對企業而言，支持的是一套能持續運轉的人才培育循環，被培育的人才回到地方後，能持續服務社區、陪伴家庭，並帶動更多人投入照顧工作。',
              ),
              p(
                '對地方組織而言，一位受過完整訓練的照顧者，可能陪伴一個社區十年，甚至更久。人才的成長與留存，往往比一次性的資源投入更能帶來長遠的影響。',
              ),
            ),
          },
          // Figma support 底部流程：組織需求 → 客製培力方案 → 社會影響力
          {
            blockType: 'stepsBlock',
            variant: 'inline',
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
              { image: photos[2].id, title: 'AIO演講', text: '建立照顧觀念與共同語言' },
              { image: photos[4].id, title: '參訪交流', text: '走進伯拉罕與真實場域看見可能' },
              { image: photos[6].id, title: 'AIO之路討論', text: '對標組織面對的挑戰與願景' },
              { image: photos[3].id, title: '長照人才培育', text: '培訓/實習/研修，累積照顧真功夫' },
              { image: photos[0].id, title: 'AIO服務梯隊', text: '深入社區與偏鄉實踐服務' },
              { image: photos[5].id, title: '組織轉型', text: '發展長期照顧策略與模式' },
            ],
          },
          // Sheet training 07 社會影響力（Figma Frame 174 288:658：\ 與我們一起行動 / 三實心圓）
          {
            blockType: 'missionCircles',
            variant: 'plain',
            title: '\\ 與我們一起行動 /',
            circles: [
              { label: '企業 ESG', description: '尋找有深度的社會影響力專案' },
              { label: '基金會與公部門', description: '培養在地照顧人才與社區力量' },
              { label: '社會使命型組織', description: '打造可持續的照顧模式' },
            ],
          },
          // Sheet training 08 真實案例（Figma：● Care Stories 眉標、置中）
          { blockType: 'content', eyebrow: 'Care Stories', title: '案例分享', align: 'center' },
          { blockType: 'articleCards', source: 'case-stories', batchSize: 3, enableLoadMore: true },
          // Sheet training 09 CTA（指向 /contact 表單錨點 #sheet）
          {
            blockType: 'taCta',
            variant: 'photoBand',
            cards: [
              {
                title: '諮詢組織培力',
                buttonLabel: '諮詢組織培力',
                url: '/contact/#sheet',
                image: photos[4].id,
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
            image: photos[4].id,
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
              { title: 'Growing aging needs', text: 'Taiwan’s super-aged society has arrived' },
              { title: 'Care talent shortage', text: 'Local care capacity is lacking' },
              { title: 'Rural resource gaps', text: 'Limited access to services and support' },
              {
                title: 'Hard-won local capacity',
                text: 'Cultivating and retaining talent is difficult',
              },
            ],
          },
          {
            blockType: 'stepsBlock',
            variant: 'outline',
            items: [
              {
                title: 'Cultivate talent willing to stay local',
                text: 'building self-sustaining care capacity',
              },
              {
                title: 'A multiplier effect',
                text: 'those trained go on to train the next person',
              },
              {
                title: 'An impact cycle',
                text: 'creating local change and organizational value at once',
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
          },
          {
            blockType: 'stepsBlock',
            variant: 'inline',
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
                image: photos[2].id,
                title: 'AIO talks',
                text: 'Building shared care concepts and language',
              },
              {
                image: photos[4].id,
                title: 'Site visits',
                text: 'Seeing possibilities at Plahan and real care settings',
              },
              {
                image: photos[6].id,
                title: 'AIO roadmap sessions',
                text: 'Mapping organizational challenges and vision',
              },
              {
                image: photos[3].id,
                title: 'LTC talent cultivation',
                text: 'Training, internships, and field study',
              },
              {
                image: photos[0].id,
                title: 'AIO service teams',
                text: 'Serving deep in communities and rural areas',
              },
              {
                image: photos[5].id,
                title: 'Organizational transformation',
                text: 'Developing long-term care strategy and models',
              },
            ],
          },
          {
            blockType: 'missionCircles',
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
          { blockType: 'content', title: 'Case Stories' },
          { blockType: 'articleCards', source: 'case-stories', batchSize: 3, enableLoadMore: true },
          {
            blockType: 'taCta',
            variant: 'photoBand',
            cards: [
              {
                title: 'Ask about organizational training',
                buttonLabel: 'Ask about organizational training',
                url: '/en/contact/#sheet',
                image: photos[4].id,
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
            image: photos[2].id,
          },
          // Sheet school 02 關於學校 (What)：左圖右文
          {
            blockType: 'content',
            eyebrow: 'About CFT',
            title: '關於照顧學校',
            richText: rtNodes(
              h3('為台灣長照而教的人才培育基地'),
              p(
                'Care For Taiwan（CFT）照顧學校，致力於培育照顧專業人士，創造社區/居家融合創新長照，推動 All In One（AIO）整合照顧模式。我們相信，好的照顧不只是完成服務，而是理解人的需求、看見生活的樣貌，並整合跨專業資源，陪伴每個人在熟悉的環境中持續生活。',
              ),
              p(
                '面對高齡化社會帶來的照顧需求，學校發展各式長照課程，並透過四大學習地圖：涵括課程學習、實作服務、證照管理與職涯支持等多層次內容，讓學員不只是理解照顧，更能將所學轉化為實際能力。我們建立一套從入門到進階的人才培育系統，協助更多人投入照顧工作，也讓照顧成為一條能夠長期發展的專業道路。',
              ),
              p(
                '在這裡，學習不只發生在教室，而是在真實的服務現場、人與人的互動之間，以及每一次實踐與反思的過程中。',
              ),
            ),
            image: photos[2].id,
            imagePosition: 'left',
          },
          // Sheet school 03 為何成立 (Why)：滿版米色帶＋環形圖（Figma problem-bg 55:249）
          {
            blockType: 'infographic',
            variant: 'ring',
            eyebrow: 'Problematic',
            title: '我們看見的問題',
            body: '社會中的照顧需求快速增加，我們也在現場看見：\n1.職涯單一路徑：照顧工作常缺乏清晰的成長路徑與發展機會，難以吸引人才長期投入。\n2.薪資與價值落差：照顧工作的重要性逐年提升，但專業價值仍未被充分看見。\n3.專業彼此分散：醫療、照護、社區與家庭之間缺乏整合，跨領域合作不容易建立與串連。\n因此，我們希望透過人才培育，建立新的照顧能力與照顧語言。',
            photos: [
              { image: photos[0].id },
              { image: photos[2].id },
              { image: photos[4].id },
              { image: photos[6].id },
            ],
          },
          /*
           * Sheet school 04 TA（適合對象）——Figma 定稿無此獨立區塊（Sheet 備註「可與痛點合併」），
           * 文字先留存於此，待客戶確認版面後再上：
           * －探索方向的長照新鮮人：想了解照顧產業、尋找有意義的工作方向。
           * －想突破現況的照顧工作者：希望提升專業能力、擴展職涯可能性。
           * －正照顧家人的家庭照顧者：想獲得更好的照顧知識與支持系統。
           * －關心高齡與照顧議題的你：不論背景，都能從課程中理解以人為本的照顧精神。
           */
          // Sheet school 05 培育系統 (How)：四柱高低卡（Figma class 304:605）
          {
            blockType: 'pillarCards',
            eyebrow: 'Learning Pathway',
            title: '人才培育系統',
            subtitle: '以AIO為核心的：四大學習地圖',
            intro:
              '照顧不只是學習一項技能，需要設身理解人的需求、累積現場經驗，並逐步發展成能獨立思考與整合資源的專業能力。因此，照顧學校以 AIO（All In One）以人為本照顧模式為核心，結合課程學習、實務參與、能力認證與職涯發展，建立一套循序漸進的人才培育系統。',
            cards: [
              { tag: '學習的內容', titleMain: '課程', titleSub: '地圖', text: '建立照顧知識與專業學習' },
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
                subheading: '建立照顧知識與專業學習',
                body: '照顧能力的建立，來自系統化學習與持續累積。 課程地圖整合 AIO 課程、八大模組、真功夫加強班、共學活動與研究實踐，協助學員從照顧理念出發，逐步建立完整的專業基礎與實務能力。',
                featuresLabel: '學習特色',
                features: [
                  {
                    title: 'AIO 課程',
                    text: '以 All In One（AIO）整合照顧模式為核心，從人本照顧、全人支持到社區共生，為學員建立完整的照顧思維與實踐方法。',
                  },
                  {
                    title: '八大模組',
                    text: '涵蓋人本照顧、舒適照顧、高齡照顧、失智症照顧、身心障礙支持、全方位療癒、...等主題，從不同面向建立照顧專業知識與跨領域視野。',
                  },
                  {
                    title: '真功夫加強班',
                    text: '把照顧技能練成真正帶得走的能力。學員將反覆練習照護動作，讓照顧「真功夫」能在需要時真正派上用場。',
                  },
                  {
                    title: '共學活動',
                    text: '透過課程分享、主題交流、讀書會與跨領域討論，讓學員在學習過程中彼此支持、交換經驗，形成持續成長的照顧社群。',
                  },
                ],
              },
              {
                label: '實作地圖',
                heading: '實作地圖',
                subheading: '在真實場域累積照顧經驗',
                body: '實作地圖透過 AIO 服務梯隊、共生之家、日間照顧與國際研修等多元場域，讓學員走出教室，進入真實服務現場，逐步建立自己的照顧判斷與服務能力。',
                featuresLabel: '學習特色',
                features: [
                  {
                    title: 'AIO 服務梯隊',
                    text: '實際進入社區與家庭服務現場，學習需求評估、陪伴照顧、團隊合作與問題解決，學員在帶領下參與真實服務過程，累積第一線經驗。',
                  },
                  {
                    title: '共生之家',
                    text: '走進不同地區的共生照顧據點，理解照顧如何與社區結合，透過參訪與交流，學習在地照顧模式與社區共生實踐。',
                  },
                  {
                    title: '日間照顧',
                    text: '進入日照中心與照顧場域觀察服務流程，理解長者生活需求、活動設計與照顧支持系統，建立對長照現場的整體認識。',
                  },
                  {
                    title: '國際研修',
                    text: '與日本長照機構及合作單位交流學習，了解不同國家的照顧模式與創新實踐，拓展照顧視野並帶回在地應用的可能性。',
                  },
                ],
              },
              {
                label: '證照地圖',
                heading: '證照地圖',
                subheading: '建立專業認證與學習履歷',
                body: '從照顧服務員、特殊照護訓練到進階專業課程，協助學員逐步取得所需資格與能力認證，建立專業可信度；照顧學校也透過證照制度與數位化管理系統，協助學員累積專業歷程，掌握自己的學習進度與成長軌跡。',
                featuresLabel: '學習特色',
                features: [
                  {
                    title: '數位化學習履歷',
                    text: '透過照顧學校學習平台，整合課程紀錄、證照成果、學習檔案與能力發展軌跡，建立專屬於自己的照顧人才履歷。',
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
          { blockType: 'content', eyebrow: 'Stories', title: '課程回顧' },
          {
            blockType: 'articleCards',
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: false,
          },
          // photowall（Figma 85:287）：課程回顧與羅布森空間之間的滿版 5 格照片橫帶
          {
            blockType: 'photoStrip',
            images: [
              { image: photos[0].id },
              { image: photos[1].id },
              { image: photos[3].id },
              { image: photos[5].id },
              { image: photos[6].id },
            ],
          },
          // Sheet school 08 線下場域 (Proof)：羅布森空間＝在地地形圖＋pin（Figma Frame 179 341:639）
          {
            blockType: 'mapLocations',
            eyebrow: 'CFT Space',
            title: '羅布森空間',
            subtitle: '照顧學校的培訓場域',
            body: '照顧學校場域座落於台中溪尾，由羅布森書蟲房轉化而成。不同於一般教室，這裡保留閱讀、交流與共學的氛圍，結合舒適的自然環境與住宿空間，學員能在這裡進行多元課程，也提供住宿與煮餐設備，方便大家能夠投入在課程與活動之中。\n課後的交流、共餐的時光，以及與不同背景夥伴的相遇，來自各地的學員一起互相交流，分享照顧現場的觀察與經驗，讓知識與實踐自然地串連起來。除了人才培育的使命外，也期望能投入共生社區的發展，協力溪尾人文發展，讓在地的居民及孩子、長輩都能隨意來到CFT走動及參與活動，活絡溪尾！\n人與人的相遇、交流與陪伴，都是照顧學習的一部分。',
            locations: [{ name: '臺中溪尾', nameEn: 'Taichung,Xiwei' }],
          },
          // Sheet school 09 CTA按鈕（照片帶＋兩顆 pill；按鈕2 課程表 URL 待客戶補，先連學習平台）
          {
            blockType: 'taCta',
            variant: 'photoBand',
            cards: [
              {
                title: '加入照顧學校',
                buttonLabel: '加入照顧學校',
                url: 'https://school.carefortaiwan.com.tw',
                image: photos[2].id,
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
            image: photos[2].id,
          },
          {
            blockType: 'content',
            eyebrow: 'About CFT',
            title: 'About the Care School',
            richText: rtNodes(
              h3('A talent-cultivation base teaching for Taiwan’s long-term care'),
              p(
                'The Care For Taiwan (CFT) Care School cultivates care professionals, creates innovative community/home integrated long-term care, and advances the All In One (AIO) integrated care model. We believe good care is not just completing services — it is understanding people’s needs, seeing how they live, integrating cross-disciplinary resources, and accompanying everyone to keep living in familiar surroundings.',
              ),
              p(
                'Facing the care needs of an aging society, the school develops long-term care courses through four learning maps — courses, practice, certification, and career — so learners not only understand care but turn learning into real ability. We build a talent system from entry to advanced levels, helping more people join care work and making care a profession with long-term growth.',
              ),
              p(
                'Here, learning happens not only in classrooms, but in real service settings, in human connection, and in every cycle of practice and reflection.',
              ),
            ),
            image: photos[2].id,
            imagePosition: 'left',
          },
          {
            blockType: 'infographic',
            variant: 'ring',
            eyebrow: 'Problematic',
            title: 'The problems we see',
            body: 'As care needs grow rapidly, on the front lines we see:\n1. A single career path: care work often lacks clear growth paths and development opportunities, making long-term commitment hard to attract.\n2. A pay-and-value gap: care work matters more every year, but its professional value is still not fully seen.\n3. Scattered professions: medical, care, community, and family lack integration; cross-disciplinary collaboration is hard to build and connect.\nThat is why we cultivate talent — to build new care capabilities and a new language of care.',
            photos: [
              { image: photos[0].id },
              { image: photos[2].id },
              { image: photos[4].id },
              { image: photos[6].id },
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
                body: 'Care capability comes from systematic learning and steady accumulation. The course map integrates AIO courses, the eight modules, hands-on intensives, and co-learning activities — helping learners build a complete professional foundation from care philosophy outward.',
                featuresLabel: 'Learning features',
                features: [
                  {
                    title: 'AIO courses',
                    text: 'Centered on the All In One model — from person-centered care and whole-person support to community symbiosis — building complete care thinking and practice methods.',
                  },
                  {
                    title: 'Eight modules',
                    text: 'Person-centered care, comfort care, elder care, dementia care, disability support, holistic healing, and more — building professional knowledge and cross-disciplinary perspective.',
                  },
                  {
                    title: 'Hands-on intensives',
                    text: 'Turning care skills into abilities you can truly carry. Learners practice care techniques repeatedly so real skills are ready when needed.',
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
                body: 'Through AIO service teams, symbiosis homes, day care, and international study, learners step out of the classroom into real service settings — building their own care judgment and service capability.',
                featuresLabel: 'Learning features',
                features: [
                  {
                    title: 'AIO service teams',
                    text: 'Entering community and family service settings to learn needs assessment, companionship care, teamwork, and problem-solving with guided, real service experience.',
                  },
                  {
                    title: 'Symbiosis homes',
                    text: 'Visiting symbiotic care hubs in different regions to learn local care models and community practice.',
                  },
                  {
                    title: 'Day care',
                    text: 'Observing service flows at day care centers to understand elders’ daily needs, activity design, and care support systems.',
                  },
                  {
                    title: 'International study',
                    text: 'Exchanging with Japanese long-term care institutions and partners to broaden care perspectives and bring innovations home.',
                  },
                ],
              },
              {
                label: 'Certification Map',
                heading: 'Certification Map',
                subheading: 'Building credentials and a learning record',
                body: 'From care worker training and specialized care to advanced courses, we help learners earn qualifications step by step and build professional credibility — with a certification system and digital management that tracks each learner’s progress and growth.',
                featuresLabel: 'Learning features',
                features: [
                  {
                    title: 'Digital learning portfolio',
                    text: 'The Care School learning platform integrates course records, certifications, learning files, and skill development into each learner’s own care-talent portfolio.',
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
          { blockType: 'content', eyebrow: 'Stories', title: 'Course Stories' },
          {
            blockType: 'articleCards',
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: false,
          },
          {
            blockType: 'photoStrip',
            images: [
              { image: photos[0].id },
              { image: photos[1].id },
              { image: photos[3].id },
              { image: photos[5].id },
              { image: photos[6].id },
            ],
          },
          {
            blockType: 'mapLocations',
            eyebrow: 'CFT Space',
            title: 'The Robinson Space',
            subtitle: 'The Care School’s training grounds',
            body: 'The Care School sits in Xiwei, Taichung, transformed from the Robinson Bookworm House. Unlike ordinary classrooms, it keeps an atmosphere of reading, exchange, and co-learning — with a comfortable natural environment, lodging, and cooking facilities so everyone can immerse in courses and activities.\nAfter-class exchanges, shared meals, and encounters with peers from different backgrounds let learners share observations from the care front lines, naturally connecting knowledge and practice. Beyond talent cultivation, the school helps develop the local Xiwei community — welcoming residents, children, and elders to walk in and join activities.\nEvery meeting, exchange, and companionship between people is part of learning care.',
            locations: [{ name: 'Taichung, Xiwei' }],
          },
          {
            blockType: 'taCta',
            variant: 'photoBand',
            cards: [
              {
                title: 'Join the Care School',
                buttonLabel: 'Join the Care School',
                url: 'https://school.carefortaiwan.com.tw',
                image: photos[2].id,
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
            image: photos[6].id,
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
            image: photos[6].id,
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
          label: 'AIO解決方案',
          type: 'internal',
          url: '#',
          subItems: [
            { label: '家庭照顧服務', type: 'internal', url: '/care' },
            { label: '組織培力', type: 'internal', url: '/training' },
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
            { label: '課程學習', type: 'external', url: 'https://school.carefortaiwan.com.tw' },
          ],
        },
      ],
    },
  })

  // label 是 array 內的 localized 欄位：en 版需帶相同 row id 才會對到同一列
  const navZh = await payload.findGlobal({ slug: 'navigation', locale: 'zh-TW', depth: 0 })
  const navLabelEn: Record<string, string> = {
    認識創照: 'About Us',
    AIO解決方案: 'AIO Solutions',
    家庭照顧服務: 'Home Care Services',
    組織培力: 'Organizational Training',
    聯絡我們: 'Contact Us',
    CFT照顧學校: 'CFT Care School',
    關於照顧學校: 'About the Care School',
    課程學習: 'Online Courses',
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
          title: '網站導覽',
          links: [
            { label: '認識創照', url: '/about' },
            { label: '家庭照顧服務', url: '/care' },
            { label: '組織培力', url: '/training' },
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
          ],
        },
      ],
      familyVentures: [
        { name: '創照服務設計', url: 'https://carefortaiwan.com.tw' },
        { name: 'CFT 照顧學校', url: 'https://school.carefortaiwan.com.tw' },
        { name: '伯拉罕共生照顧勞動合作社' },
        { name: '鄰里123' },
        { name: 'Connect 10' },
      ],
      socialLinks: [],
      copyright: `© ${new Date().getFullYear()} 創照服務設計股份有限公司 All rights reserved.`,
    },
  })

  const footerZh = await payload.findGlobal({ slug: 'site-footer', locale: 'zh-TW', depth: 0 })
  const footerLabelEn: Record<string, string> = {
    網站導覽: 'Site Map',
    聯絡資訊: 'Contact',
    認識創照: 'About Us',
    家庭照顧服務: 'Home Care Services',
    組織培力: 'Organizational Training',
    關於照顧學校: 'About the Care School',
    聯絡我們: 'Contact Us',
    '臺中市烏日區溪岸路8-3號': 'No. 8-3, Xi’an Rd., Wuri Dist., Taichung City, Taiwan',
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
