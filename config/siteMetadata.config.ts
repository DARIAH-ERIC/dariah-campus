import { type Locale } from "@/i18n/i18n.config";
import { defaultLocale } from "@/i18n/i18n.config";
import { createUrl } from "@/utils/createUrl";
import { url } from "~/config/site.config";

export interface SiteMetadata {
	url: string;
	title: string;
	shortTitle?: string;
	description: string;
	favicon: {
		src: string;
		maskable?: boolean;
	};
	image: {
		src: string;
		publicPath: string;
		alt: string;
	};
	twitter?: string;
	creator?: {
		name: string;
		shortName?: string;
		affiliation?: string;
		website: string;
		address?: {
			street: string;
			zip: string;
			city: string;
		};
		image?: {
			src: string;
			publicPath: string;
			alt: string;
		};
		phone?: string;
		email?: string;
		twitter?: string;
	};
}

/**
 * Site metadata for all supported locales.
 */
export const siteMetadata: Record<Locale, SiteMetadata> = {
	en: {
		url: String(createUrl({ pathname: "/", locale: "en", baseUrl: url })),
		title: "DARIAH-Campus",
		shortTitle: "DARIAH-Campus",
		description:
			"DARIAH-Campus is a discovery framework and hosting platform for DARIAH learning resources.",
		favicon: {
			src: "public/assets/images/logo-maskable.svg",
			maskable: true,
		},
		image: {
			src: "public/assets/images/logo-with-text.svg",
			publicPath: String(
				createUrl({
					pathname: "/open-graph.webp",
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					locale: "en" === defaultLocale ? undefined : "en",
					baseUrl: url,
				}),
			),
			alt: "",
		},
		twitter: "DARIAHeu",
		creator: {
			name: "DARIAH",
			shortName: "DARIAH",
			website: "https://www.dariah.eu",
		},
	},
} as const;
