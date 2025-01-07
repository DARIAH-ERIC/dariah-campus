import fs from "node:fs";
import path from "node:path";

import prettier from "prettier";

import { getCoursePreviews } from "@/cms/api/courses.api";
import { getEventPreviews } from "@/cms/api/events.api";
import { getPostPreviews } from "@/cms/api/posts.api";
import { log } from "@/utils/log";

async function createRedirects(resources: Array<{ uuid: string; id: string }>, fileName: string) {
	const redirects: Record<string, string> = {};

	resources.forEach((resource) => {
		redirects[resource.uuid] = resource.id;
	});

	fs.writeFileSync(
		path.join(process.cwd(), fileName),
		// eslint-disable-next-line import/no-named-as-default-member
		await prettier.format(JSON.stringify(redirects), { parser: "json" }),
		{ encoding: "utf-8" },
	);
}

/**
 * Creates redirects.
 */
async function main() {
	const locale = "en";

	const resources = await getPostPreviews(locale);
	await createRedirects(resources, "redirects.resources.json");

	const events = await getEventPreviews(locale);
	await createRedirects(events, "redirects.events.json");

	const courses = await getCoursePreviews(locale);
	await createRedirects(courses, "redirects.courses.json");
}

main()
	.then(() => {
		log.success("Successfully updated resource redirects.");
	})
	.catch(log.error);
