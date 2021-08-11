import { join } from 'path'

import * as YAML from 'js-yaml'
import type { VFile } from 'vfile'

import { createStaticImage } from '@/cms/utils/createStaticImage'
import type { Locale } from '@/i18n/i18n.config'
import { readFile } from '@/mdx/readFile'
import { readFolder } from '@/mdx/readFolder'
import type { FilePath, UrlString } from '@/utils/ts/aliases'

const organisationsFolder = join(process.cwd(), 'content', 'organisations')
const organisationExtension = '.yml'

export interface OrganisationId {
  /** Slug. */
  id: string
}

type ID = OrganisationId['id']

export interface OrganisationYaml {
  name: string
  url?: UrlString
  logo?: FilePath
}

export interface OrganisationData extends Omit<OrganisationYaml, 'logo'> {
  logo?:
    | FilePath
    | { src: FilePath; width: number; height: number; blurDataURL?: string }
}

export interface Organisation extends OrganisationId, OrganisationData {}

/**
 * Returns all organisation ids (slugs).
 */
export async function getOrganisationIds(
  _locale: Locale,
): Promise<Array<string>> {
  const ids = await readFolder(organisationsFolder, organisationExtension)

  return ids
}

/**
 * Returns organisation data.
 */
export async function getOrganisationById(
  id: ID,
  locale: Locale,
): Promise<Organisation> {
  const file = await getOrganisationFile(id, locale)
  const data = await getOrganisationData(file, locale)

  if (
    typeof data.logo === 'string' &&
    data.logo.length > 0 &&
    file.path != null
  ) {
    data.logo = await createStaticImage(data.logo, file.path)
  }

  return { id, ...data }
}

/**
 * Returns data for all organisations, sorted by name.
 */
export async function getOrganisations(
  locale: Locale,
): Promise<Array<Organisation>> {
  const ids = await getOrganisationIds(locale)

  const data = await Promise.all(
    ids.map(async (id) => {
      return getOrganisationById(id, locale)
    }),
  )

  return data
}

/**
 * Reads organisation file.
 */
async function getOrganisationFile(id: ID, locale: Locale): Promise<VFile> {
  const filePath = getOrganisationFilePath(id, locale)
  const file = await readFile(filePath)

  return file
}

/**
 * Returns file path for organisation.
 */
export function getOrganisationFilePath(id: ID, _locale: Locale): FilePath {
  const filePath = join(organisationsFolder, id + organisationExtension)

  return filePath
}

/**
 * Returns organisation data.
 */
async function getOrganisationData(
  file: VFile,
  _locale: Locale,
): Promise<OrganisationData> {
  const data = YAML.load(String(file), {
    schema: YAML.CORE_SCHEMA,
  }) as OrganisationData

  return data
}
