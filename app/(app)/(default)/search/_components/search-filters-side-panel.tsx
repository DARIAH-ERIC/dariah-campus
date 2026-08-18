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
			<Button className="fixed inset-e-6 inset-be-6 z-10 flex items-center justify-center rounded-full bg-brand-700 text-white shadow-lg block-12 inline-12 md:hidden">
				<span className="sr-only">{label}</span>
				<FilterIcon className="p-2 block-10 inline-10" />
			</Button>
			<ModalOverlay
				className={cn(
					"fixed inset-s-0 inset-bs-0 isolate z-20 bg-black/25 block-(--visual-viewport-height) inline-full",
					"entering:animate-in entering:duration-200 entering:ease-out entering:fade-in",
					"exiting:animate-out exiting:duration-200 exiting:ease-in exiting:fade-out",
				)}
				isDismissable={true}
			>
				<Modal
					className={cn(
						"me-12 bg-white shadow-lg block-full inline-full max-block-full max-inline-sm forced-colors:bg-[Canvas]",
						"entering:animate-in entering:duration-200 entering:ease-out entering:slide-in-from-left",
						"exiting:animate-out exiting:duration-200 exiting:ease-in exiting:slide-out-to-left",
					)}
				>
					<Dialog
						aria-label={label}
						className="relative grid content-start gap-y-8 overflow-auto p-8 outline-none block-full max-block-[inherit]"
					>
						<Button
							className="justify-self-end py-2.5 text-neutral-600 transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
							slot="close"
						>
							<span className="sr-only">{closeLabel}</span>
							<XIcon aria-hidden={true} className="block-6 inline-6" />
						</Button>

						<div className="grid content-start gap-y-8">{children}</div>
					</Dialog>
				</Modal>
			</ModalOverlay>
		</DialogTrigger>
	);
}
