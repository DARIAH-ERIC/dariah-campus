export interface ResourceMetadata {
	id: string;
	collection: "resourcesEvents" | "resourcesExternal" | "resourcesHosted" | "resourcesPathfinders";
	kind: "event" | "external" | "hosted" | "pathfinder";
	version: string;
	pid: string;
	title: string;
	summary: { title: string; content: string };
	license: string;
	locale: string;
	translations: Array<string>;
	"publication-date": string;
	"content-type": string;
	tags: Array<{ id: string; name: string }>;
	authors: Array<{ id: string; name: string; orcid: string | null }>;
	editors: Array<{ id: string; name: string; orcid: string | null }>;
	contributors: Array<{ id: string; name: string; orcid: string | null }>;
	sources: Array<{ id: string; name: string }>;
}

declare const resources: Array<ResourceMetadata>;

export default resources;
