import type { ImageResponse } from "next/og";
import { getLocale } from "next-intl/server";

import { MetadataImage } from "@/components/metadata-image";
import { createClient } from "@/lib/content/create-client";

interface OpenGraphImageProps {
	params: Promise<{
		id: string;
	}>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<OpenGraphImageProps["params"]>, "id">>
> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const ids = await client.resources.external.ids();

	return ids.map((id) => {
		return { id };
	});
}

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

	const client = await createClient(locale);
	const resource = await client.resources.external.get(id);
	const { title } = resource.data;

	return MetadataImage({ locale, size, title });
}
