import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const PHOTOS_DIR = path.resolve(dirname, '../../../content-assets/photos')

// 清空後重建的 collections（posts / categories / partners / media-coverage / redirects 不動）
const collectionsToClear: CollectionSlug[] = [
  'pages',
  'case-stories',
  'awards',
  'timeline-events',
  'media',
]

/** Lexical richText helper：一段文字一個段落 */
const rt = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      version: 1,
      children: [{ type: 'text', version: 1, text }],
    })),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

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
  payload.logger.info('Seeding Care For Taiwan demo content...')

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
  // 3. 獲獎紀錄 awards（真實清單，年份待客戶確認的以已知年份暫填）
  // ---------------------------------------------------------------
  payload.logger.info('— Seeding awards...')

  const awardsData: { year: number; zh: string; en: string; alias?: string }[] = [
    {
      year: 2021,
      zh: '羅布森善益空間共享計畫',
      en: 'Robinson Goodwill Space Sharing Program',
      alias: 'CFT 照顧學校場域（羅布森書蟲房）',
    },
    {
      year: 2021,
      zh: '第18屆夢想資助計畫 KEEP WALKING',
      en: 'The 18th KEEP WALKING Fund',
    },
    {
      year: 2022,
      zh: '日月光女性永續創新人才培育',
      en: 'ASE Women in Sustainability Innovation Talent Program',
    },
    {
      year: 2022,
      zh: '信義公益基金會2022共好行動',
      en: 'Sinyi Charity Foundation 2022 Common Good Action',
    },
    {
      year: 2023,
      zh: '懷世代公益加速器',
      en: 'WhatsGen Social Impact Accelerator',
    },
    {
      year: 2023,
      zh: '星展銀行社會企業獎勵金',
      en: 'DBS Bank Social Enterprise Grant',
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
        ...(item.alias ? { alias: item.alias } : {}),
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
  // 4. 案例故事 case-stories（取自舊站真實內容，4 篇 → 3+載入更多可示範）
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
  // 5. 六頁 pages（zh-TW 建立 → en 更新；layout 為 localized 欄位）
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

  const pagesData: PageSeed[] = [
    {
      slug: 'home',
      zh: {
        title: '首頁',
        metaTitle: '創新照顧，開啟照顧無限可能',
        metaDescription:
          '創照服務設計（Care For Taiwan）以 ALL IN ONE 整合照顧服務陪伴長照家庭：返家照顧、人才培育、組織培力與照顧科技。',
        layout: [
          {
            blockType: 'hero',
            images: [{ image: photos[0].id }, { image: photos[1].id }, { image: photos[7].id }],
            title: '創新照顧，開啟照顧無限可能',
            subtitle:
              '從住院到返家、從人才培育到照顧科技，創照以 ALL IN ONE 整合服務，陪伴每一個長照家庭。',
            cta: { label: '認識創照', url: '/about' },
          },
          {
            blockType: 'newsTicker',
            items: [
              {
                text: '「新竹縣陪出院推動計畫」進行中，歡迎符合公益援助資格的家庭洽詢',
                url: '/care',
                enabled: true,
              },
              {
                text: 'CFT 照顧學校課程陸續開放報名',
                url: 'https://school.carefortaiwan.com.tw',
                enabled: true,
              },
              {
                text: '杜格納合作社於林口社宅持續招募社區夥伴',
                url: '/training',
                enabled: true,
              },
            ],
          },
          {
            blockType: 'statsCards',
            cards: [
              { number: '8', suffix: '大模組', label: '照顧學校培育課程' },
              { number: '24', suffix: '小時', label: '居家照顧服務' },
              { number: '2022', suffix: '年', label: '創照服務設計成立' },
              { number: '3', suffix: '處', label: '樂齡據點試辦場域' },
            ],
          },
          {
            blockType: 'ctaBanner',
            title: '長照路上，您不孤單',
            subtitle: '返家照顧、人才培育、組織培力——歡迎與我們聊聊照顧現場的需要。',
            cta: { label: '聯絡我們', url: '/contact' },
            background: 'primary',
          },
        ],
      },
      en: {
        title: 'Home',
        layout: [
          {
            blockType: 'hero',
            images: [{ image: photos[0].id }, { image: photos[1].id }, { image: photos[7].id }],
            title: 'Innovating care, opening every possibility',
            subtitle:
              'From hospital to home, from talent cultivation to care technology — Care For Taiwan walks with every family through ALL IN ONE integrated care.',
            cta: { label: 'About Us', url: '/en/about' },
          },
          {
            blockType: 'newsTicker',
            items: [
              {
                text: 'Hsinchu discharge-accompaniment program is underway',
                url: '/en/care',
                enabled: true,
              },
              {
                text: 'CFT Care School courses are open for registration',
                url: 'https://school.carefortaiwan.com.tw',
                enabled: true,
              },
            ],
          },
          {
            blockType: 'statsCards',
            cards: [
              { number: '8', suffix: 'modules', label: 'Care School curriculum' },
              { number: '24', suffix: 'hours', label: 'Home care services' },
              { number: '2022', label: 'Care For Taiwan founded' },
              { number: '3', suffix: 'sites', label: 'Active-aging pilot hubs' },
            ],
          },
          {
            blockType: 'ctaBanner',
            title: 'You are not alone on the caregiving journey',
            subtitle: 'Home care, talent cultivation, organizational training — talk to us.',
            cta: { label: 'Contact Us', url: '/en/contact' },
            background: 'primary',
          },
        ],
      },
    },
    {
      slug: 'about',
      zh: {
        title: '認識創照',
        metaTitle: '認識創照',
        metaDescription:
          '創照服務設計的緣起與大事紀：從不老騎士、陪出院到部落整合照顧，ALL IN ONE 以人為本的照顧模式一路走來。',
        layout: [
          {
            blockType: 'content',
            title: '緣起',
            richText: rt(
              '我們想在臺灣發展「在地跨專業團隊」，提供社區與居家融合的長照服務，讓個案安心、家屬放心、平價溫馨——使在家溫馨終老，成為台灣民眾普遍「找得到、看得到、用得到」的服務。',
              '創辦人林依瑩曾任弘道老人福利基金會執行長十二年，2007 年推動「不老騎士」，開創國內外活躍老化的多元創新模式。但台灣長期照顧始終依賴外籍移工，讓她很是憂心，於是無論在哪個崗位，都持續推動 ALL IN ONE 照顧服務的研發。',
              '經過近十年推動，共生照顧、24 小時居家照顧、重症返家、居家安寧、智能照護等模式陸續實踐成形。想讓這些服務遍佈全台，人才培育是關鍵核心——2022 年底，「創照服務設計（Care For Taiwan）股份有限公司」因此成立，期許培育可以「創照無限可能」的人才，創造幸福長照國度。',
            ),
            image: photos[6].id,
            imagePosition: 'right',
          },
          {
            blockType: 'timeline',
            mode: 'reference',
            events: timelineDocs.map((doc) => doc.id),
          },
          {
            blockType: 'awards',
            source: 'collection',
            awards: awardDocs.map((doc) => doc.id),
          },
          {
            blockType: 'quote',
            text: '不能只有我們可以做，要遍地開花。',
            attribution: '林依瑩 創辦人',
            photo: photos[1].id,
          },
        ],
      },
      en: {
        title: 'About Us',
        layout: [
          {
            blockType: 'content',
            title: 'Our Story',
            richText: rt(
              'We are building local cross-disciplinary teams in Taiwan to deliver integrated community and home-based long-term care — care that families can find, see, and afford, so that aging at home becomes the norm.',
              'Founder Lin Yi-ying led the Hondao Senior Citizen’s Welfare Foundation for twelve years and launched “Go Grandriders” in 2007. Concerned by Taiwan’s reliance on migrant caregivers, she has pursued the ALL IN ONE care model across every role she has held.',
              'After a decade of practice — symbiotic care, 24-hour home care, returning home with critical illness, home hospice, and smart care — Care For Taiwan Co., Ltd. was founded at the end of 2022 to cultivate the talent that makes this care possible everywhere.',
            ),
            image: photos[6].id,
            imagePosition: 'right',
          },
          {
            blockType: 'timeline',
            mode: 'reference',
            events: timelineDocs.map((doc) => doc.id),
          },
          {
            blockType: 'awards',
            source: 'collection',
            awards: awardDocs.map((doc) => doc.id),
          },
          {
            blockType: 'quote',
            text: 'It can’t be only us — this has to bloom everywhere.',
            attribution: 'Lin Yi-ying, Founder',
            photo: photos[1].id,
          },
        ],
      },
    },
    {
      slug: 'care',
      zh: {
        title: '家庭照顧服務',
        metaTitle: '家庭照顧服務',
        metaDescription:
          '返家及管家跨專業整合服務：從醫療決策諮詢、住院照顧人力到返家照顧計畫，創照陪您逐步面對長照難題。',
        layout: [
          {
            blockType: 'twoColumn',
            variant: 'hero',
            direction: 'imageLeft',
            eyebrow: 'Family Care Services',
            image: photos[5].id,
            title: '返家及管家跨專業整合服務',
            richText: rt(
              '出院回家好慌？不緊張。我們協助從醫院或住宿型長照機構返家照顧，為您擬訂完整照顧服務計畫。',
            ),
            cta: { label: '洽詢服務', url: '/contact' },
            itemsStyle: 'iconCards',
            items: [
              {
                title: '醫療與照顧決策諮詢',
                text: '出院前後的醫療與照顧選擇，專人陪您一起討論。',
              },
              {
                title: '住院照顧人力協助',
                text: '住院照顧人力媒合與照顧品質把關。',
              },
              {
                title: '返家環境與輔具預備',
                text: '照顧床與輔具定位、居家環境整備、返家會議。',
              },
              {
                title: '長照資源申請協助',
                text: '政府長照資源申請與返家後的服務銜接。',
              },
            ],
          },
          {
            blockType: 'content',
            title: '關於創照的整合服務',
            richText: rt(
              '長照的起點在住院。但住院照顧人力與返家預備，對許多家庭而言相當吃力——看護難請、品質參差、費用沉重；政府長照 2.0 又須返家後才能媒合人力，且多為局部時段服務。',
              '五花八門的服務各有承辦人、不同單位輪番到家訪視，難以整合。創照培訓 AIO 照顧設計師，提供全人、全家、全方位的需求照顧，把複雜的長照服務統整起來，有效解決長照家庭的難題。',
            ),
          },
          {
            blockType: 'articleCards',
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: true,
          },
          {
            blockType: 'ctaBanner',
            title: '需要返家照顧的協助嗎？',
            subtitle: '專人到府評估，為您規劃合適的照顧計畫。',
            cta: { label: '聯絡我們', url: '/contact' },
            background: 'muted',
          },
        ],
      },
      en: {
        title: 'Home Care Services',
        layout: [
          {
            blockType: 'twoColumn',
            variant: 'hero',
            direction: 'imageLeft',
            eyebrow: 'Family Care Services',
            image: photos[5].id,
            title: 'Hospital-to-home integrated care',
            richText: rt(
              'Going home from the hospital can be overwhelming. We plan the whole journey — from care decisions and in-hospital staffing to home preparation and settling in.',
            ),
            cta: { label: 'Ask about services', url: '/en/contact' },
            itemsStyle: 'iconCards',
            items: [
              {
                title: 'Care decision consulting',
                text: 'Talk through medical and care decisions before and after discharge.',
              },
              {
                title: 'In-hospital care staffing',
                text: 'Caregiver matching with quality assurance.',
              },
              {
                title: 'Home & equipment preparation',
                text: 'Care bed, assistive devices, and discharge meetings.',
              },
              {
                title: 'LTC resource application',
                text: 'Help applying for government long-term care resources.',
              },
            ],
          },
          {
            blockType: 'content',
            title: 'About our integrated services',
            richText: rt(
              'Long-term care starts at the hospital bed, yet families struggle with staffing, quality, and cost — and public services only start after returning home.',
              'Our AIO care designers integrate the fragmented services into one coherent plan, centered on the person and the whole family.',
            ),
          },
          {
            blockType: 'articleCards',
            source: 'case-stories',
            batchSize: 3,
            enableLoadMore: true,
          },
          {
            blockType: 'ctaBanner',
            title: 'Need help bringing a loved one home?',
            subtitle: 'We visit, assess, and plan the right care with you.',
            cta: { label: 'Contact Us', url: '/en/contact' },
            background: 'muted',
          },
        ],
      },
    },
    {
      slug: 'training',
      zh: {
        title: '組織培力',
        metaTitle: '組織培力',
        metaDescription:
          '創照將 ALL IN ONE 服務模式與營運經驗，提供給長照機構、合作社與公部門：孵化器與培力器、交流小聚與跨領域論壇。',
        layout: [
          {
            blockType: 'twoColumn',
            variant: 'hero',
            direction: 'imageLeft',
            eyebrow: 'Organization Support',
            image: photos[3].id,
            title: '創業孵化器與長照單位培力器',
            richText: rt(
              '伯拉罕自 2019 年推動原鄉長期照顧模式，在地辦訓、培力在地人投入、吸引青年返鄉，成為偏鄉長照發展的典範。這套經驗不藏私——我們將 AIO 服務模式提供給私人長照機構、合作社、公部門單位，協力長照單位重新梳理運作、永續發展。',
            ),
            itemsStyle: 'steps',
            items: [
              {
                title: '營運盤點與梳理',
                text: '進場了解組織現況與在地照顧需求。',
              },
              {
                title: '在地辦訓與實作',
                text: '課程設計與照顧現場實作並行。',
              },
              {
                title: '陪伴營運到退場',
                text: '團隊能獨立營運，我們就放手。',
              },
            ],
          },
          {
            blockType: 'twoColumn',
            direction: 'imageRight',
            background: 'surface',
            eyebrow: 'Forum & Meetup',
            image: photos[4].id,
            title: '交流小聚與跨領域論壇',
            richText: rt(
              '教育培訓之外，外部交流是提升長照知能與廣度的方式。我們以「主題課程、社區巡禮、共享廚房、國內外專家創新模式分享」辦理長照單位交流小聚與國際論壇。',
              '讓照顧現場的人彼此激盪視野與思考，進而影響自身團隊，改善固著的照顧樣貌。',
            ),
            cta: { label: '洽詢培力合作', url: '/contact' },
          },
          {
            blockType: 'twoColumn',
            direction: 'imageLeft',
            eyebrow: 'Empowerment Modules',
            image: photos[1].id,
            title: '六大培力模組',
            richText: rt(
              '從營運梳理到永續發展，培力的目標只有一個——讓照顧現場長出自己的能力。',
            ),
            itemsStyle: 'grid',
            items: [
              { image: photos[6].id, title: '營運梳理', text: '組織運作盤點與服務流程再設計。' },
              { image: photos[2].id, title: '在地辦訓', text: '把課程帶進照顧現場，培力在地人。' },
              { image: photos[1].id, title: '服務設計', text: 'AIO 整合服務模式的導入與調適。' },
              { image: photos[5].id, title: '智慧照護導入', text: '照顧科技與遠距支援進到日常。' },
              { image: photos[4].id, title: '社區共生經營', text: '據點與合作社的共生營運經驗。' },
              { image: photos[7].id, title: '永續發展', text: '陪伴組織走向自立與永續。' },
            ],
          },
          {
            blockType: 'ctaBanner',
            title: '想為您的團隊安排培力課程？',
            subtitle: '從營運梳理到課程設計，創照與您一起讓照顧現場更好。',
            cta: { label: '聯絡我們', url: '/contact' },
            background: 'secondary',
          },
        ],
      },
      en: {
        title: 'Organizational Training',
        layout: [
          {
            blockType: 'twoColumn',
            variant: 'hero',
            direction: 'imageLeft',
            eyebrow: 'Organization Support',
            image: photos[3].id,
            title: 'Incubator and capacity builder for care organizations',
            richText: rt(
              'Since 2019, the Plahan model has shown how rural long-term care can train locals, employ locals, and draw young people home. We share the AIO operating model openly with care institutions, co-ops, and government agencies.',
            ),
            itemsStyle: 'steps',
            items: [
              {
                title: 'Assess & restructure',
                text: 'Understand the organization and local care needs.',
              },
              {
                title: 'Train on-site',
                text: 'Course design and hands-on practice, side by side.',
              },
              {
                title: 'Walk alongside, then step back',
                text: 'We exit once the team can run on its own.',
              },
            ],
          },
          {
            blockType: 'twoColumn',
            direction: 'imageRight',
            background: 'surface',
            eyebrow: 'Forum & Meetup',
            image: photos[4].id,
            title: 'Meetups and cross-disciplinary forums',
            richText: rt(
              'Beyond training courses, we host care-sector meetups and international forums — themed courses, community tours, shared kitchens, and innovation sharing from experts at home and abroad.',
            ),
            cta: { label: 'Partner with us', url: '/en/contact' },
          },
          {
            blockType: 'twoColumn',
            direction: 'imageLeft',
            eyebrow: 'Empowerment Modules',
            image: photos[1].id,
            title: 'Six empowerment modules',
            richText: rt(
              'From operations to sustainability, empowerment has one goal — care teams that grow their own strength.',
            ),
            itemsStyle: 'grid',
            items: [
              {
                image: photos[6].id,
                title: 'Operations review',
                text: 'Workflow mapping and service redesign.',
              },
              {
                image: photos[2].id,
                title: 'Local training',
                text: 'Courses brought into the field, for local people.',
              },
              {
                image: photos[1].id,
                title: 'Service design',
                text: 'Adopting and adapting the AIO model.',
              },
              {
                image: photos[5].id,
                title: 'Smart-care adoption',
                text: 'Care technology and remote support in daily work.',
              },
              {
                image: photos[4].id,
                title: 'Community symbiosis',
                text: 'Operating hubs and co-ops that care together.',
              },
              {
                image: photos[7].id,
                title: 'Sustainable operations',
                text: 'Walking with organizations toward independence.',
              },
            ],
          },
          {
            blockType: 'ctaBanner',
            title: 'Planning a training program for your team?',
            subtitle: 'From operations to curriculum, we build it with you.',
            cta: { label: 'Contact Us', url: '/en/contact' },
            background: 'secondary',
          },
        ],
      },
    },
    {
      slug: 'school',
      zh: {
        title: '關於照顧學校',
        metaTitle: '關於照顧學校',
        metaDescription:
          'CFT 照顧學校：為臺灣長照而教的人才培育基地。八大模組課程，培育照顧服務員、照顧設計師與在宅醫師等跨專業人才。',
        layout: [
          {
            blockType: 'content',
            title: '為臺灣長照而教',
            richText: rt(
              'Care for Taiwan 照顧學校（CFT）成立於 2021 年底，是一處專為臺灣長照教育及人才培育的基地。校舍原為「十年不關」的獨立書店羅布森書蟲房，2021 年透過「羅布森善益空間共享計畫」由 CFT 取得使用資格，2022 年 3 月正式開幕運作。',
              '學校研發八大模組課程：複雜性及 24 小時照顧、共生照顧、生活設計、失智照顧、疫情下整合照護、安寧照顧、自然照顧、足部照顧——培育照顧服務員、照顧設計師及在宅醫師等跨專業長照人才。',
              '照顧學校位於臺中烏日溪尾里，臺中、南投、彰化三地交界，環境閒靜舒適。除了人才培育，也投入共生社區的發展，讓在地居民、孩子與長輩都能隨意走進 CFT，活絡溪尾。',
            ),
            image: photos[2].id,
            imagePosition: 'right',
          },
          {
            blockType: 'twoColumn',
            direction: 'imageLeft',
            background: 'surface',
            eyebrow: 'Talent Pathway',
            image: photos[7].id,
            title: '人才培育路徑',
            richText: rt(
              '八大模組課程之上，照顧學校培育四種走進照顧現場的人——從照顧服務員到在宅醫師，跨專業一起把照顧做完整。',
            ),
            itemsStyle: 'pathway',
            items: [
              { title: '照顧服務員', text: '照顧現場的第一線專業。' },
              { title: '照顧設計師', text: '統整需求、設計全人照顧計畫。' },
              { title: '在宅醫師', text: '把醫療帶回家中的醫師。' },
              { title: '跨專業夥伴', text: '護理、復能、社工協力照顧。' },
            ],
          },
          {
            blockType: 'quote',
            text: 'All in One，需求之所在，就是服務之所在。',
            attribution: '林依瑩 創辦人',
          },
          {
            blockType: 'ctaBanner',
            title: '前往課程學習平台',
            subtitle: '照顧學校課程報名與線上學習，都在學習平台。',
            cta: { label: '課程學習', url: 'https://school.carefortaiwan.com.tw' },
            background: 'primary',
          },
        ],
      },
      en: {
        title: 'About the Care School',
        layout: [
          {
            blockType: 'content',
            title: 'Teaching for Taiwan’s long-term care',
            richText: rt(
              'The CFT Care School, founded in late 2021, is a dedicated base for long-term care education in Taiwan. Housed in a former independent bookstore through the Robinson space-sharing program, it opened in March 2022.',
              'Its eight-module curriculum — from complex and 24-hour care to symbiotic care, dementia care, hospice, and foot care — cultivates care workers, care designers, and home-visiting physicians.',
            ),
            image: photos[2].id,
            imagePosition: 'right',
          },
          {
            blockType: 'twoColumn',
            direction: 'imageLeft',
            background: 'surface',
            eyebrow: 'Talent Pathway',
            image: photos[7].id,
            title: 'Talent cultivation pathway',
            richText: rt(
              'On top of the eight-module curriculum, the Care School cultivates four kinds of care professionals — working together to make care whole.',
            ),
            itemsStyle: 'pathway',
            items: [
              { title: 'Care workers', text: 'Front-line professionals in daily care.' },
              { title: 'Care designers', text: 'Whole-person care planning and coordination.' },
              { title: 'Home physicians', text: 'Doctors who bring medicine back home.' },
              {
                title: 'Cross-disciplinary partners',
                text: 'Nursing, rehabilitation, and social work together.',
              },
            ],
          },
          {
            blockType: 'quote',
            text: 'All in One — wherever the need is, that is where the service is.',
            attribution: 'Lin Yi-ying, Founder',
          },
          {
            blockType: 'ctaBanner',
            title: 'Visit the learning platform',
            subtitle: 'Course registration and online learning for the Care School.',
            cta: { label: 'Online Courses', url: 'https://school.carefortaiwan.com.tw' },
            background: 'primary',
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
          '創照服務設計聯絡方式：臺中市烏日區溪岸路8-3號，049-2526-611，carefortaiwan2022@gmail.com。',
        layout: [
          // 聯絡表單固定在 /contact route（不入 CMS，客戶定案）；
          // 此 CMS doc 只維護表單上方的聯絡資訊／介紹區塊。
          {
            blockType: 'content',
            title: '聯絡我們',
            richText: rt(
              '辦公室：臺中市烏日區溪岸路8-3號',
              '電話：049-2526-611',
              'E-mail：carefortaiwan2022@gmail.com',
            ),
          },
          {
            blockType: 'ctaBanner',
            title: '想先認識我們的服務？',
            cta: { label: '家庭照顧服務', url: '/care' },
            background: 'muted',
          },
        ],
      },
      en: {
        title: 'Contact Us',
        layout: [
          {
            blockType: 'content',
            title: 'Contact Us',
            richText: rt(
              'Office: No. 8-3, Xi’an Rd., Wuri Dist., Taichung City, Taiwan',
              'Phone: +886-49-2526-611',
              'Email: carefortaiwan2022@gmail.com',
            ),
          },
          {
            blockType: 'ctaBanner',
            title: 'Want to learn about our services first?',
            cta: { label: 'Home Care Services', url: '/en/care' },
            background: 'muted',
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
  // 6. Navigation global（zh-TW → 讀回 row id → en label）
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
  // 7. SiteFooter global
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
            { label: '臺中市烏日區溪岸路8-3號', url: '/contact' },
            { label: '049-2526-611', url: '/contact' },
            { label: 'carefortaiwan2022@gmail.com', url: '/contact' },
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
  // 8. 確保有可登入的管理員（僅在沒有任何使用者時建立）
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
