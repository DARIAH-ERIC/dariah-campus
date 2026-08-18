import type { AppRoutes, ParamMap } from "#/.next/types/routes.js";

/** Route patterns which take no dynamic segments. */
type StaticRoute = { [K in AppRoutes]: keyof ParamMap[K] extends never ? K : never }[AppRoutes];
/** Route patterns which take at least one dynamic segment. */
type DynamicRoute = Exclude<AppRoutes, StaticRoute>;

export function route(pathname: StaticRoute): string;
export function route<T extends DynamicRoute>(pathname: T, params: ParamMap[T]): string;
export function route(pathname: AppRoutes, params?: Record<string, unknown>): string {
	if (params == null) return pathname;

	return pathname.replace(/\[\[?\.{0,3}(?<param>[^\]]+?)\]?\]/g, (_match, param: string) => {
		const value = params[param];

		return Array.isArray(value)
			? value.map(String).map(encodeURIComponent).join("/")
			: encodeURIComponent(String(value));
	});
}
