import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { rewriteUrl } from "@/lib/content";

export async function GET(_request: Request): Promise<Response> {
	const request = rewriteUrl(_request);

	const referrer = request.headers.get("Referer");

	if (referrer == null) {
		return new Response("Missing referer", { status: 400 });
	}

	const draft = await draftMode();
	draft.disable();

	const cookieStore = await cookies();
	cookieStore.delete("ks-branch");

	return redirect(referrer);
}
