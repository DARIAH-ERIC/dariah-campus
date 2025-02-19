import type { AriaLabelingProps, DOMProps as SharedDOMProps } from "@react-types/shared";
import { type CSSProperties, type ReactNode, useMemo } from "react";

/**
 * Copied from react aria components.
 *
 * @see https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx
 */

export interface StyleRenderProps<T> {
	className?: string | ((values: T & { defaultClassName: string | undefined }) => string);
	style?:
		| CSSProperties
		| ((values: T & { defaultStyle: CSSProperties }) => CSSProperties | undefined);
}

export interface RenderProps<T> extends StyleRenderProps<T> {
	children?: ReactNode | ((values: T & { defaultChildren: ReactNode | undefined }) => ReactNode);
}

interface RenderPropsHookOptions<T> extends RenderProps<T>, SharedDOMProps, AriaLabelingProps {
	values: T;
	defaultChildren?: ReactNode;
	defaultClassName?: string;
	defaultStyle?: CSSProperties;
}

export function useRenderProps<T>(props: RenderPropsHookOptions<T>) {
	const {
		className,
		style,
		children,
		defaultClassName = undefined,
		defaultChildren = undefined,
		defaultStyle,
		values,
	} = props;

	return useMemo(() => {
		let computedClassName: string | undefined;
		let computedStyle: CSSProperties | undefined;
		let computedChildren: ReactNode | undefined;

		if (typeof className === "function") {
			computedClassName = className({ ...values, defaultClassName });
		} else {
			computedClassName = className;
		}

		if (typeof style === "function") {
			computedStyle = style({ ...values, defaultStyle: defaultStyle ?? {} });
		} else {
			computedStyle = style;
		}

		if (typeof children === "function") {
			computedChildren = children({ ...values, defaultChildren });
		} else if (children == null) {
			computedChildren = defaultChildren;
		} else {
			computedChildren = children;
		}

		return {
			className: computedClassName ?? defaultClassName,
			style: computedStyle || defaultStyle ? { ...defaultStyle, ...computedStyle } : undefined,
			children: computedChildren ?? defaultChildren,
			"data-rac": "",
		};
	}, [className, style, children, defaultClassName, defaultChildren, defaultStyle, values]);
}
