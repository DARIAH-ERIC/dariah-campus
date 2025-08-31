import { parseArgs } from "node:util";

import { createContentProcessor } from "@acdh-oeaw/content-lib";
import { log } from "@acdh-oeaw/lib";
import * as v from "valibot";

const positionalArgsSchema = v.optional(v.picklist(["build", "watch"]), "build");

const formatters = {
	duration: new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

async function generate(): Promise<void> {
	const { positionals } = parseArgs({ allowPositionals: true });
	const mode = v.parse(positionalArgsSchema, positionals.at(0));

	const processor = await createContentProcessor({
		configFilePath: "./lib/content/config",
	});

	async function build() {
		log.info("Processing...");
		const start = performance.now();
		const stats = await processor.build();
		const end = performance.now();
		const duration = formatters.duration.format(end - start);
		log.success(
			`Processed ${String(stats.documents)} document${stats.documents === 1 ? "" : "s"} in ${String(stats.collections)} collection${stats.documents === 1 ? "" : "s"} in ${duration} ms.`,
		);
	}

	async function watch() {
		log.info("Watching for changes...");
		await processor.watch();
	}

	switch (mode) {
		case "build": {
			await build();
			break;
		}

		case "watch": {
			await build();
			await watch();
			break;
		}
	}
}

generate().catch((error: unknown) => {
	log.error("Failed to generate content.\n", error);
	process.exitCode = 1;
});
