import { client } from "#/lib/content/client/index.ts";
import { getContentSectionSegments } from "#/lib/content/utils/get-content-sections.ts";

/** Displays a section other than the first one, which is displayed by the parent route itself. */
export { default, generateMetadata } from "#/app/(app)/(default)/documentation/[id]/page.tsx";

export async function generateStaticParams(): Promise<
	Array<Awaited<PageProps<"/documentation/[id]/[section]">["params"]>>
> {
	const items = await client.collections.documentation.all();

	return items.flatMap((item) =>
		getContentSectionSegments(item.sections).map((section) => {
			return { id: item.id, section };
		}),
	);
}
