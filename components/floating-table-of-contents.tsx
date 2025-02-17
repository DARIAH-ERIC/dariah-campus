"use client";

import type { TableOfContents as TableOfContentsTree } from "@acdh-oeaw/mdx-lib";
import { cn } from "@acdh-oeaw/style-variants";
import { TableOfContentsIcon, XIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";

import { TableOfContents } from "@/components/table-of-contents";

interface FloatingTableOfContentsProps {
	closeLabel: string;
	label: string;
	tableOfContents: TableOfContentsTree;
	toggleLabel: string;
}

export function FloatingTableOfContents(props: FloatingTableOfContentsProps): ReactNode {
	const { closeLabel, label, tableOfContents, toggleLabel } = props;

	return (
		<nav aria-label={label}>
			<DialogTrigger>
				<Button className="fixed bottom-6 right-6 z-10 flex size-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg">
					<span className="sr-only">{toggleLabel}</span>
					<TableOfContentsIcon className="size-10 p-2" />
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
							{({ close }) => {
								return (
									<Fragment>
										<Button
											className="justify-self-end text-neutral-600 transition hover:text-primary-600"
											slot="close"
										>
											<span className="sr-only">{closeLabel}</span>
											<XIcon aria-hidden={true} className="size-6" />
										</Button>

										<TableOfContents
											onChange={() => {
												requestAnimationFrame(() => {
													close();
												});
											}}
											tableOfContents={tableOfContents}
											variant="panel"
										/>
									</Fragment>
								);
							}}
						</Dialog>
					</Modal>
				</ModalOverlay>
			</DialogTrigger>
		</nav>
	);
}
