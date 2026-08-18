import type { ReactNode } from "react";

import { env } from "#/configs/env.config.ts";

export function TailwindIndicator(): ReactNode {
	if (env.NODE_ENV !== "development") {
		return null;
	}

	return (
		<div className="fixed inset-e-5 inset-be-5 z-10 grid cursor-default place-content-center rounded-full bg-neutral-900 font-code text-xs font-semibold text-neutral-50 shadow-lg select-none block-9 inline-9">
			<span className="2xs:hidden">{"3xs"}</span>
			<span className="max-2xs:hidden xs:hidden">{"2xs"}</span>
			<span className="max-xs:hidden sm:hidden">{"xs"}</span>
			<span className="max-sm:hidden md:hidden">{"sm"}</span>
			<span className="max-md:hidden lg:hidden">{"md"}</span>
			<span className="max-lg:hidden xl:hidden">{"lg"}</span>
			<span className="max-xl:hidden 2xl:hidden">{"xl"}</span>
			<span className="max-2xl:hidden">{"2xl"}</span>
		</div>
	);
}
