import { useEffect, useMemo, useState } from "react";

export function useMasonryLayout<T>(items: Array<T>): Array<Array<T>> | null {
	const [columnCount, setColumnCount] = useState<number | null>(null);

	useEffect(() => {
		const controller = new AbortController();

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

		window.addEventListener("resize", onWindowResize, { passive: true, signal: controller.signal });

		onWindowResize();

		return () => {
			controller.abort();
		};
	}, []);

	return useMemo(() => {
		if (columnCount == null) return null;

		const columns = Array(columnCount).fill([]) as Array<Array<T>>;

		items.forEach((item, index) => {
			const column = columns[index % columnCount]!;
			column.push(item);
		});

		return columns;
	}, [columnCount, items]);
}
