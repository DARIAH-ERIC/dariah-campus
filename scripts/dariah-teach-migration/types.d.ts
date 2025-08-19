declare module "vfile" {
	interface DataMap {
		matter: {
			title?: string | undefined;
		};
	}
}

export type FrontmatterData = Record<string, unknown>;

export type FrontmatterTransformer<T, R> = (input: T) => R;
