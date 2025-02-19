import type { ReactNode } from "react";

import { env } from "@/config/env.config";

export function TailwindIndicator(): ReactNode {
	if (env.NODE_ENV !== "development") return null;

	return (
		<div className="fixed bottom-4 right-4 z-10 grid size-8 cursor-default select-none place-content-center rounded-full bg-black font-mono text-sm font-bold text-white shadow-md">
			<span className="xs:hidden">{"2xs"}</span>
			<span className="max-xs:hidden sm:hidden">{"xs"}</span>
			<span className="max-sm:hidden md:hidden">{"sm"}</span>
			<span className="max-md:hidden lg:hidden">{"md"}</span>
			<span className="max-lg:hidden xl:hidden">{"lg"}</span>
			<span className="max-xl:hidden 2xl:hidden">{"xl"}</span>
			<span className="max-2xl:hidden">{"2xl"}</span>
		</div>
	);
}
