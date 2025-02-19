/**
 * Since react 19, the global jsx namespace intentionally no longer points to react,
 * however not all of the ecosystem has caught up yet.
 */

import type * as runtime from "react/jsx-runtime";

declare global {
	namespace JSX {
		type Element = runtime.JSX.Element;
		type ElementClass = runtime.JSX.ElementClass;
		type IntrinsicElements = runtime.JSX.IntrinsicElements;
	}
}
