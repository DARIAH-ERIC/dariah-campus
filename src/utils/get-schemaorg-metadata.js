export const getSchemaOrgMetadata = ({
  article,
  canonicalUrl,
  isArticle,
  location,
  site,
}) => {
  const createId = id => site.siteUrl + '/#' + id

  const schemaWebpageOwnerId = createId('dariah-campus')
  const schemaWebpageOwner = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    '@id': schemaWebpageOwnerId,
    description: site.description,
    email: site.email,
    image: {
      '@type': 'ImageObject',
      // height: '',
      url: `${site.siteUrl}${site.logo.publicURL}`, // FIXME: should be better quality
      // width: '',
    },
    logo: {
      '@type': 'ImageObject',
      // height: site.logo.image.height,
      url: `${site.siteUrl}${site.logo.publicURL}`,
      // width: '',
    },
    name: site.author,
    sameAs: site.social
      .filter(entry => ['twitter', 'github'].includes(entry.name))
      .map(entry => entry.url),
    url: site.url,
  }

  const schemaWebpage = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    author: {
      '@id': schemaWebpageOwnerId,
    },
    copyrightHolder: {
      '@id': schemaWebpageOwnerId,
    },
    copyrightYear: '2019',
    creator: {
      '@id': schemaWebpageOwnerId,
    },
    dateModified: site.buildTime,
    datePublished: site.publishedAt,
    description: site.description,
    headline: site.title,
    image: {
      '@type': 'ImageObject',
      // height: '',
      url: site.logo.publicURL,
      // width: '',
    },
    inLanguage: site.lang,
    keywords: site.keywords.join(', '),
    name: site.title,
    publisher: {
      '@id': schemaWebpageOwnerId,
    },
    url: site.siteUrl,
  }

  if (!isArticle) {
    schemaWebpage.mainEntityOfPage = canonicalUrl
  }

  const schemaBreadcrumbs = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    description: 'Breadcrumbs list',
    name: 'Breadcrumbs',
    itemListElement: [
      {
        '@type': 'ListItem',
        item: {
          '@id': site.siteUrl,
          name: 'Homepage',
        },
        position: 1,
      },
    ],
  }

  if (isArticle) {
    schemaBreadcrumbs.itemListElement.push({
      '@type': 'ListItem',
      item: {
        '@id': canonicalUrl,
        name: article.title,
      },
      position: 2,
    })
  } else {
    const pagePath = site.paths.find(route => route.path === location.path)
    if (pagePath && pagePath.displayName !== 'Home') {
      schemaBreadcrumbs.itemListElement.push({
        '@type': 'ListItem',
        item: {
          '@id': canonicalUrl,
          name: pagePath.displayName,
        },
        position: 2,
      })
    }
  }

  let schemaArticle
  const schemaArticleAuthors = []
  const schemaArticleAuthorIds = []

  if (isArticle) {
    ;(article.authors || []).forEach(author => {
      if (author.slug === 'dariah') {
        schemaArticleAuthorIds.push(schemaWebpageOwnerId)
      } else {
        const id = createId(author.slug)
        schemaArticleAuthorIds.push(id)

        const schemaAuthor = {
          '@context': 'http://schema.org',
          '@type': 'Person',
          '@id': id,
          name: author.name,
          description: author.description,
          email: author.email,
          jobTitle: author.title,
        }

        if (author.twitter) {
          schemaAuthor.sameAs = [`https://twitter.com/${author.twitter}`]
        }

        schemaArticleAuthors.push(schemaAuthor)
      }
    })

    schemaArticle = {
      '@context': 'http://schema.org',
      '@type': 'Article',
      copyrightYear: article.isoDate,
      dateModified: article.isoDate, // More correct would be fileInfo.mtime
      datePublished: article.isoDate,
      description: article.description,
      headline: article.title,
      inLanguage: article.lang || 'en',
      mainEntityOfPage: canonicalUrl,
      name: article.title,
      publisher: {
        '@id': schemaWebpageOwnerId,
      },
      url: canonicalUrl,
    }

    if (schemaArticleAuthorIds.length > 1) {
      schemaArticle.author = []
      schemaArticle.copyrightHolder = []
      schemaArticle.creator = []

      schemaArticleAuthorIds.forEach(id => {
        schemaArticle.author.push({
          '@id': id,
        })
        schemaArticle.copyrightHolder.push({
          '@id': id,
        })
        schemaArticle.creator.push({
          '@id': id,
        })
      })
    } else if (schemaArticleAuthorIds.length) {
      schemaArticle.author = {
        '@id': schemaArticleAuthorIds[0],
      }
      schemaArticle.copyrightHolder = {
        '@id': schemaArticleAuthorIds[0],
      }
      schemaArticle.creator = {
        '@id': schemaArticleAuthorIds[0],
      }
    }

    if (article.categories) {
      schemaArticle.articleSections = article.categories
        .map(category => category.name)
        .join(', ')
    }
    if (article.image) {
      schemaArticle.image = {
        '@type': 'ImageObject',
        // height: '',
        url: article.image.publicURL,
        // width: '',
      }
    }
    if (article.tags) {
      schemaArticle.keywords = article.tags.map(tag => tag.name).join(', ')
    }
  }

  const routes = site.paths.filter(route => route.top)
  const schemaSiteNav = {
    '@context': 'http://schema.org',
    '@type': 'SiteNavigationElement',
    name: routes.map(route => route.displayName),
    url: routes.map(route => route.path),
  }

  return {
    schemaArticle,
    schemaArticleAuthors,
    schemaBreadcrumbs,
    schemaSiteNav,
    schemaWebpage,
    schemaWebpageOwner,
  }
}
