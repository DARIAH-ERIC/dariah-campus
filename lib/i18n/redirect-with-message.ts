import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import * as v from "valibot";

import { redirect } from "@/lib/i18n/navigation";

type RedirectParams = Parameters<typeof redirect>[0];

const toastCookieName = "toast";

const ToastMessageSchema = v.object({
	// TODO: consider timestamp instead of id
	id: v.pipe(v.string(), v.nonEmpty()),
	status: v.picklist(["success", "error"]),
	message: v.pipe(v.string(), v.nonEmpty()),
});

type ToastMessage = v.InferOutput<typeof ToastMessageSchema>;

export async function redirectWithToastMessage(
	params: RedirectParams,
	toast: Omit<ToastMessage, "id">,
) {
	const value = JSON.stringify({ ...toast, id: randomUUID() });
	(await cookies()).set(toastCookieName, value, { maxAge: 0 });
	return redirect(params);
}

export async function getToastMessage(): Promise<ToastMessage | null> {
	const message = (await cookies()).get(toastCookieName)?.value;

	if (message == null) return null;

	try {
		const value = JSON.parse(message) as unknown;
		return v.parse(ToastMessageSchema, value);
	} catch {
		return null;
	}
}
