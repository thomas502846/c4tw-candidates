const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

// staging：NOINDEX=true 時 robots.txt 全站 disallow
const NOINDEX = process.env.NOINDEX === 'true'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: NOINDEX
      ? [
          {
            userAgent: '*',
            disallow: '/',
          },
        ]
      : [
          {
            userAgent: '*',
            disallow: '/admin/*',
          },
        ],
    additionalSitemaps: NOINDEX
      ? []
      : [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
