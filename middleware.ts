import type { MiddlewareConfig, NextMiddleware } from "next/server";

import { composeMiddleware } from "@/lib/server/compose-middlewares";
import { middleware as csrfMiddlware } from "@/lib/server/csrf/middleware";

export const middleware: NextMiddleware = composeMiddleware(csrfMiddlware);

export const config: MiddlewareConfig = {
	matcher: ["/api/:path*"],
};
