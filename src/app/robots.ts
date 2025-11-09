import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/company/dashboard/',
          '/edit-job/',
          '/job-alerts/',
          '/applications/',
          '/profile/',
          '/post-job/'
        ],
      },
    ],
    sitemap: 'https://ghlhire.com/sitemap.xml',
  }
}
