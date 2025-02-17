import Form, { type FormProps } from "next/form";
import type { ReactNode } from "react";

interface SearchFormProps extends FormProps {
	children: ReactNode;
	/** @default "search" */
	role?: "form" | "search";
}

export function SearchForm(props: Readonly<SearchFormProps>): ReactNode {
	const { children, role = "search", ...rest } = props;

	return (
		<Form {...rest} role={role}>
			{children}
		</Form>
	);
}
