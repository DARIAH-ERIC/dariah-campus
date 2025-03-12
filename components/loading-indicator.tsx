import { cn } from "@acdh-oeaw/style-variants";
import type { AriaLabelingProps, DOMProps } from "@react-types/shared";
import { Loader2Icon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { useLabels } from "@/lib/use-labels";

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
		<div className={cn("delay-500 duration-500 animate-in fade-in fill-mode-both", className)}>
			<Loader2Icon
				{...labelingProps}
				aria-hidden={hasLabeling ? (ariaHidden ?? undefined) : true}
				className="animate-spin"
			/>
		</div>
	);
}
