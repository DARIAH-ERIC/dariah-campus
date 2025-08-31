export interface CurriculumMetadata {
	id: string;
	collection: "curriculum";
	version: string;
	pid: string;
	title: string;
	summary: { title: string; content: string };
	license: string;
	locale: string;
	translations: Array<string>;
	"publication-date": string;
	"content-type": "curriculum";
	tags: Array<{ id: string; name: string }>;
	editors: Array<{ id: string; name: string; orcid: string | null }>;
	resources: Array<{ id: string; collection: string }>;
}

declare const curricula: Array<CurriculumMetadata>;

export default curricula;
