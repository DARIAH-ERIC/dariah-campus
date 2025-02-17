"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { MenuIcon, XIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";

import { Link } from "@/components/link";

interface MobileNavSidePanelProps {
	closeLabel: string;
	label: string;
	navigation: Record<string, { href: string; label: string }>;
	triggerLabel: string;
}

export function MobileNavSidePanel(props: MobileNavSidePanelProps): ReactNode {
	const { closeLabel, label, navigation, triggerLabel } = props;

	return (
		<DialogTrigger>
			<Button className="text-neutral-600 transition hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
				<span className="sr-only">{triggerLabel}</span>
				<MenuIcon aria-hidden={true} className="size-6 shrink-0" />
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
										className="justify-self-end text-neutral-600 transition hover:text-primary-600 focus-visible:ring focus-visible:ring-primary-600"
										slot="close"
									>
										<span className="sr-only">{closeLabel}</span>
										<XIcon aria-hidden={true} className="size-6" />
									</Button>

									<ul className="grid content-start gap-y-3" role="list">
										{Object.entries(navigation).map(([key, link]) => {
											return (
												<li key={key}>
													<Link
														className="flex rounded hover:text-primary-600 focus-visible:ring focus-visible:ring-primary-600"
														href={link.href}
														onPress={() => {
															requestAnimationFrame(() => {
																close();
															});
														}}
													>
														{link.label}
													</Link>
												</li>
											);
										})}
									</ul>
								</Fragment>
							);
						}}
					</Dialog>
				</Modal>
			</ModalOverlay>
		</DialogTrigger>
	);
}
