import { log } from "@acdh-oeaw/lib";
import * as v from "valibot";

/**
 * Prints the paths of all files touched by open "content: add handle" pull requests, one per line, so
 * `create-handle.sh` can skip resources which already have a pending handle.
 */

const EnvSchema = v.object({
	GITHUB_TOKEN: v.pipe(v.string(), v.nonEmpty()),
	VERCEL_GIT_REPO_OWNER: v.pipe(v.string(), v.nonEmpty()),
	VERCEL_GIT_REPO_SLUG: v.pipe(v.string(), v.nonEmpty()),
});

const branchPrefix = "content/add-handle-";

const PullRequestsSchema = v.array(v.object({ number: v.number(), head: v.object({ ref: v.string() }) }));
const PullRequestFilesSchema = v.array(v.object({ filename: v.string() }));

async function request<T>(url: string, schema: v.GenericSchema<unknown, T>, token: string) {
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});

	if (!response.ok) {
		throw new Error(`Request to ${url} failed with status ${String(response.status)}.`);
	}

	return v.parse(schema, await response.json());
}

async function list() {
	// oxlint-disable-next-line node/no-process-env
	const env = v.parse(EnvSchema, process.env);
	const repo = `${env.VERCEL_GIT_REPO_OWNER}/${env.VERCEL_GIT_REPO_SLUG}`;
	const baseUrl = `https://api.github.com/repos/${repo}/pulls`;

	const pullRequests = await request(
		`${baseUrl}?base=main&state=open&per_page=100`,
		PullRequestsSchema,
		env.GITHUB_TOKEN,
	);

	const files = new Set<string>();

	for (const pullRequest of pullRequests) {
		if (!pullRequest.head.ref.startsWith(branchPrefix)) {
			continue;
		}

		const pullRequestFiles = await request(
			`${baseUrl}/${String(pullRequest.number)}/files?per_page=100`,
			PullRequestFilesSchema,
			env.GITHUB_TOKEN,
		);

		for (const file of pullRequestFiles) {
			files.add(file.filename);
		}
	}

	return files;
}

list()
	.then((files) => {
		for (const file of files) {
			process.stdout.write(`${file}\n`);
		}
	})
	.catch((error: unknown) => {
		log.error("Failed to list pending handle files.\n", error);
		process.exitCode = 1;
	});
