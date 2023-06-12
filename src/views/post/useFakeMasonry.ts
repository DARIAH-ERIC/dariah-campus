import { useEffect, useMemo, useState } from "react";

/**
 * Sorts items into columns (buckets).
 */
export function useFakeMasonry<T>(items: Array<T>): Array<Array<T>> | null {
	const [columnCount, setColumnCount] = useState<number | null>(null);

	useEffect(() => {
		function onWindowResize() {
			requestAnimationFrame(() => {
				if (window.innerWidth >= 1280) {
					setColumnCount(3);
				} else if (window.innerWidth >= 768) {
					setColumnCount(2);
				} else {
					setColumnCount(1);
				}
			});
		}

		window.addEventListener("resize", onWindowResize, { passive: true });

		onWindowResize();

		return () => {
			window.removeEventListener("resize", onWindowResize);
		};
	}, []);

	return useMemo(() => {
		if (columnCount === null) return null;

		const columns = Array(columnCount).fill([]);

		items.forEach((item, index) => {
			const column = index % columnCount;
			columns[column] = columns[column].concat(item);
		});

		return columns;
	}, [columnCount, items]);
}
