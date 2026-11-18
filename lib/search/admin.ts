import { Result } from "better-result";
import { Client, Errors } from "typesense";

import { type ResourceDocument, resourcesCollection } from "#/lib/search/collections/resources.ts";
import {
	SearchApiKeyError,
	SearchCollectionError,
	SearchDocumentDeleteError,
	SearchDocumentUpsertError,
	SearchImportError,
} from "#/lib/search/errors.ts";

export type { ResourceDocument } from "#/lib/search/collections/resources.ts";

export interface CreateSearchAdminServiceParams {
	apiKey: string;
	nodes: Array<{ host: string; port: number; protocol: "http" | "https" }>;
	collections: {
		resources: string;
	};
}

// oxlint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createSearchAdminService(params: CreateSearchAdminServiceParams) {
	const { apiKey, collections, nodes } = params;

	const client = new Client({
		apiKey,
		nodes,
		/** Bulk imports of all documents can take a while. */
		connectionTimeoutSeconds: 60,
	});

	/**
	 * `collections.resources` is the name of an alias, which points to a versioned collection. Re-indexing builds a new
	 * versioned collection and only swaps the alias once ingestion has succeeded, so a failed run never leaves search
	 * empty.
	 */
	const alias = collections.resources;
	const versionPrefix = `${alias}__`;

	function isVersionedCollection(name: string): boolean {
		return name.startsWith(versionPrefix) && /^\d+$/.test(name.slice(versionPrefix.length));
	}

	async function collectionExists(name: string): Promise<boolean> {
		try {
			await client.collections(name).retrieve();
			return true;
		} catch (error) {
			if (error instanceof Errors.ObjectNotFound) {
				return false;
			}
			throw error;
		}
	}

	async function getAliasTarget(): Promise<string | null> {
		try {
			const { collection_name } = await client.aliases(alias).retrieve();
			return collection_name;
		} catch (error) {
			if (error instanceof Errors.ObjectNotFound) {
				return null;
			}
			throw error;
		}
	}

	/**
	 * Creates a new versioned collection, ingests `documents`, and points the alias at it. Previous versioned collections
	 * are deleted afterwards. When ingestion fails, the new collection is deleted and the alias is left untouched.
	 */
	async function replaceCollection(documents: Array<ResourceDocument>): Promise<void> {
		const name = `${versionPrefix}${String(Date.now())}`;

		await client.collections().create(resourcesCollection.schema(name));

		try {
			if (documents.length > 0) {
				await client.collections<ResourceDocument>(name).documents().import(documents, { action: "create" });
			}
		} catch (error) {
			await client
				.collections(name)
				.delete()
				.catch(() => {
					/** Leftovers are removed on the next successful run. */
				});
			throw error;
		}

		/**
		 * Typesense refuses to create an alias with the same name as an existing collection. Before aliases were
		 * introduced, documents were indexed directly into a collection named like the alias, which has to go first. This
		 * leaves search empty for the brief moment between deleting it and creating the alias, but only once.
		 */
		if ((await getAliasTarget()) == null && (await collectionExists(alias))) {
			await client.collections(alias).delete();
		}

		await client.aliases().upsert(alias, { collection_name: name });

		const existing = await client.collections().retrieve();
		for (const collection of existing) {
			if (collection.name !== name && isVersionedCollection(collection.name)) {
				await client.collections(collection.name).delete();
			}
		}
	}

	return {
		apiKeys: {
			create(): Promise<Result<string, SearchApiKeyError>> {
				return Result.tryPromise({
					async try() {
						const key = await client.keys().create({
							description: "Search API key",
							actions: ["documents:export", "documents:get", "documents:search"],
							collections: [collections.resources],
						});

						return key.value!;
					},
					catch(cause) {
						return new SearchApiKeyError({ cause });
					},
				});
			},
		},

		collections: {
			resources: {
				/** Ensures the alias exists, pointing to an empty collection if there is nothing to point to yet. */
				create(): Promise<Result<void, SearchCollectionError>> {
					return Result.tryPromise({
						async try() {
							if ((await getAliasTarget()) != null || (await collectionExists(alias))) {
								return;
							}

							await replaceCollection([]);
						},
						catch(cause) {
							return new SearchCollectionError({ cause });
						},
					});
				},

				/** Points the alias to a new, empty collection, and deletes previous ones. */
				reset(): Promise<Result<void, SearchCollectionError>> {
					return Result.tryPromise({
						async try() {
							await replaceCollection([]);
						},
						catch(cause) {
							return new SearchCollectionError({ cause });
						},
					});
				},

				/** Builds a new collection from `documents`, and swaps the alias only once ingestion has succeeded. */
				replace(documents: Array<ResourceDocument>): Promise<Result<void, SearchImportError>> {
					return Result.tryPromise({
						async try() {
							await replaceCollection(documents);
						},
						catch(cause) {
							return new SearchImportError({ cause });
						},
					});
				},

				upsert(document: ResourceDocument): Promise<Result<void, SearchDocumentUpsertError>> {
					return Result.tryPromise({
						async try() {
							await client.collections<ResourceDocument>(collections.resources).documents().upsert(document);
						},
						catch(cause) {
							return new SearchDocumentUpsertError({ cause });
						},
					});
				},

				delete(documentId: string): Promise<Result<void, SearchDocumentDeleteError>> {
					return Result.tryPromise({
						async try() {
							await client.collections<ResourceDocument>(collections.resources).documents(documentId).delete();
						},
						catch(cause) {
							return new SearchDocumentDeleteError({ cause });
						},
					});
				},
			},
		},
	};
}

export type SearchAdminService = ReturnType<typeof createSearchAdminService>;
