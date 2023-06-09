import { type ResourceKind } from "@/cms/api/resources.api";

/**
 * Named routes. Defaults params are handled via `rewrites` in `next.config.js`.
 */
export const routes = {
	home() {
		return { pathname: "/" };
	},
	cms() {
		return { pathname: "/admin" };
	},
	resource({ kind, id }: { kind: ResourceKind; id: string }) {
		return { pathname: `/resource/${kind}/${id}` };
	},
	resources({ kind, page = 1 }: { kind?: ResourceKind; page?: number } = {}) {
		if (kind == null) return { pathname: `/resources/page/${page}` };
		return { pathname: `/resources/${kind}/page/${page}` };
	},
	course({ id }: { id: string }) {
		return { pathname: `/curriculum/${id}` };
	},
	courses({ page = 1 }: { page?: number } = {}) {
		return { pathname: `/curricula/page/${page}` };
	},
	author({ id, resourcePage = 1 }: { id: string; resourcePage?: number }) {
		return { pathname: `/author/${id}/page/${resourcePage}` };
	},
	authors({ page = 1 }: { page?: number } = {}) {
		return { pathname: `/authors/page/${page}` };
	},
	tag({ id, resourcePage = 1 }: { id: string; resourcePage?: number }) {
		return { pathname: `/tag/${id}/page/${resourcePage}` };
	},
	tags({ page = 1 }: { page?: number } = {}) {
		return { pathname: `/tags/page/${page}` };
	},
	category({ id, resourcePage = 1 }: { id: string; resourcePage?: number }) {
		return { pathname: `/source/${id}/page/${resourcePage}` };
	},
	categories({ page = 1 }: { page?: number } = {}) {
		return { pathname: `/sources/page/${page}` };
	},
	courseRegistry() {
		return { pathname: "/course-registry" };
	},
	docs({ id }: { id: string }) {
		return { pathname: `/docs/${id}` };
	},
	imprint() {
		return { pathname: "/imprint" };
	},
} as const;
