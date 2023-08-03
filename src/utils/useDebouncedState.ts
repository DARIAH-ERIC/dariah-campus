import { useEffect, useState } from "react";

/**
 * Returns debounced value.
 */
export function useDebouncedState<T>(value: T, delay: number): T {
	const [debouncedState, setDebouncedState] = useState(value);

	useEffect(() => {
		const timeout = window.setTimeout(() => {
			setDebouncedState(value);
		}, delay);

		return () => {
			window.clearTimeout(timeout);
		};
	}, [value, delay]);

	return debouncedState;
}
