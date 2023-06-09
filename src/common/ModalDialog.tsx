import cx from "clsx";
import { type CSSProperties, type ReactNode } from "react";
import { useRef } from "react";
import { type AriaModalOverlayProps, Overlay, useDialog, useModalOverlay } from "react-aria";
import { type OverlayTriggerState } from "react-stately";

import { usePreview } from "@/cms/previews/Preview.context";

export interface ModalDialogProps extends AriaModalOverlayProps {
	title?: string;
	"aria-label"?: string;
	children: ReactNode;
	style?: CSSProperties;
	className?: string;
	state: OverlayTriggerState;
}

/**
 * Modal dialog.
 */
export function ModalDialog(props: ModalDialogProps): JSX.Element {
	const { state, title, children } = props;

	const ctx = usePreview();
	const overlayRef = useRef<HTMLDivElement>(null);
	const { modalProps, underlayProps } = useModalOverlay(props, state, overlayRef);
	const { dialogProps, titleProps } = useDialog(props, overlayRef);

	return (
		<Overlay portalContainer={(ctx.document ?? document).body}>
			<div
				{...underlayProps}
				className="fixed inset-0 z-30 flex flex-col items-center justify-start p-4 bg-black bg-opacity-50 md:p-10vmin"
				// for the cms preview
				style={{ zIndex: 1000, ...props.style }}
			>
				<div
					className={cx(
						"flex flex-col w-full max-w-screen-md p-8 overflow-auto bg-white rounded shadow-md focus:outline-none focus-visible:ring focus-visible:ring-primary-600",
						props.className,
					)}
					{...modalProps}
					{...dialogProps}
					ref={overlayRef}
					style={props.style}
				>
					{title != null ? (
						<h2 {...titleProps} className="sr-only">
							{title}
						</h2>
					) : null}
					{children}
				</div>
			</div>
		</Overlay>
	);
}
