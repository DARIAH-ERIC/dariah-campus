import { useId as _useId } from "react";

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export function useId(defaultId?: string): string {
	const id = _useId();

	return defaultId ?? id;
}
