const { createMatchPath, loadConfig } = require('tsconfig-paths')

const { postcss } = require('~/package.json')

const tsconfig = loadConfig()
const resolve = createMatchPath(
  tsconfig.absoluteBaseUrl,
  tsconfig.paths,
  tsconfig.mainFields,
  tsconfig.addMatchAll,
)

const config = {
  plugins: {
    /**
     * `postcss-import` is needed because in Next.js, `@import` statements are
     * handled by `webpack` (`css-loader`).
     */
    'postcss-import': {
      resolve(id) {
        return resolve(id) ?? require.resolve(id)
      },
    },
    ...postcss.plugins,
  },
}

module.exports = config
