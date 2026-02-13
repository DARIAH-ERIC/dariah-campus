"use client";

import type { TableOfContents as TableOfContentsTree } from "@acdh-oeaw/mdx-lib";
import cn from "clsx/lite";
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

export function FloatingTableOfContents(props: Readonly<FloatingTableOfContentsProps>): ReactNode {
	const { closeLabel, label, tableOfContents, toggleLabel } = props;

	return (
		<nav aria-label={label}>
			<DialogTrigger>
				<Button className="fixed right-6 bottom-6 z-10 flex size-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg">
					<span className="sr-only">{toggleLabel}</span>
					<TableOfContentsIcon className="size-10 p-2" />
				</Button>
				<ModalOverlay
					className={cn(
						"fixed top-0 left-0 isolate z-20 h-(--visual-viewport-height) w-full bg-black/25",
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
							{({ close }) => {
								return (
									<Fragment>
										<Button
											className="justify-self-end py-2.5 text-neutral-600 transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
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
