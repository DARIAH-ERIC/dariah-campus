/** @typedef {import('@/i18n/i18n.config').Locale} Locale */
/** @typedef {import('next').NextConfig & {i18n?: {locales: Array<Locale>; defaultLocale: Locale}}} NextConfig */
/** @typedef {import('webpack').Configuration} WebpackConfig} */

/** @type {NextConfig} */
const config = {
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true,
  },
  future: {
    strictPostcssConfiguration: true,
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  poweredByHeader: false,
  async redirects() {
    return [
      ...Object.entries(require('./redirects.resources.json')).map(
        ([uuid, id]) => {
          return {
            source: `/id/${uuid}`,
            destination: `/resource/posts/${id}`,
            permanent: false,
          }
        },
      ),
      ...Object.entries(require('./redirects.courses.json')).map(
        ([uuid, id]) => {
          return {
            source: `/id/${uuid}`,
            destination: `/curriculum/${id}`,
            permanent: false,
          }
        },
      ),
      ...Object.entries(require('./redirects.events.json')).map(
        ([uuid, id]) => {
          return {
            source: `/id/${uuid}`,
            destination: `/resource/events/${id}`,
            permanent: false,
          }
        },
      ),
      ...Object.entries(require('./redirects.legacy.resources.json')).map(
        ([legacyId, id]) => {
          return {
            source: `/resource/${legacyId}`,
            destination: `/resource/posts/${id}`,
            permanent: true,
          }
        },
      ),
      ...Object.entries(require('./redirects.legacy.events.json')).map(
        ([legacyId, id]) => {
          return {
            source: `/resource/${legacyId}`,
            destination: `/resource/events/${id}`,
            permanent: true,
          }
        },
      ),
      ...Object.entries(require('./redirects.legacy.persons.json')).map(
        ([legacyId, id]) => {
          return {
            source: `/author/${legacyId}`,
            destination: `/author/${id}`,
            permanent: true,
          }
        },
      ),
    ]
  },
  async rewrites() {
    return [
      { source: '/resources', destination: '/resources/page/1' },
      { source: '/resources/:type', destination: '/resources/:type/page/1' },
      { source: '/courses', destination: '/courses/page/1' },
      { source: '/authors', destination: '/authors/page/1' },
      { source: '/author/:id', destination: '/author/:id/page/1' },
      { source: '/tags', destination: '/tags/page/1' },
      { source: '/tag/:id', destination: '/tag/:id/page/1' },
      { source: '/categories', destination: '/categories/page/1' },
      { source: '/category/:id', destination: '/category/:id/page/1' },
      { source: '/about', destination: '/docs/about' },
    ]
  },
}

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
  /** @ts-expect-error Missing module declaration. */
  require('@stefanprobst/next-svg')({
    svgo: {
      plugins: [
        { prefixIds: true },
        { removeDimensions: true },
        { removeViewBox: false },
      ],
    },
    svgr: {
      titleProp: true,
    },
  }),
  function (nextConfig = {}) {
    return {
      ...nextConfig,
      /** @type {(config: WebpackConfig, options: any) => WebpackConfig} */
      webpack(config, options) {
        /* @ts-expect-error always defined */
        config.module.rules.push({
          test: /\.mdx?$/,
          use: [
            options.defaultLoaders.babel,
            {
              loader: require.resolve('xdm/webpack.cjs'),
              options: {
                remarkPlugins: [
                  require('remark-gfm'),
                  require('remark-frontmatter'),
                  [
                    require('remark-mdx-frontmatter').remarkMdxFrontmatter,
                    { name: 'metadata' },
                  ],
                ],
              },
            },
          ],
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    }
  },
]

module.exports = plugins.reduce((config, plugin) => {
  return plugin(config)
}, config)
