const remark = require('remark')
const html = require('remark-html')

exports.markdownToHtml = async str => {
  if (!str) return null

  const processed = await remark()
    .use(html)
    .process(str)

  return processed.contents
}
