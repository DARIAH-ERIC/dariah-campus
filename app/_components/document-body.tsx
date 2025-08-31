import type { ComponentProps, ReactNode } from "react";

import { TailwindIndicator } from "@/app/_components/tailwind-indicator";

interface DocumentBodyProps extends ComponentProps<"body"> {
	children: ReactNode;
}

export function DocumentBody(props: Readonly<DocumentBodyProps>): ReactNode {
	const { children, ...rest } = props;

	return (
		<body {...rest}>
			{children}

			<TailwindIndicator />
		</body>
	);
}
