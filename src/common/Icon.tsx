import { type FC, type SVGProps } from "react";

export interface IconProps {
	icon: FC<SVGProps<SVGSVGElement> & { title?: string }>;
	/** @default true */
	"aria-hidden"?: boolean;
	"aria-label"?: string;
	className?: string;
	title?: string;
}

/**
 * Icon.
 */
export function Icon(props: IconProps): JSX.Element {
	const Svg = props.icon;
	const hidden = props["aria-hidden"] ?? props["aria-label"] === undefined;

	return (
		<Svg
			aria-hidden={hidden}
			aria-label={props["aria-label"]}
			className={props.className}
			width="1em"
			height="1em"
			title={props.title}
		/>
	);
}
