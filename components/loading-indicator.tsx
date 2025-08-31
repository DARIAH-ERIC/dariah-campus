import type { AriaLabelingProps, DOMProps } from "@react-types/shared";
import cn from "clsx/lite";
import { Loader2Icon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { useLabels } from "@/lib/hooks/use-labels";

interface LoadingIndicatorProps
	extends AriaLabelingProps,
		DOMProps,
		Pick<ComponentPropsWithoutRef<"svg">, "aria-hidden" | "className"> {}

export function LoadingIndicator(props: Readonly<LoadingIndicatorProps>): ReactNode {
	const { "aria-hidden": ariaHidden, className, ...rest } = props;

	const labelingProps = useLabels(rest);

	const hasLabeling =
		labelingProps["aria-label"] != null || labelingProps["aria-labelledby"] != null;

	return (
		<div className={cn("animate-in delay-500 duration-500 fill-mode-both fade-in", className)}>
			<Loader2Icon
				{...labelingProps}
				aria-hidden={hasLabeling ? (ariaHidden ?? undefined) : true}
				className="animate-spin"
			/>
		</div>
	);
}
