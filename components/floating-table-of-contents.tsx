"use client";

import type { TableOfContents as TableOfContentsTree } from "@acdh-oeaw/mdx-lib";
import cn from "clsx/lite";
import { TableOfContentsIcon, XIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";

import { TableOfContents } from "#/components/table-of-contents.tsx";

interface FloatingTableOfContentsProps {
	closeLabel: string;
	currentSectionId?: string;
	headingSections?: Record<string, string>;
	label: string;
	tableOfContents: TableOfContentsTree;
	toggleLabel: string;
}

export function FloatingTableOfContents(props: Readonly<FloatingTableOfContentsProps>): ReactNode {
	const { closeLabel, currentSectionId, headingSections, label, tableOfContents, toggleLabel } = props;

	return (
		<nav aria-label={label}>
			<DialogTrigger>
				<Button className="fixed inset-e-6 inset-be-6 z-10 flex items-center justify-center rounded-full bg-brand-700 text-white shadow-lg block-12 inline-12">
					<span className="sr-only">{toggleLabel}</span>
					<TableOfContentsIcon className="p-2 block-10 inline-10" />
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
							{({ close }) => (
								<Fragment>
									<Button
										className="justify-self-end py-2.5 text-neutral-600 transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
										slot="close"
									>
										<span className="sr-only">{closeLabel}</span>
										<XIcon aria-hidden={true} className="block-6 inline-6" />
									</Button>

									<TableOfContents
										currentSectionId={currentSectionId}
										headingSections={headingSections}
										onChange={() => {
											requestAnimationFrame(() => {
												close();
											});
										}}
										tableOfContents={tableOfContents}
										variant="panel"
									/>
								</Fragment>
							)}
						</Dialog>
					</Modal>
				</ModalOverlay>
			</DialogTrigger>
		</nav>
	);
}
