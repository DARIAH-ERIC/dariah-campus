/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/ban-ts-comment */
// @ts-nocheck

const checkLinks = require('check-links')
const get = require('dlv')
const { load } = require('js-yaml')
const lintRule = require('unified-lint-rule')
const visit = require('unist-util-visit')

/** @typedef {{ fields?: Array<string> }} Options */

async function transformer(tree, file, /** Options */ options = {}) {
  /** @type {Record<string, Array<string>>} */
  const urls = {}

  function add(value, node) {
    if (
      typeof value === 'string' &&
      value.length > 0 &&
      !value.startsWith('http://localhost')
    ) {
      if (urls[value] == null) {
        urls[value] = []
      }
      urls[value].push(node)
    }
  }

  visit(
    tree,
    ['yaml', 'mdxJsxFlowElement', 'link', 'image', 'definition'],
    (node) => {
      switch (node.type) {
        case 'yaml': {
          if (!Array.isArray(options.fields)) {
            console.error(
              '[remark-lint-check-dead-urls] Please provide metadate fields to check.',
            )
            break
          }

          const metadata = load(node.value)
          if (metadata == null || typeof metadata !== 'object') return

          options.fields.forEach((field) => {
            add(get(metadata, field), node)
          })

          break
        }

        case 'mdxJsxFlowElement': {
          if (['ExternalResource'].includes(node.name)) {
            const href = node.attributes.find((attribute) => {
              return attribute.name === 'url'
            })?.value

            add(href, node)
          }

          break
        }

        /** 'link', 'image', 'definition' */
        default: {
          add(node.url, node)
        }
      }
    },
  )

  const results = await checkLinks(Object.keys(urls))

  Object.entries(results).forEach(([url, { status }]) => {
    if (status === 'dead') {
      for (const node of urls[url]) {
        file.message(`Link to ${url} is dead`, node)
      }
    }
  })
}

module.exports = lintRule('remark-lint:no-dead-urls', transformer)
