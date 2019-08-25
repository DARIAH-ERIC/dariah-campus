exports.slugify = str =>
  String(str)
    .toLowerCase()
    .replace(/[^\w/]+/g, '-')
    .replace(/^-|-$/g, '')
