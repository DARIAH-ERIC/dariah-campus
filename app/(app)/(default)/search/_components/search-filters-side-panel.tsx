"use client";

import cn from "clsx/lite";
import { FilterIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";

interface SearchFiltersSidePanelProps {
	children: ReactNode;
	closeLabel: string;
	label: string;
}

export function SearchFiltersSidePanel(props: Readonly<SearchFiltersSidePanelProps>): ReactNode {
	const { children, closeLabel, label } = props;

	return (
		<DialogTrigger>
			<Button className="fixed right-6 bottom-6 z-10 flex size-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg md:hidden">
				<span className="sr-only">{label}</span>
				<FilterIcon className="size-10 p-2" />
			</Button>
			<ModalOverlay
				className={cn(
					"fixed top-0 left-0 isolate z-20 h-[var(--visual-viewport-height)] w-full bg-black/25",
					"entering:animate-in entering:duration-200 entering:ease-out entering:fade-in",
					"exiting:animate-out exiting:duration-200 exiting:ease-in exiting:fade-out",
				)}
				isDismissable={true}
			>
				<Modal
					className={cn(
						"mr-12 size-full max-h-full max-w-sm bg-white shadow-lg forced-colors:bg-[Canvas]",
						"entering:animate-in entering:duration-200 entering:ease-out entering:slide-in-from-left",
						"exiting:animate-out exiting:duration-200 exiting:ease-in exiting:slide-out-to-left",
					)}
				>
					<Dialog
						aria-label={label}
						className="relative grid h-full max-h-[inherit] content-start gap-y-8 overflow-auto p-8 outline-none"
					>
						<Button
							className="justify-self-end py-2.5 text-neutral-600 transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
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
