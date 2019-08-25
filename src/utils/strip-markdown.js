const remark = require('remark')
const strip = require('strip-markdown')

exports.stripMarkdown = async str => {
  if (!str) return null

  const processed = await remark()
    .use(strip)
    .process(str)

  return processed.contents
}
