import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ImageResponse } from "next/og";

import { MetadataImage } from "#/components/metadata-image.tsx";
import { createClient } from "#/lib/content/create-client.ts";

interface OpenGraphImageProps extends PageProps<"/resources/events/[id]"> {}

export const size = {
	width: 1200,
	height: 630,
};

export default async function OpenGraphImage(props: Readonly<OpenGraphImageProps>): Promise<ImageResponse> {
	const { params } = props;

	const locale = await getLocale();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const client = await createClient();

	const resource = await client.collections.resourcesEvents.get(id);

	if (resource == null) {
		notFound();
	}

	const { title } = resource.metadata;

	return MetadataImage({ locale, size, title });
}
