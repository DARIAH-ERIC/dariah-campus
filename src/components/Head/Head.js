import React from 'react'
import Helmet from 'react-helmet'
import { Location } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'

import { getSchemaOrgMetadata } from 'utils/get-schemaorg-metadata'

const Head = ({ article, type = 'website', ...page }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        buildTime
        siteMetadata {
          author
          description
          email
          keywords
          lang
          paths {
            displayName
            path
            top
          }
          publishedAt
          siteUrl
          siteVerification {
            name
            key
          }
          social {
            name
            key
            url
          }
          title
          url
        }
      }
      logo: file(relativePath: { eq: "dariah-flower.png" }) {
        image: childImageSharp {
          fixed(width: 1500, height: 1500) {
            src
            width
            height
          }
        }
        publicURL
      }
    }
  `)

  return (
    <Location>
      {({ location }) => {
        const isArticle = type === 'article'
        const site = {
          buildTime: data.site.buildTime,
          logo: data.logo,
          ...data.site.siteMetadata,
        }
        const canonicalUrl = site.siteUrl + location.pathname

        const {
          schemaArticle,
          schemaArticleAuthors,
          schemaBreadcrumbs,
          schemaSiteNav,
          schemaWebpage,
          schemaWebpageOwner,
        } = getSchemaOrgMetadata({
          article,
          canonicalUrl,
          isArticle,
          location,
          site,
        })

        const pageTitle = isArticle ? article.title : page.title
        const title = (pageTitle ? `${pageTitle} | ` : '') + site.title
        const language =
          (isArticle ? article.lang : page.lang) || site.lang || 'en'
        const description =
          (isArticle
            ? article.abstract || article.extract
            : page.description) || site.description

        const tags =
          (isArticle && article.tags
            ? article.tags.map(tag => tag.name)
            : page.keywords) || site.keywords
        const keywords = tags ? tags.join(', ') : ''

        const siteTwitter = site.social.find(
          account => account.name === 'twitter'
        )
        const siteTwitterHandle = siteTwitter && siteTwitter.key

        const authors = (isArticle && article.authors
          ? article.authors
          : page.authors) || [
          { name: site.author, slug: 'dariah', twitter: siteTwitterHandle },
        ]

        const image =
          (isArticle && article.image ? article.image : page.image) ||
          site.logo.image.fixed

        const googleSiteVerification = site.siteVerification.find(
          account => account.name === 'google'
        )
        const googleId = googleSiteVerification && googleSiteVerification.key

        const fbApp = site.siteVerification.find(
          account => account.name === 'facebook'
        )
        const fbAppId = fbApp && fbApp.key

        return (
          <>
            <Helmet>
              <html lang={language} />

              <title>{title}</title>
              <meta name="description" content={description} />
              <meta name="keywords" content={keywords} />
              {authors.map(author => (
                <meta key={author.slug} name="author" content={author.name} />
              ))}
              <link rel="canonical" href={canonicalUrl} />

              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:site" content={siteTwitterHandle} />
              {authors
                .map(author =>
                  author.twitter ? (
                    <meta
                      key={author.slug}
                      name="twitter:creator"
                      content={author.twitter}
                    />
                  ) : null
                )
                .filter(Boolean)}

              <meta property="og:url" content={canonicalUrl} />
              <meta property="og:title" content={pageTitle} />
              <meta property="og:description" content={description} />
              <meta property="og:type" content={type} />
              <meta property="og:locale" content={language} />
              <meta property="og:site_name" content={site.title} />

              <meta name="google-site-verification" content={googleId} />
              <meta property="fb:app_id" content={fbAppId} />

              <meta property="og:image" content={image.src} />
              <meta property="og:image:alt" content={image.alt} />
              <meta property="og:image:height" content={image.height} />
              <meta property="og:image:width" content={image.width} />

              {isArticle ? (
                <meta
                  property="article:published_time"
                  content={article.isoDate}
                />
              ) : null}

              {isArticle
                ? (article.authors || []).map(author => (
                    <meta
                      key={author.slug}
                      property="article:author"
                      content={author.name}
                    />
                  ))
                : null}

              {isArticle
                ? (article.tags || []).map(tag => (
                    <meta
                      key={tag.slug}
                      property="article:tag"
                      content={tag.name}
                    />
                  ))
                : null}

              <script key="schemaWebpageOwner" type="application/ld+json">
                {JSON.stringify(schemaWebpageOwner)}
              </script>

              <script key="schemaWebpage" type="application/ld+json">
                {JSON.stringify(schemaWebpage)}
              </script>

              {schemaArticleAuthors ? (
                schemaArticleAuthors.length > 1 ? (
                  schemaArticleAuthors.map((schemaArticleAuthor, i) => (
                    <script
                      key={`schemaArticleAuthor${i ? i : ''}`}
                      type="application/ld+json"
                    >
                      {JSON.stringify(schemaArticleAuthor)}
                    </script>
                  ))
                ) : (
                  <script key="schemaArticleAuthor" type="application/ld+json">
                    {JSON.stringify(schemaArticleAuthors[0])}
                  </script>
                )
              ) : null}

              {schemaArticle ? (
                <script key="schemaArticle" type="application/ld+json">
                  {JSON.stringify(schemaArticle)}
                </script>
              ) : null}

              <script key="schemaBreadcrumbs" type="application/ld+json">
                {JSON.stringify(schemaBreadcrumbs)}
              </script>

              <script key="schemaSiteNav" type="application/ld+json">
                {JSON.stringify(schemaSiteNav)}
              </script>

              {isArticle && article.license ? (
                <link rel="license" href={article.license.url} />
              ) : null}
            </Helmet>
          </>
        )
      }}
    </Location>
  )
}

export default Head
