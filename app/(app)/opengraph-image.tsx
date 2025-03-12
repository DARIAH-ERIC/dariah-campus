import type { ImageResponse } from "next/og";
import { getLocale } from "next-intl/server";

import { MetadataImage } from "@/components/metadata-image";
import { getMetadata } from "@/lib/i18n/get-metadata";

export const dynamic = "force-static";

export const size = {
	width: 1200,
	height: 630,
};

interface OpenGraphImageProps extends EmptyObject {}

export default async function OpenGraphImage(
	_props: Readonly<OpenGraphImageProps>,
): Promise<ImageResponse> {
	const locale = await getLocale();

	const meta = await getMetadata(locale);

	const title = meta.title;

	return MetadataImage({ locale, size, title });
}
