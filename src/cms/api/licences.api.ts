import { join } from "node:path";

import { type VFile } from "vfile";
import * as YAML from "yaml";

import { type Locale } from "@/i18n/i18n.config";
import { readFile } from "@/mdx/readFile";
import { readFolder } from "@/mdx/readFolder";
import { type FilePath, type UrlString } from "@/utils/ts/aliases";

const licencesFolder = join(process.cwd(), "content", "licences");
const licenceExtension = ".yml";

export interface LicenceId {
	/** Slug. */
	id: string;
}

type ID = LicenceId["id"];

export interface LicenceData {
	name: string;
	url: UrlString;
}

export interface Licence extends LicenceId, LicenceData {}

/**
 * Returns all licence ids (slugs).
 */
export async function getLicenceIds(_locale: Locale): Promise<Array<string>> {
	const ids = await readFolder(licencesFolder, licenceExtension);

	return ids;
}

/**
 * Returns licence data.
 */
export async function getLicenceById(id: ID, locale: Locale): Promise<Licence> {
	const file = await getLicenceFile(id, locale);
	const data = await getLicenceData(file, locale);

	return { id, ...data };
}

/**
 * Returns data for all licences, sorted by name.
 */
export async function getLicences(locale: Locale): Promise<Array<Licence>> {
	const ids = await getLicenceIds(locale);

	const data = await Promise.all(
		ids.map(async (id) => {
			return getLicenceById(id, locale);
		}),
	);

	return data;
}

/**
 * Reads licence file.
 */
async function getLicenceFile(id: ID, locale: Locale): Promise<VFile> {
	const filePath = getLicenceFilePath(id, locale);
	const file = await readFile(filePath);

	return file;
}

/**
 * Returns file path for licence.
 */
export function getLicenceFilePath(id: ID, _locale: Locale): FilePath {
	const filePath = join(licencesFolder, id + licenceExtension);

	return filePath;
}

/**
 * Returns licence data.
 */
async function getLicenceData(file: VFile, _locale: Locale): Promise<LicenceData> {
	const data = YAML.parse(String(file)) as LicenceData;

	return data;
}
