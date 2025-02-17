"use client";

import { assert } from "@acdh-oeaw/lib";
import { XIcon } from "lucide-react";
import { createContext, type ReactNode, use } from "react";
import { Button } from "react-aria-components";
import { type OverlayTriggerState, useOverlayTriggerState } from "react-stately";

import { ModalDialog } from "@/app/(app)/(index)/_components/modal-dialog";

interface LightBoxProps {
	caption?: string;
	children: ReactNode;
}

export function LightBox(props: LightBoxProps): ReactNode {
	const { caption, children } = props;

	const lightbox = useLightBox();

	if (!lightbox.isOpen) return null;

	// FIXME: i18n
	const dialogLabel = "Media lightbox";
	const closeLabel = "Close";

	return (
		<ModalDialog aria-label={dialogLabel} state={lightbox}>
			<div className="absolute inset-0 flex flex-col justify-between space-y-4 bg-neutral-800 p-4 text-white">
				<header className="flex justify-end">
					<Button
						className="rounded-full transition hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-white"
						onPress={() => {
							lightbox.close();
						}}
					>
						<XIcon aria-hidden={true} className="size-10 shrink-0 p-2" />
						<span className="sr-only">{closeLabel}</span>
					</Button>
				</header>
				<div className="relative mx-auto w-full max-w-[calc((16/9*100dvh)-264px)] flex-1 overflow-hidden p-4">
					{children}
				</div>
				<footer>{caption}</footer>
			</div>
		</ModalDialog>
	);
}

const LightBoxContext = createContext<OverlayTriggerState | null>(null);

function useLightBox() {
	const value = use(LightBoxContext);

	assert(value, "useLightBox must be wrapped in a LightBoxContext");

	return value;
}

interface LightBoxOverlayProps {
	children: ReactNode;
}

export function LightBoxOverlay(props: LightBoxOverlayProps): ReactNode {
	const { children } = props;

	const lightbox = useOverlayTriggerState({});

	return <LightBoxContext.Provider value={lightbox}>{children}</LightBoxContext.Provider>;
}

interface LightboxTriggerProps {
	children: ReactNode;
	className?: string;
}

export function LightboxTrigger(props: LightboxTriggerProps): ReactNode {
	const { children, className } = props;

	const lightbox = useLightBox();

	return (
		<Button
			className={className}
			onPress={() => {
				lightbox.open();
			}}
		>
			{children}
		</Button>
	);
}
