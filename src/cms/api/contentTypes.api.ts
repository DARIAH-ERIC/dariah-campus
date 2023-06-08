import { join } from "node:path";

import { type VFile } from "vfile";
import * as YAML from "yaml";

import { type Locale } from "@/i18n/i18n.config";
import { readFile } from "@/mdx/readFile";
import { readFolder } from "@/mdx/readFolder";
import { type FilePath } from "@/utils/ts/aliases";

const contentTypesFolder = join(process.cwd(), "content", "contentTypes");
const contentTypeExtension = ".yml";

export interface ContentTypeId {
	/** Slug. */
	id: string;
}

type ID = ContentTypeId["id"];

export interface ContentTypeData {
	name: string;
}

export interface ContentType extends ContentTypeId, ContentTypeData {}

/**
 * Returns all contentType ids (slugs).
 */
export async function getContentTypeIds(_locale: Locale): Promise<Array<string>> {
	const ids = await readFolder(contentTypesFolder, contentTypeExtension);

	return ids;
}

/**
 * Returns contentType data.
 */
export async function getContentTypeById(id: ID, locale: Locale): Promise<ContentType> {
	const file = await getContentTypeFile(id, locale);
	const data = await getContentTypeData(file, locale);

	return { id, ...data };
}

/**
 * Returns data for all contentTypes, sorted by name.
 */
export async function getContentTypes(locale: Locale): Promise<Array<ContentType>> {
	const ids = await getContentTypeIds(locale);

	const data = await Promise.all(
		ids.map(async (id) => {
			return getContentTypeById(id, locale);
		}),
	);

	return data;
}

/**
 * Reads contentType file.
 */
async function getContentTypeFile(id: ID, locale: Locale): Promise<VFile> {
	const filePath = getContentTypeFilePath(id, locale);
	const file = await readFile(filePath);

	return file;
}

/**
 * Returns file path for contentType.
 */
export function getContentTypeFilePath(id: ID, _locale: Locale): FilePath {
	const filePath = join(contentTypesFolder, id + contentTypeExtension);

	return filePath;
}

/**
 * Returns contentType data.
 */
async function getContentTypeData(file: VFile, _locale: Locale): Promise<ContentTypeData> {
	const data = YAML.parse(String(file)) as ContentTypeData;

	return data;
}
