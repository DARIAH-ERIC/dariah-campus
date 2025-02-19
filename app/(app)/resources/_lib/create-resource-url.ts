export function createResourceUrl(resource: { id: string; collection: string }): string {
	return `/resources/${resource.collection.slice(10)}/${resource.id}`;
}
