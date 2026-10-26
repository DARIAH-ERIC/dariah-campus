"use client";

import Script from "next/script";
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";

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
) => {
	destroy?: () => void;
	[key: string]: unknown;
};

interface H5PModule {
	H5P: H5PConstructor;
}

declare global {
	interface Window {
		H5PPlayer?: H5PConstructor;
		H5PStandalone?: H5PModule;
		H5P?: unknown;
	}
}

export function H5PWrapper(props: Readonly<H5PWrapperProps>): ReactNode {
	const { path } = props;

	const ref = useRef<HTMLDivElement | null>(null);
	const [scriptIsReady, setScriptIsReady] = useState(false);

	useEffect(() => {
		const container = ref.current;

		if (scriptIsReady) {
			if (!((window.H5PStandalone?.H5P || window.H5PPlayer) && container)) return;

			if (window.H5PStandalone?.H5P) {
				window.H5PPlayer = window.H5PStandalone.H5P;
			}

			const { H5PPlayer } = window;

			const loadH5P = () => {
				const options = {
					h5pJsonPath: `/vendor/h5p-content/${path}`,
					librariesPath: "/vendor/h5p-shared-libraries",
					frameJs: "/vendor/h5p-standalone/frame.bundle.js",
					frameCss: "/vendor/h5p-standalone/styles/h5p.css",
				};

				try {
					if (H5PPlayer) {
						new H5PPlayer(container, options);
					}
				} catch (error: unknown) {
					console.error("Error loading H5P content", error);
				}
			};

			loadH5P();
		}
		return () => {
			if (container) {
				container.innerHTML = "";
			}
		};
	}, [path, scriptIsReady]);

	return (
		<Fragment>
			<div ref={ref} />
			<Script
				id="h5p-script"
				onReady={() => {
					setScriptIsReady(true);
				}}
				src="/vendor/h5p-standalone/main.bundle.js"
				strategy="afterInteractive"
			/>
		</Fragment>
	);
}
