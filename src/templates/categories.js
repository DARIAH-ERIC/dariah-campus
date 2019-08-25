import React from 'react'
import { graphql } from 'gatsby'

import CategoryPreview from 'components/CategoryPreview/CategoryPreview'
import Head from 'components/Head/Head'
import Pagination from 'components/Pagination/Pagination'

import Grid from 'elements/Grid/Grid'
import LeadIn from 'elements/LeadIn/LeadIn'
import Page from 'elements/Page/Page'
import Title from 'elements/Title/Title'

const CategoriesTemplate = ({ data }) => (
  <Page>
    <Head title="Sources" />
    <Title>Sources</Title>
    <LeadIn>
      DARIAH learning resources don't all live in one place. Here you can
      explore our materials based on the context in which they were produced.
    </LeadIn>
    <Grid columns="large">
      {data.categories.nodes.map((category, i, categories) => (
        <CategoryPreview
          key={category.id}
          {...category}
          previous={categories[i - 1]}
          next={categories[i + 1]}
        />
      ))}
    </Grid>
    <Pagination path="categories" {...data.categories.pageInfo} />
  </Page>
)

export default CategoriesTemplate

export const query = graphql`
  query($skip: Int!, $limit: Int!) {
    categories: allCategory(
      limit: $limit
      skip: $skip
      sort: { fields: [name], order: [ASC] }
    ) {
      nodes {
        description
        id
        image {
          image: childImageSharp {
            # var(--grid-column-width-large)
            fluid(maxWidth: 420) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        name
        posts {
          id
        }
        slug
      }
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        pageCount
      }
    }
  }
`
