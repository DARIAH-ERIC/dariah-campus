import { type Locale } from "@/i18n/i18n.config";

export type Dictionary = Record<string, unknown>;

/**
 * Loads dictionary with translations for the specified locale.
 *
 * Must only be used in `getStaticProps` or `getServerSideProps`.
 * To load translations client-side, fetch them from `/locales/${locale}/${namespace}.json`
 * and provide them to child components via `I18nProvider`.
 */
export async function loadDictionary(
	locale: Locale,
	namespaces: Array<string>,
): Promise<{ [namespace: string]: Dictionary }> {
	const translations = await Promise.all(
		namespaces.map<Promise<[string, Dictionary]>>(async (namespace) => {
			/**
			 * The path must be provided as string literal or template string literal.
			 *
			 * @see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
			 */
			const dictionary = await import(`~/public/locales/${locale}/${namespace}.json`).then(
				(module) => {
					return module.default;
				},
			);

			return [namespace, dictionary];
		}),
	);

	return Object.fromEntries(translations);
}
