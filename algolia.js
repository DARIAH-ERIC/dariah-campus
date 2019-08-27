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
          }
          tags {
            name
          }
          title
        }
        objectID: id
        # text
      }
    }
  }
`

const queries = [
  {
    query,
    transformer: ({ data }) => data.resources.nodes,
  },
]

module.exports = queries
