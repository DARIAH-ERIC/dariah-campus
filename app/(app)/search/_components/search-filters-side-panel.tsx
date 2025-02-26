"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { FilterIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";

interface SearchFiltersSidePanelProps {
	children: ReactNode;
	closeLabel: string;
	label: string;
}

export function SearchFiltersSidePanel(props: SearchFiltersSidePanelProps): ReactNode {
	const { children, closeLabel, label } = props;

	return (
		<DialogTrigger>
			<Button className="fixed bottom-6 right-6 z-10 flex size-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg md:hidden">
				<span className="sr-only">{label}</span>
				<FilterIcon className="size-10 p-2" />
			</Button>
			<ModalOverlay
				className={cn(
					"fixed left-0 top-0 isolate z-20 h-[var(--visual-viewport-height)] w-full bg-black/25",
					"entering:duration-200 entering:ease-out entering:animate-in entering:fade-in",
					"exiting:duration-200 exiting:ease-in exiting:animate-out exiting:fade-out",
				)}
				isDismissable={true}
			>
				<Modal
					className={cn(
						"mr-12 size-full max-h-full max-w-sm bg-white shadow-lg forced-colors:bg-[Canvas]",
						"entering:duration-200 entering:ease-out entering:animate-in entering:slide-in-from-left",
						"exiting:duration-200 exiting:ease-in exiting:animate-out exiting:slide-out-to-left",
					)}
				>
					<Dialog
						aria-label={label}
						className="relative grid h-full max-h-[inherit] content-start gap-y-8 overflow-auto p-8 outline-none"
					>
						<Button
							className="justify-self-end text-neutral-600 transition hover:text-brand-700"
							slot="close"
						>
							<span className="sr-only">{closeLabel}</span>
							<XIcon aria-hidden={true} className="size-6" />
						</Button>

						<div className="grid content-start gap-y-8">{children}</div>
					</Dialog>
				</Modal>
			</ModalOverlay>
		</DialogTrigger>
	);
}
