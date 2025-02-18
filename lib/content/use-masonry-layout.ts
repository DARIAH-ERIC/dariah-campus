import { Children, type ReactNode, useEffect, useMemo, useState } from "react";

export function useMasonryLayout(children: ReactNode, variant: "default" | "search" = "default") {
	const [columnCount, setColumnCount] = useState<number | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		function onWindowResize() {
			requestAnimationFrame(() => {
				switch (variant) {
					case "default": {
						if (window.innerWidth >= 1280) {
							setColumnCount(3);
						} else if (window.innerWidth >= 768) {
							setColumnCount(2);
						} else {
							setColumnCount(1);
						}

						break;
					}

					case "search": {
						if (window.innerWidth >= 1140) {
							setColumnCount(2);
						} else {
							setColumnCount(1);
						}

						break;
					}
				}
			});
		}

		window.addEventListener("resize", onWindowResize, { passive: true, signal: controller.signal });

		onWindowResize();

		return () => {
			controller.abort();
		};
	}, [variant]);

	const columns = useMemo(() => {
		if (columnCount === null) return null;

		const items = Children.toArray(children);
		const columns = Array.from({ length: columnCount }, () => {
			return [] as Array<ReactNode>;
		});

		items.forEach((item, index) => {
			const column = index % columnCount;
			columns[column]!.push(item);
		});

		return columns;
	}, [children, columnCount]);

	return columns;
}
