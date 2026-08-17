import { Result } from "better-result";
import { Client } from "typesense";

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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createSearchAdminService(params: CreateSearchAdminServiceParams) {
	const { apiKey, collections, nodes } = params;

	const client = new Client({
		apiKey,
		nodes,
		connectionTimeoutSeconds: 5,
	});

	async function collectionExists(name: string): Promise<boolean> {
		try {
			await client.collections(name).retrieve();
			return true;
		} catch {
			return false;
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
				create(): Promise<Result<void, SearchCollectionError>> {
					return Result.tryPromise({
						async try() {
							if (await collectionExists(collections.resources)) {
								return;
							}

							await client.collections().create(resourcesCollection.schema(collections.resources));
						},
						catch(cause) {
							return new SearchCollectionError({ cause });
						},
					});
				},

				reset(): Promise<Result<void, SearchCollectionError>> {
					return Result.tryPromise({
						async try() {
							if (await collectionExists(collections.resources)) {
								await client.collections(collections.resources).delete();
							}

							await client.collections().create(resourcesCollection.schema(collections.resources));
						},
						catch(cause) {
							return new SearchCollectionError({ cause });
						},
					});
				},

				ingest(documents: Array<ResourceDocument>): Promise<Result<void, SearchImportError>> {
					return Result.tryPromise({
						async try() {
							await client
								.collections<ResourceDocument>(collections.resources)
								.documents()
								.import(documents, { action: "upsert" });
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
