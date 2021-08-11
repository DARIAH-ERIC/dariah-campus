import { join } from 'path'

import * as YAML from 'js-yaml'
import type { VFile } from 'vfile'

import { createStaticImage } from '@/cms/utils/createStaticImage'
import type { Locale } from '@/i18n/i18n.config'
import { readFile } from '@/mdx/readFile'
import { readFolder } from '@/mdx/readFolder'
import type { FilePath } from '@/utils/ts/aliases'

const categoriesFolder = join(process.cwd(), 'content', 'categories')
const categoryExtension = '.yml'

export interface CategoryId {
  /** Slug. */
  id: string
}

type ID = CategoryId['id']

export interface CategoryYaml {
  name: string
  description: string
  image?: FilePath
  host?: string
}
export interface CategoryData extends Omit<CategoryYaml, 'image'> {
  image?:
    | FilePath
    | { src: FilePath; width: number; height: number; blurDataURL?: string }
}

export interface Category extends CategoryId, CategoryData {}

/**
 * Returns all category ids (slugs).
 */
export async function getCategoryIds(_locale: Locale): Promise<Array<string>> {
  const ids = await readFolder(categoriesFolder, categoryExtension)

  return ids
}

/**
 * Returns category data.
 */
export async function getCategoryById(
  id: ID,
  locale: Locale,
): Promise<Category> {
  const file = await getCategoryFile(id, locale)
  const data = await getCategoryData(file, locale)

  if (
    typeof data.image === 'string' &&
    data.image.length > 0 &&
    file.path != null
  ) {
    data.image = await createStaticImage(data.image, file.path)
  }

  return { id, ...data }
}

/**
 * Returns data for all categories, sorted by name.
 */
export async function getCategories(locale: Locale): Promise<Array<Category>> {
  const ids = await getCategoryIds(locale)

  const data = await Promise.all(
    ids.map(async (id) => {
      return getCategoryById(id, locale)
    }),
  )

  return data
}

/**
 * Reads category file.
 */
async function getCategoryFile(id: ID, locale: Locale): Promise<VFile> {
  const filePath = getCategoryFilePath(id, locale)
  const file = await readFile(filePath)

  return file
}

/**
 * Returns file path for category.
 */
export function getCategoryFilePath(id: ID, _locale: Locale): FilePath {
  const filePath = join(categoriesFolder, id + categoryExtension)

  return filePath
}

/**
 * Returns category data.
 */
async function getCategoryData(
  file: VFile,
  _locale: Locale,
): Promise<CategoryData> {
  const data = YAML.load(String(file), {
    schema: YAML.CORE_SCHEMA,
  }) as CategoryData

  return data
}
