"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type CSSProperties, type ReactNode, useRef } from "react";
import { type AriaModalOverlayProps, Overlay, useDialog, useModalOverlay } from "react-aria";
import type { OverlayTriggerState } from "react-stately";

interface ModalDialogProps extends AriaModalOverlayProps {
	"aria-label"?: string;
	children: ReactNode;
	className?: string;
	state: OverlayTriggerState;
	style?: CSSProperties;
	title?: string;
}

export function ModalDialog(props: ModalDialogProps): ReactNode {
	const { children, className, state, style, title } = props;

	const overlayRef = useRef<HTMLDivElement>(null);
	const { modalProps, underlayProps } = useModalOverlay(props, state, overlayRef);
	const { dialogProps, titleProps } = useDialog(props, overlayRef);

	return (
		<Overlay>
			<div
				{...underlayProps}
				className="fixed inset-0 z-30 flex flex-col items-center justify-start bg-black bg-opacity-50 p-4 md:p-10vmin"
				// for the cms preview
				style={{ zIndex: 1000, ...style }}
			>
				<div
					className={cn(
						"flex w-full max-w-screen-md flex-col overflow-auto rounded bg-white p-8 shadow-md focus:outline-none focus-visible:ring focus-visible:ring-primary-600",
						className,
					)}
					{...modalProps}
					{...dialogProps}
					ref={overlayRef}
					style={style}
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
