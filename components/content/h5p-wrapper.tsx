"use client";

import Script from "next/script";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface H5PWrapperProps {
	path: string;
}

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

declare global {
	interface Window {
		H5PStandalone: H5PModule;
	}
}

export function H5PWrapper(props: H5PWrapperProps): ReactNode {
	const { path } = props;
	const [h5pReady, setH5pReady] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const container = ref.current;

		if (!h5pReady || !container) return;
		const loadH5P = async () => {
			const options = {
				h5pJsonPath: `/vendor/h5p-content/${path}`,
				librariesPath: "/vendor/h5p-shared-libraries",
				frameJs: "/vendor/h5p-standalone/frame.bundle.js",
				frameCss: "/vendor/h5p-standalone/styles/h5p.css",
			};
			try {
				await new window.H5PStandalone.H5P(container, options);
			} catch (error: unknown) {
				console.error("Error loading H5P content", error);
			}
		};
		void loadH5P();
		return () => {
			container.innerHTML = "";
		};
	}, [path, h5pReady]);
	return (
		<>
			<div ref={ref} />
			<Script
				id="h5p-script"
				onLoad={() => {
					setH5pReady(true);
				}}
				src="/vendor/h5p-standalone/main.bundle.js"
				strategy="lazyOnload"
			></Script>
		</>
	);
}
