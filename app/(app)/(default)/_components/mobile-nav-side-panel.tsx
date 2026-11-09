"use client";

import cn from "clsx/lite";
import { MenuIcon, XIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";

import { Link } from "#/components/link.tsx";

interface MobileNavSidePanelProps {
	closeLabel: string;
	label: string;
	navigation: Record<string, { href: string; label: string }>;
	triggerLabel: string;
}

export function MobileNavSidePanel(props: Readonly<MobileNavSidePanelProps>): ReactNode {
	const { closeLabel, label, navigation, triggerLabel } = props;

	return (
		<DialogTrigger>
			<Button className="-me-2.5 rounded-sm p-2.5 text-neutral-600 transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700">
				<span className="sr-only">{triggerLabel}</span>
				<MenuIcon aria-hidden={true} className="shrink-0 block-6 inline-6" />
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
						className="relative grid content-start gap-y-8 overflow-auto px-6 py-8 outline-none block-full max-block-[inherit]"
					>
						{({ close }) => (
							<Fragment>
								<Button
									className="justify-self-end rounded-sm p-2.5 text-neutral-600 transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
									slot="close"
								>
									<span className="sr-only">{closeLabel}</span>
									<XIcon aria-hidden={true} className="block-6 inline-6" />
								</Button>

								<ul className="grid content-start gap-y-2" role="list">
									{Object.entries(navigation).map(([key, link]) => (
										<li key={key}>
											<Link
												className="flex rounded-sm px-2 py-2.5 hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
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
									))}
								</ul>
							</Fragment>
						)}
					</Dialog>
				</Modal>
			</ModalOverlay>
		</DialogTrigger>
	);
}
