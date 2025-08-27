import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "@/lib/content/keystatic/reader";
import { compile, type CompileOptions } from "@/lib/content/mdx/compile";
import {
	createGitHubMarkdownPlugin,
	createTypographicQuotesPlugin,
} from "@/lib/content/mdx/remark-plugins";
import { createRemarkRehypeOptions } from "@/lib/content/mdx/remark-rehype-options";
import { getImageDimensions } from "@/lib/content/utils/get-image-dimensions";
import { defaultLocale, getIntlLanguage } from "@/lib/i18n/locales";

const locale = defaultLocale;

const compileOptions: CompileOptions = {
	remarkPlugins: [
		createGitHubMarkdownPlugin(),
		createTypographicQuotesPlugin(getIntlLanguage(locale)),
	],
	remarkRehypeOptions: createRemarkRehypeOptions(locale),
	rehypePlugins: [],
};

export const indexPage = createCollection({
	name: "index-page",
	directory: "./content/en/index-page/",
	include: ["index.json"],
	read() {
		return reader.singletons["en:index-page"].readOrThrow({ resolveLinkedFiles: true });
	},
	async transform(data, item, context) {
		const faqSection = data["faq-section"];
		const faqs = [];

		// TODO: p-limit for concurrency
		for (const faq of faqSection.faq) {
			const input = new VFile({ path: item.absoluteFilePath, value: faq.content });
			const output = await compile(input, compileOptions);
			const module = context.createJavaScriptImport<MDXContent>(String(output));

			faqs.push({ ...faq, content: module });
		}

		const aboutSection = data["about-section"];
		const aboutSectionVideos = [];

		// TODO: p-limit for concurrency
		for (const video of aboutSection.videos) {
			const image = await getImageDimensions(video.image);

			aboutSectionVideos.push({ ...video, image });
		}

		const browseSection = data["browse-section"];
		const browseSectionLinks = [];

		// TODO: p-limit for concurrency
		for (const link of browseSection.links) {
			const image = await getImageDimensions(link.image);

			browseSectionLinks.push({ ...link, image });
		}

		const testimonialSection = data["testimonial-section"];
		const testimonialSectionVideos = [];

		// TODO: p-limit for concurrency
		for (const video of testimonialSection.videos) {
			const image = await getImageDimensions(video.image);

			testimonialSectionVideos.push({ ...video, image });
		}

		const image = await getImageDimensions(data.image);

		return {
			...data,
			image,
			"faq-section": {
				...faqSection,
				faq: faqs,
			},
			"about-section": {
				...aboutSection,
				videos: aboutSectionVideos,
			},
			"browse-section": {
				...browseSection,
				links: browseSectionLinks,
			},
			"testimonial-section": {
				...testimonialSection,
				videos: testimonialSectionVideos,
			},
		};
	},
});
