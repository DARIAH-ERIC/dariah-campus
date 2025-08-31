import { notFound } from "next/navigation";
import type { ImageResponse } from "next/og";
import { getLocale } from "next-intl/server";

import { MetadataImage } from "@/components/metadata-image";
import { client } from "@/lib/content/client";

interface OpenGraphImageProps extends PageProps<"/sources/[id]"> {}

export const size = {
	width: 1200,
	height: 630,
};

export default async function OpenGraphImage(
	props: Readonly<OpenGraphImageProps>,
): Promise<ImageResponse> {
	const { params } = props;

	const locale = await getLocale();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const resource = client.collections.sources.get(id);

	if (resource == null) {
		notFound();
	}

	const { name } = resource.metadata;

	return MetadataImage({ locale, size, title: name });
}
