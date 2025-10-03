import { client } from "@/lib/content/client";
import { createGitHubClient } from "@/lib/content/github-client";
import { getPreviewMode } from "@/lib/content/github-client/get-preview-mode";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function createClient() {
	const preview = await getPreviewMode();

	if (preview.status === "enabled") {
		return createGitHubClient(preview);
	}

	return client;
}
