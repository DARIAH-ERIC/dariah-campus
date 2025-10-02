"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import type { ReactNode } from "react";

export function ApiDocs(): ReactNode {
	return (
		<ApiReferenceReact
			configuration={{
				_integration: "nextjs",
				url: "/openapi.json",
			}}
		/>
	);
}
