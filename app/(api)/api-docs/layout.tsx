import type { ReactNode } from "react";

interface ApiDocsLayoutProps extends LayoutProps<"/api-docs"> {}

export default function ApiDocsLayout(props: Readonly<ApiDocsLayoutProps>): ReactNode {
	const { children } = props;

	const locale = "en";

	return (
		<html lang={locale}>
			<body>{children}</body>
		</html>
	);
}
