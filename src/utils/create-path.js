exports.createPath = (...args) =>
  args
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '') || '/'
