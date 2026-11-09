import { useEffect, useMemo, useState } from "react";

export function useMasonryLayout<T>(items: Array<T>): Array<Array<T>> | null {
	const [columnCount, setColumnCount] = useState<number | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		function onWindowResize() {
			requestAnimationFrame(() => {
				if (window.innerWidth >= 1280) {
					setColumnCount(3);
				} else if (window.innerWidth >= 840) {
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

	const columns = useMemo(() => {
		if (columnCount == null) {
			return null;
		}

		const columns = Array.from({ length: columnCount }, () => [] as Array<T>);

		items.forEach((item, index) => {
			const column = index % columnCount;
			columns[column]!.push(item);
		});

		return columns;
	}, [items, columnCount]);

	return columns;
}
