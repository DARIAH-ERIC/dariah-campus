import { join } from 'path'

import * as YAML from 'js-yaml'
import type { VFile } from 'vfile'

import { createStaticImage } from '@/cms/utils/createStaticImage'
import type { Locale } from '@/i18n/i18n.config'
import { readFile } from '@/mdx/readFile'
import { readFolder } from '@/mdx/readFolder'
import type { FilePath } from '@/utils/ts/aliases'

const peopleFolder = join(process.cwd(), 'content', 'people')
const personExtension = '.yml'

export interface PersonId {
  /** Slug. */
  id: string
}

type ID = PersonId['id']

export interface PersonYaml {
  firstName: string
  lastName: string
  title?: string
  description?: string
  avatar?: FilePath
  email?: string
  twitter?: string
  website?: string
  orcid?: string
}

export interface PersonData extends Omit<PersonYaml, 'avatar'> {
  avatar?:
    | FilePath
    | { src: FilePath; width: number; height: number; blurDataURL?: string }
}

export interface Person extends PersonId, PersonData {}

/**
 * Returns all person ids (slugs).
 */
export async function getPersonIds(_locale: Locale): Promise<Array<string>> {
  const ids = await readFolder(peopleFolder, personExtension)

  return ids
}

/**
 * Returns person data.
 */
export async function getPersonById(id: ID, locale: Locale): Promise<Person> {
  const file = await getPersonFile(id, locale)
  const data = await getPersonData(file, locale)

  if (
    typeof data.avatar === 'string' &&
    data.avatar.length > 0 &&
    file.path != null
  ) {
    data.avatar = await createStaticImage(data.avatar, file.path)
  }

  return { id, ...data }
}

/**
 * Returns data for all persons, sorted by lastname.
 */
export async function getPersons(locale: Locale): Promise<Array<Person>> {
  const ids = await getPersonIds(locale)

  const data = await Promise.all(
    ids.map(async (id) => {
      return getPersonById(id, locale)
    }),
  )

  data.sort((a, b) => {
    return a.lastName.localeCompare(b.lastName, locale)
  })

  return data
}

/**
 * Reads person file.
 */
async function getPersonFile(id: ID, locale: Locale): Promise<VFile> {
  const filePath = getPersonFilePath(id, locale)
  const file = await readFile(filePath)

  return file
}

/**
 * Returns file path for person.
 */
export function getPersonFilePath(id: ID, _locale: Locale): FilePath {
  const filePath = join(peopleFolder, id + personExtension)

  return filePath
}

/**
 * Returns person data.
 */
async function getPersonData(
  file: VFile,
  _locale: Locale,
): Promise<PersonData> {
  const data = YAML.load(String(file), {
    schema: YAML.CORE_SCHEMA,
  }) as PersonData

  return data
}
