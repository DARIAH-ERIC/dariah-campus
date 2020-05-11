const path = require('path')
const camelCase = require('lodash.camelcase')

const algoliaQueries = require('./algolia')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

const siteUrl =
  process.env.URL || process.env.DEPLOY_URL || 'https://campus.dariah.eu'

module.exports = {
  siteMetadata: {
    author: 'DARIAH Campus',
    description:
      'DARIAH-CAMPUS is a discovery framework and hosting platform for DARIAH learning resources. Currently in beta. ',
    email: 'https://www.dariah.eu/helpdesk/',
    keywords: ['Digital Humanities'],
    lang: 'en',
    paths: [
      {
        displayName: 'About',
        name: 'about',
        path: '/about',
        top: true,
      },
      {
        displayName: 'Author',
        name: 'author',
        path: '/author',
        top: false,
      },
      {
        displayName: 'Authors',
        name: 'authors',
        path: '/authors',
        top: true,
      },
      {
        displayName: 'Category',
        name: 'category',
        path: '/source',
        top: false,
      },
      {
        displayName: 'Categories',
        name: 'categories',
        path: '/sources',
        top: true,
      },
      {
        displayName: 'Contact',
        name: 'contact',
        path: '/contact',
        top: true,
      },
      {
        displayName: 'Course Registry',
        name: 'course-registry',
        path: '/course-registry',
        top: true,
      },
      {
        displayName: 'Docs',
        name: 'docs',
        path: '/docs',
        top: false,
      },
      {
        displayName: 'Home',
        name: 'home',
        path: '/',
        top: true,
      },
      {
        displayName: 'Resource',
        name: 'post',
        path: '/resource',
        top: false,
      },
      {
        displayName: 'Resources',
        name: 'posts',
        path: '/resources',
        top: true,
      },
      {
        displayName: 'Tag',
        name: 'tag',
        path: '/tag',
        top: false,
      },
      {
        displayName: 'Tags',
        name: 'tags',
        path: '/tags',
        top: true,
      },
    ],
    publishedAt: '2019-08-30',
    siteUrl,
    siteVerification: [
      // {
      //   name: 'facebook',
      //   key: 'fbAppId',
      // },
      {
        name: 'google',
        key: '',
      },
    ],
    social: [
      {
        name: 'twitter',
        key: '@dariaheu',
        url: 'https://twitter.com/dariaheu',
      },
      {
        name: 'flickr',
        url:
          'https://www.flickr.com/photos/142235661@N08/albums/with/72157695786965901',
      },
      {
        name: 'youtube',
        url: 'https://www.youtube.com/channel/UCeQpM_gUvNZXUWf6qQ226GQ',
      },
      {
        name: 'github',
        url: 'https://github.com/DARIAH-ERIC',
      },
      {
        name: 'email',
        url: 'https://www.dariah.eu/helpdesk/',
      },
      {
        name: 'website',
        url: 'https://www.dariah.eu',
      },
    ],
    title: 'DARIAH Campus',
    url: 'https://www.dariah.eu',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: path.resolve('./src/assets'),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: path.resolve('./contents/data'),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'events',
        path: path.resolve('./contents/events'),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: path.resolve('./contents/images'),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: path.resolve('./contents/resources'),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs',
        path: path.resolve('./documentation'),
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        defaultLayouts: {
          data: path.resolve('./src/templates/component.js'),
          default: path.resolve('./src/templates/page.js'),
        },
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 800,
              withWebp: true,
              linkImagesToOriginal: false,
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              offsetY: '400',
              icon: false,
            },
          },
        ],
        plugins: [
          'gatsby-remark-images', // FIXME: Temporary workaround
          'gatsby-remark-autolink-headers', // FIXME: Temporary workaround
        ],
      },
    },
    {
      resolve: 'gatsby-transformer-yaml',
      options: {
        typeName: ({ node }) =>
          node.name.charAt(0).toUpperCase() + camelCase(node.name.slice(1)),
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-svgr',
    'gatsby-plugin-sass', // Needed for the custom event layout
    // {
    //   resolve: 'gatsby-plugin-postcss',
    //   options: {
    //     postCssPlugins: [require('postcss-custom-properties')],
    //   },
    // },
    {
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
        queries: algoliaQueries,
        chunkSize: 10000, // default: 1000
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'DARIAH Campus',
        short_name: 'DARIAH Campus',
        start_url: '/',
        background_color: '#006699',
        theme_color: '#006699',
        display: 'minimal-ui',
        icon: 'src/assets/dariah-flower.svg',
      },
    },
    // {
    //   resolve: 'gatsby-plugin-nprogress',
    //   options: {
    //     color: '#006699',
    //     showSpinner: false,
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
    // 'gatsby-plugin-polyfill-io',
    'gatsby-plugin-netlify',
    // 'gatsby-plugin-netlify-cache',
    // 'gatsby-plugin-netlify-cms',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_ID,
        anonymize: true,
        respectDNT: true,
      },
    },
  ],
}
