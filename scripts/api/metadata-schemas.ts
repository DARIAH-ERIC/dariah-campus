import * as v from "valibot";

export const curriculumMetadataSchema = v.object({
	id: v.string(),
	collection: v.literal("curriculum"),
	version: v.string(),
	pid: v.string(),
	title: v.string(),
	summary: v.object({ title: v.string(), content: v.string() }),
	license: v.string(),
	locale: v.string(),
	translations: v.array(v.string()),
	"publication-date": v.string(),
	"content-type": v.literal("curriculum"),
	tags: v.array(v.object({ id: v.string(), name: v.string() })),
	editors: v.array(v.object({ id: v.string(), name: v.string(), orcid: v.nullable(v.string()) })),
	resources: v.array(v.object({ id: v.string(), collection: v.string() })),
	domain: v.string(),
	"target-group": v.string(),
	"dariah-national-consortia": v.optional(
		v.array(v.object({ code: v.string(), "sshoc-marketplace-id": v.string() })),
		[],
	),
	"dariah-working-groups": v.optional(
		v.array(v.object({ slug: v.string(), "sshoc-marketplace-id": v.string() })),
		[],
	),
});

export type CurriculumMetadata = v.InferOutput<typeof curriculumMetadataSchema>;

export const resourceMetadataSchema = v.object({
	id: v.string(),
	collection: v.picklist([
		"resourcesEvents",
		"resourcesExternal",
		"resourcesHosted",
		"resourcesPathfinders",
	]),
	kind: v.picklist(["event", "external", "hosted", "pathfinder"]),
	version: v.string(),
	pid: v.string(),
	title: v.string(),
	summary: v.object({ title: v.string(), content: v.string() }),
	license: v.string(),
	locale: v.string(),
	translations: v.array(v.string()),
	"publication-date": v.string(),
	"content-type": v.string(),
	tags: v.array(v.object({ id: v.string(), name: v.string() })),
	authors: v.array(v.object({ id: v.string(), name: v.string(), orcid: v.nullable(v.string()) })),
	editors: v.array(v.object({ id: v.string(), name: v.string(), orcid: v.nullable(v.string()) })),
	contributors: v.array(
		v.object({ id: v.string(), name: v.string(), orcid: v.nullable(v.string()) }),
	),
	sources: v.array(v.object({ id: v.string(), name: v.string() })),
	domain: v.string(),
	"target-group": v.string(),
	"dariah-national-consortia": v.optional(
		v.array(v.object({ code: v.string(), "sshoc-marketplace-id": v.string() })),
		[],
	),
	"dariah-working-groups": v.optional(
		v.array(v.object({ slug: v.string(), "sshoc-marketplace-id": v.string() })),
		[],
	),
});

export type ResourceMetadata = v.InferOutput<typeof resourceMetadataSchema>;
