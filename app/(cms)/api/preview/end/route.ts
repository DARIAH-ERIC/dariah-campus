import { cookies, draftMode } from "next/headers";

import { rewriteUrl } from "@/lib/keystatic/rewrite-url";

export async function POST(_request: Request): Promise<Response> {
	const request = rewriteUrl(_request);

	if (request.headers.get("origin") !== new URL(request.url).origin) {
		return new Response("Invalid origin", { status: 400 });
	}

	const referrer = request.headers.get("Referer");
	if (!referrer) {
		return new Response("Missing referer", { status: 400 });
	}

	(await draftMode()).disable();
	(await cookies()).delete("ks-branch");

	return Response.redirect(referrer, 303);
}
