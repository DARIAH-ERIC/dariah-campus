const path = require('path')

const { createPath } = require('./src/utils/create-path')
const { markdownToHtml } = require('./src/utils/markdown-to-html')
const { stripMarkdown } = require('./src/utils/strip-markdown')
const { range } = require('./src/utils/range')
const { slugify } = require('./src/utils/slugify')
const getLastUpdatedTimestamp = require('./src/utils/get-last-updated-timestamp')

const POSTS_PER_PAGE = 12

exports.createSchemaCustomization = ({ actions }) => {
  actions.createFieldExtension({
    name: 'defaultValue',
    args: {
      value: {
        type: 'String!',
        defaultValue: '',
      },
      values: {
        type: '[String!]!',
        defaultValue: [],
      },
    },
    extend(options, fieldConfig) {
      const defaultValue = options.value || options.values
      return {
        resolve(source, args, context, info) {
          const resolver = fieldConfig.resolve || context.defaultFieldResolver
          const fieldValue = resolver(source, args, context, info)
          return fieldValue != null ? fieldValue : defaultValue
        },
      }
    },
  })
  // Note: when proxying from a field with @plain extension, make sure to *not*
  // run a filter on that field, otherwise the field will already have been resolved,
  // i.e. the stripped from markdown.
  actions.createFieldExtension({
    name: 'md',
    extend(options, fieldConfig) {
      return {
        resolve(source, args, context, info) {
          const resolver = fieldConfig.resolve || context.defaultFieldResolver
          const fieldValue = resolver(source, args, context, info)
          return markdownToHtml(fieldValue)
        },
      }
    },
  })
  actions.createFieldExtension({
    name: 'plain',
    extend(options, fieldConfig) {
      return {
        resolve(source, args, context, info) {
          const resolver = fieldConfig.resolve || context.defaultFieldResolver
          const fieldValue = resolver(source, args, context, info)
          return stripMarkdown(fieldValue)
        },
      }
    },
  })
  actions.createFieldExtension({
    name: 'slug',
    args: {
      from: 'String',
    },
    extend(options, fieldConfig) {
      return {
        resolve(source, args, context, info) {
          const resolver = fieldConfig.resolve || context.defaultFieldResolver
          const fieldValue = resolver(source, args, context, info)
          if (fieldValue) return fieldValue
          if (options.from) return slugify(source[options.from])
          return null
        },
      }
    },
  })

  actions.createTypes(`
    type SiteRoute {
      displayName: String
      name: String
      path: String
      top: Boolean
    }

    type SiteSearchVerification {
      key: String
      name: String
    }

    type SiteSocial {
      key: String
      name: String
      url: String
    }

    type SiteMetadata {
      author: String
      description: String
      email: String
      keywords: [String]
      lang: String
      paths: [SiteRoute]
      publishedAt: Date
      siteUrl: String!
      siteVerification: [SiteSearchVerification]
      social: [SiteSocial]
      title: String
      url: String
    }

    type Site implements Node @dontInfer {
      buildTime: Date
      pathPrefix: String
      siteMetadata: SiteMetadata
    }

    type SitePage implements Node @dontInfer {
      path: String!
    }

    type SitePlugin implements Node @dontInfer {
      id: ID!
    }

    type Category implements Node @dontInfer {
      description: String @plain
      descriptionHtml: String @md @proxy(from: "description")
      name: String!
      image: File @fileByRelativePath
      posts: [Mdx] @link(by: "frontmatter.categories.slug", from: "slug")
      slug: String! @slug(from: "name")
    }

    type Person implements Node @dontInfer {
      avatar: File @defaultValue(value: "../images/authors/default.png") @fileByRelativePath
      description: String @plain
      descriptionHtml: String @md @proxy(from: "description")
      email: String
      linkedin: String
      name: String!
      orcid: String
      posts: [Mdx] @link(by: "frontmatter.authors.slug", from: "slug")
      slug: String! @slug(from: "name")
      title: String
      twitter: String
      website: String
    }

    type Tag implements Node @dontInfer {
      description: String @plain
      descriptionHtml: String @md @proxy(from: "description")
      name: String!
      posts: [Mdx] @link(by: "frontmatter.tags.slug", from: "slug")
      slug: String! @slug(from: "name")
    }

    type License implements Node @dontInfer {
      name: String
      url: String
    }

    type Resource implements Node @dontInfer {
      icon: String
      name: String
      slug: String
    }

    type Organisation implements Node @dontInfer {
      logo: File @fileByRelativePath
      name: String
      slug: String
      url: String
    }

    type Frontmatter {
      abstract: String
      authors: [Person!] @defaultValue(values: ["dariah"]) @link(by: "slug")
      categories: [Category!] @link(by: "slug")
      contributors: [Person!] @link(by: "slug")
      date: Date @dateformat(formatString: "MMM, DD YYYY")
      dateModified: Date @dateformat(formatString: "MMM, DD YYYY") @proxy(from: "fields.lastUpdated", fromNode: true)
      domain: String @defaultValue(value: "Social Sciences and Humanities")
      editors: [Person!] @link(by: "slug")
      featuredImage: File @fileByRelativePath
      isoDate: Date @proxy(from: "date")
      lang: String @defaultValue(value: "en")
      license: License @defaultValue(value: "CCBY 4.0") @link(by: "name")
      pid: ID
      slug: String @slug(from: "title")
      tags: [Tag!] @link(by: "slug")
      """ one of ["Data managers", "Domain researchers", "Data service engineers", "Data scientists/analysts"] """
      targetGroup: String
      title: String!
      toc: Boolean
      type: Resource @link(by: "slug")
      version: String

      # Event metadata
      logo: File @fileByRelativePath
      partners: [Organisation!] @link(by: "slug")
      social: [SiteSocial!]
      synthesis: File @fileByRelativePath

      # Event session metadata
      number: Int!
      speakers: [Person!] @link(by: "slug")
    }

    type Mdx implements Node {
      fileInfo: File @link(from: "parent")
      frontmatter: Frontmatter
    }

    type FeaturedVideo implements Node @dontInfer {
      id: String
      image: File @fileByRelativePath
      subtitle: String
      title: String
    }
  `)
}

exports.onCreateNode = ({ node, actions, reporter }) => {
  if (node.internal.type !== 'File') return
  if (!/.mdx?$/.test(node.absolutePath)) return

  reporter.info(`Getting timestamp for ${node.absolutePath}`)
  let lastUpdated

  try {
    lastUpdated = new Date(getLastUpdatedTimestamp(node.absolutePath))
  } catch (error) {
    reporter.error(
      `Could not get timestamp from ${node.absolutePath}. Error: ${error}`
    )
  }

  actions.createNodeField({
    node,
    name: 'lastUpdated',
    value: lastUpdated,
  })
}

exports.createPages = async ({ actions, graphql }) => {
  const { data, errors } = await graphql(`
    query {
      posts: allMdx(
        filter: {
          fileInfo: {
            sourceInstanceName: { in: ["posts", "events"] }
            name: { eq: "index" }
          }
        }
        sort: {
          fields: [frontmatter___isoDate, frontmatter___title]
          order: [DESC, ASC]
        }
      ) {
        nodes {
          id
          fileInfo {
            # name
            relativeDirectory
            sourceInstanceName
          }
          frontmatter {
            categories {
              slug
            }
            slug
            tags {
              slug
            }
          }
        }
        byAuthor: group(field: frontmatter___authors___slug) {
          count: totalCount
          slug: fieldValue
        }
        byCategory: group(field: frontmatter___categories___slug) {
          count: totalCount
          slug: fieldValue
        }
        byTag: group(field: frontmatter___tags___slug) {
          count: totalCount
          slug: fieldValue
        }
      }
      categories: allCategory(sort: { fields: [name], order: [ASC] }) {
        count: totalCount
      }
      persons: allPerson(sort: { fields: [name], order: [ASC] }) {
        count: totalCount
      }
      tags: allTag(sort: { fields: [name], order: [ASC] }) {
        count: totalCount
      }
      site {
        siteMetadata {
          paths {
            name
            path
          }
        }
      }
      events: allMdx(
        filter: { fileInfo: { sourceInstanceName: { eq: "events" } } }
      ) {
        group(field: fileInfo___relativeDirectory) {
          directory: fieldValue
          nodes {
            id
            fileInfo {
              name
              relativeDirectory
            }
            frontmatter {
              slug
            }
          }
        }
      }
      docs: allMdx(
        filter: {
          fileInfo: {
            name: { nin: ["Sample-resource"] }
            sourceInstanceName: { eq: "docs" }
          }
        }
      ) {
        nodes {
          fileInfo {
            name
          }
          frontmatter {
            slug
          }
          id
        }
      }
    }
  `)

  if (errors) {
    throw errors
  }

  const { paths } = data.site.siteMetadata

  const posts = data.posts.nodes
  const postsBasePath = paths.find(route => route.name === 'post').path
  posts.forEach(({ id, fileInfo, frontmatter }) => {
    switch (fileInfo.sourceInstanceName) {
      case 'posts': {
        actions.createPage({
          path: createPath(postsBasePath, frontmatter.slug),
          component: path.resolve('./src/templates/post.js'),
          context: {
            categories: frontmatter.categories
              ? frontmatter.categories.map(category => category.slug)
              : [],
            id,
            imageFolder: `${fileInfo.relativeDirectory}/images`,
            tags: frontmatter.tags ? frontmatter.tags.map(tag => tag.slug) : [],
          },
        })
      }

      case 'events': {
        // Events are handled below for now
      }

      default:
    }
  })

  const docs = data.docs.nodes
  const docsBasePath = paths.find(route => route.name === 'docs').path
  docs.forEach(({ id, fileInfo, frontmatter }) => {
    const docsPath =
      fileInfo.name === 'index'
        ? '/about'
        : createPath(docsBasePath, frontmatter.slug)
    actions.createPage({
      path: docsPath,
      component: path.resolve('./src/templates/docs.js'),
      context: {
        id,
      },
    })
  })

  const postsPreviews = Math.ceil(posts.length / POSTS_PER_PAGE)
  const postsPreviewsBasePath = paths.find(route => route.name === 'posts').path
  range(postsPreviews).forEach(page => {
    actions.createPage({
      path: createPath(postsPreviewsBasePath, page ? page + 1 : null),
      component: path.resolve('./src/templates/posts.js'),
      context: {
        skip: page * POSTS_PER_PAGE,
        limit: POSTS_PER_PAGE,
      },
    })
  })

  const postsByAuthor = data.posts.byAuthor
  const postsByAuthorBasePath = paths.find(route => route.name === 'author')
    .path
  postsByAuthor.forEach(({ count, slug }) => {
    const pages = Math.ceil(count / POSTS_PER_PAGE)
    range(pages).forEach(page => {
      actions.createPage({
        path: createPath(postsByAuthorBasePath, slug, page ? page + 1 : null),
        component: path.resolve('./src/templates/author.js'),
        context: {
          slug,
          skip: page * POSTS_PER_PAGE,
          limit: POSTS_PER_PAGE,
        },
      })
    })
  })

  const postsByCategory = data.posts.byCategory
  const postsByCategoryBasePath = paths.find(route => route.name === 'category')
    .path
  postsByCategory.forEach(({ count, slug }) => {
    const pages = Math.ceil(count / POSTS_PER_PAGE)
    range(pages).forEach(page => {
      actions.createPage({
        path: createPath(postsByCategoryBasePath, slug, page ? page + 1 : null),
        component: path.resolve('./src/templates/category.js'),
        context: {
          slug,
          skip: page * POSTS_PER_PAGE,
          limit: POSTS_PER_PAGE,
        },
      })
    })
  })

  const postsByTag = data.posts.byTag
  const postsByTagBasePath = paths.find(route => route.name === 'tag').path
  postsByTag.forEach(({ count, slug }) => {
    const pages = Math.ceil(count / POSTS_PER_PAGE)
    range(pages).forEach(page => {
      actions.createPage({
        path: createPath(postsByTagBasePath, slug, page ? page + 1 : null),
        component: path.resolve('./src/templates/tag.js'),
        context: {
          slug,
          skip: page * POSTS_PER_PAGE,
          limit: POSTS_PER_PAGE,
        },
      })
    })
  })

  const categories = data.categories.count
  const categoriesBasePath = paths.find(route => route.name === 'categories')
    .path
  const categoriesPages = Math.ceil(categories / POSTS_PER_PAGE)
  range(categoriesPages).forEach(page => {
    actions.createPage({
      path: createPath(categoriesBasePath, page ? page + 1 : null),
      component: path.resolve('./src/templates/categories.js'),
      context: {
        skip: page * POSTS_PER_PAGE,
        limit: POSTS_PER_PAGE,
      },
    })
  })

  const tags = data.tags.count
  const tagsBasePath = paths.find(route => route.name === 'tags').path
  const tagsPages = Math.ceil(tags / POSTS_PER_PAGE)
  range(tagsPages).forEach(page => {
    actions.createPage({
      path: createPath(tagsBasePath, page ? page + 1 : null),
      component: path.resolve('./src/templates/tags.js'),
      context: {
        skip: page * POSTS_PER_PAGE,
        limit: POSTS_PER_PAGE,
      },
    })
  })

  const events = data.events.group

  const eventBasePath = paths.find(route => route.name === 'post').path
  events.forEach(event => {
    const { directory, nodes } = event

    const index = nodes.find(node => node.fileInfo.name === 'index')
    const about = nodes.find(node => node.fileInfo.name === 'about')
    const prep = nodes.find(node => node.fileInfo.name === 'prep')
    const sessions = nodes.filter(node =>
      node.fileInfo.name.startsWith('session')
    )

    actions.createPage({
      path: createPath(eventBasePath, index.frontmatter.slug),
      component: path.resolve('./src/templates/event.js'),
      context: {
        indexId: index.id,
        aboutId: about && about.id,
        prepId: prep && prep.id,
        sessionIds: sessions.map(node => node.id),
        docsFolder: `${directory}/docs`,
        imageFolder: `${directory}/images`,
      },
    })
  })
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [
        path.resolve('./src'),
        path.resolve('./contents'),
        'node_modules',
      ],
    },
  })
}
