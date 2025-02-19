import { useId as _useId } from "react";

export function useId(defaultId?: string): string {
	const id = _useId();

	return defaultId ?? id;
}
