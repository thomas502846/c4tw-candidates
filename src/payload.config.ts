import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { zhTw } from '@payloadcms/translations/languages/zhTw'
import { fileURLToPath } from 'url'

import { Awards } from './collections/Awards'
import { CaseStories } from './collections/CaseStories'
import { Categories } from './collections/Categories'
import { Locations } from './collections/Locations'
import { Media } from './collections/Media'
import { MediaCoverage } from './collections/MediaCoverage'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { Posts } from './collections/Posts'
import { TimelineEvents } from './collections/TimelineEvents'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Navigation } from './globals/Navigation'
import { SiteFooter } from './globals/SiteFooter'
import { SiteSettings } from './globals/SiteSettings'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    // Browser-tab branding for the admin panel: title suffix + favicon (uses the site's school favicon).
    meta: {
      titleSuffix: '- 官網內容編輯',
      icons: [
        { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
      ],
    },
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
      // Replace the Payload branding with the customer's logo:
      // `Logo` shows on the login screen, `Icon` in the admin nav header.
      graphics: {
        Logo: '@/components/AdminGraphics/Logo',
        Icon: '@/components/AdminGraphics/Icon',
      },
      // Adds a「使用說明」link in the admin nav, pointing to the guide view below.
      afterNavLinks: ['@/components/AdminGuide/NavLink'],
      // Custom「使用說明」page mounted at /admin/guide.
      views: {
        guide: {
          Component: '@/components/AdminGuide#default',
          path: '/guide',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // Admin panel UI language (the chrome/labels of the CMS itself).
  // This is separate from `localization` below, which controls content locales.
  i18n: {
    supportedLanguages: { 'zh-TW': zhTw, en },
    fallbackLanguage: 'zh-TW',
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  localization: {
    locales: [
      {
        label: '繁體中文',
        code: 'zh-TW',
      },
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'zh-TW',
    fallback: true,
  },
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    TimelineEvents,
    Awards,
    MediaCoverage,
    CaseStories,
    Partners,
    Locations,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, Navigation, SiteFooter, SiteSettings],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
