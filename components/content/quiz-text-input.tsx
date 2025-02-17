import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface QuizTextInputProps {
	children: ReactNode;
}

export function QuizTextInput(props: Readonly<QuizTextInputProps>): ReactNode {
	const { children } = props;

	const t = useTranslations("content.QuizTextInput");

	return (
		<div>
			<header>{children}</header>
			<label>
				<span className="sr-only">{t("label")}</span>
				<input type="text" />
			</label>
		</div>
	);
}
