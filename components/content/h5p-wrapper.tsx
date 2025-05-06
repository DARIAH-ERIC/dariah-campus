"use client";

import { type ReactNode, useEffect, useRef } from "react";

type H5PConstructor = new (
	container: HTMLElement,
	options: {
		h5pJsonPath: string;
		frameJs?: string;
		frameCss?: string;
		embedType?: string;
		id?: string;
		preventH5PInit?: boolean;
	},
) => Promise<string>;

interface H5PModule {
	H5P: H5PConstructor;
}

interface H5PWrapperProps {
	path: string;
}

export function H5PWrapper(props: H5PWrapperProps): ReactNode {
	const { path } = props;
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const container = ref.current;

		if (container == null) return;
		const loadH5P = async () => {
			const mod = (await import("h5p-standalone")) as H5PModule;
			const H5P = mod.H5P;
			const options = {
				h5pJsonPath: `/vendor/h5p-content/${path}`,
				librariesPath: "/vendor/h5p-shared-libraries",
				frameJs: "/vendor/h5p-standalone/frame.bundle.js",
				frameCss: "/vendor/h5p-standalone/styles/h5p.css",
			};
			try {
				await new H5P(container, options);
			} catch (error: unknown) {
				console.error("Error loading H5P content", error);
			}
		};
		void loadH5P();
		return () => {
			container.innerHTML = "";
		};
	}, [path]);

	return <div ref={ref} />;
}
