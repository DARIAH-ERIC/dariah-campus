"use client";

import { XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";

interface LightBoxProps {
	caption?: string;
	children: ReactNode;
}

export function LightBox(props: LightBoxProps): ReactNode {
	const { caption, children } = props;

	const dialogLabel = "Media lightbox";
	const closeLabel = "Close";

	return (
		<ModalOverlay>
			<Modal className="fixed inset-0 bg-neutral-800 p-4 text-white">
				<Dialog
					aria-label={dialogLabel}
					className="grid size-full grid-rows-[auto_1fr_auto] gap-y-4 outline-none"
				>
					<header className="flex justify-end">
						<Button
							className="rounded-full transition hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-white"
							slot="close"
						>
							<XIcon aria-hidden={true} className="size-10 shrink-0 p-2" />
							<span className="sr-only">{closeLabel}</span>
						</Button>
					</header>
					<div className="relative size-full overflow-hidden">{children}</div>
					<footer>{caption}</footer>
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}

export const LightBoxOverlay = DialogTrigger;

interface LightboxTriggerProps {
	children: ReactNode;
	className?: string;
}

export function LightboxTrigger(props: LightboxTriggerProps): ReactNode {
	const { children, className } = props;

	return <Button className={className}>{children}</Button>;
}
