const query = `
  query {
    resources: allMdx(
      filter: {
        fileInfo: {
          name: { eq: "index" }
          sourceInstanceName: { in: ["posts", "events"] } }
        }
    ) {
      nodes {
        frontmatter {
          abstract
          authors {
            name
            slug
          }
          date
          slug
          tags {
            name
            slug
          }
          title
        }
        objectID: id
      }
    }
  }
`

const queries = [
  {
    query,
    transformer: ({ data }) =>
      data.resources.nodes.map(({ frontmatter, objectID }) => ({
        ...frontmatter,
        date: new Date(frontmatter.date).getTime(),
        objectID,
      })),
  },
]

module.exports = queries
