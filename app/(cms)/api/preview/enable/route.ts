import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { rewriteUrl } from "@/lib/content/keystatic/utils/rewrite-url";

export async function GET(_request: Request): Promise<Response> {
	const request = rewriteUrl(_request);

	const url = new URL(request.url);
	const params = url.searchParams;

	const branch = params.get("branch");
	const to = params.get("to");

	if (branch == null || to == null) {
		return new Response("Missing `branch` or `to` params", { status: 400 });
	}

	const draft = await draftMode();
	draft.enable();

	const cookieStore = await cookies();
	cookieStore.set("ks-branch", branch);

	const toUrl = new URL(to, url.origin);
	toUrl.protocol = url.protocol;
	toUrl.host = url.host;

	redirect(String(toUrl));
}
