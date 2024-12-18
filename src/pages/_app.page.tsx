import "tailwindcss/tailwind.css";
import "@/styles/index.css";

import { ErrorBoundary } from "@stefanprobst/next-error-boundary";
import type { AppProps as NextAppProps } from "next/app";
import Head from "next/head";
import { type ComponentType, Fragment } from "react";

import { ConsentBanner } from "@/analytics/ConsentBanner";
import { GoogleAnalytics } from "@/analytics/GoogleAnalytics";
import { MatomoAnalytics } from "@/analytics/MatomoAnalytics";
import { useAnalytics } from "@/analytics/useAnalytics";
import { useConsent } from "@/analytics/useConsent";
import { Favicons } from "@/assets/Favicons";
import { WebManifest } from "@/assets/WebManifest";
import { PageLayout } from "@/common/PageLayout";
import { Providers } from "@/common/Providers";
import { ClientError } from "@/error/ClientError";
import { Feed } from "@/metadata/Feed";
import { usePageLoadProgressIndicator } from "@/navigation/usePageLoadProgressIndicator";

export interface AppProps extends NextAppProps {
	Component: NextAppProps["Component"] & { Layout?: ComponentType };
}

/**
 * Shared application shell.
 */
export default function App(props: AppProps): JSX.Element {
	const { Component, pageProps } = props;

	const Layout = Component.Layout ?? PageLayout;

	const [status, { accept, reject }] = useConsent();
	useAnalytics();

	usePageLoadProgressIndicator();

	return (
		<Fragment>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<Favicons />
			<WebManifest />
			<Feed />
			<ErrorBoundary fallback={ClientError}>
				<Providers {...pageProps}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
					{status === "unknown" ? <ConsentBanner onAccept={accept} onReject={reject} /> : null}
					<MatomoAnalytics />
					<GoogleAnalytics />
				</Providers>
			</ErrorBoundary>
		</Fragment>
	);
}
