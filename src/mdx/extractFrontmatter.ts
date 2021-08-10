import * as YAML from 'js-yaml'
import type { VFile } from 'vfile'
import matter from 'vfile-matter'

/**
 * Extracts YAML frontmatter from `VFile`.
 *
 * This mutates the input file: parsed frontmatter will be available on `file.data.matter`.
 */
export function extractFrontmatter(file: VFile): VFile {
  return matter(file, {
    strip: true,
    /**
     * Use Core Schema for parsing yaml, so dates are parsed as strings, not `Date`
     * objects, since Next.js does not allow serializing `Date` objects in `getStaticProps`.
     */
    yaml: { schema: YAML.CORE_SCHEMA },
  })
}
