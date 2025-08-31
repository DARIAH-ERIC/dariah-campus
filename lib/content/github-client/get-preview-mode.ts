import { cookies, draftMode } from "next/headers";

import { env } from "@/config/env.config";

type PreviewMode =
	| {
			status: "enabled";
			owner: string;
			repo: string;
			branch: string;
			token: string;
	  }
	| {
			status: "disabled";
	  };

export async function getPreviewMode(): Promise<PreviewMode> {
	const draft = await draftMode();
	const isDraftModeEnabled = draft.isEnabled;

	if (isDraftModeEnabled) {
		const owner = env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER;
		const repo = env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME;

		if (owner != null && repo != null) {
			const cookieStore = await cookies();

			const branch = cookieStore.get("ks-branch")?.value;
			const token = cookieStore.get("keystatic-gh-access-token")?.value;

			if (branch != null && token != null) {
				return {
					status: "enabled",
					owner,
					repo,
					branch,
					token,
				};
			}
		}

		/** This seems to work even though it is not called in a route handler. */
		draft.disable();
	}

	return {
		status: "disabled",
	};
}
