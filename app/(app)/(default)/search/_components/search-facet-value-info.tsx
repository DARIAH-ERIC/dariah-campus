"use client";

import cn from "clsx/lite";
import { InfoIcon, LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { StaticImageData } from "next/image";
import { type ReactNode, useState } from "react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";

import { getPersonDescription } from "#/app/(app)/(default)/search/_lib/get-person-description.ts";
import { Image } from "#/components/image.tsx";

interface SearchFacetValueInfoProps {
	id: string;
	image: StaticImageData | string | undefined;
	label: string;
	name: string;
}

/**
 * The contextual variant: a secondary control on a filter chip which opens a popover describing the value it refines
 * by. Used for people, who have no page of their own to link to.
 */
export function SearchFacetValueInfo(props: Readonly<SearchFacetValueInfoProps>): ReactNode {
	const { id, image, label, name } = props;

	const t = useTranslations("SearchPage");
	const [description, setDescription] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	function onOpenChange(isOpen: boolean) {
		/** Fetched once per chip, on first open, and kept for as long as the refinement stays. */
		if (!isOpen || description != null || isLoading) {
			return;
		}

		setIsLoading(true);
		getPersonDescription(id)
			.then(setDescription)
			.catch(() => {
				/** The name and the portrait are still worth showing without it. */
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	return (
		<DialogTrigger onOpenChange={onOpenChange}>
			<Button
				className="rounded-full p-0.5 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
				aria-label={label}
				/** Inside a `Tag`, `ButtonContext` only offers a `remove` slot - this trigger is not it. */
				slot={null}
			>
				<InfoIcon aria-hidden={true} className="block-4 inline-4" />
			</Button>

			<Popover
				className={cn(
					"rounded-lg border border-neutral-200 bg-white shadow-lg outline-none inline-[min(100vw-2rem,20rem)]",
					"entering:animate-in entering:duration-150 entering:ease-out entering:fade-in",
					"exiting:animate-out exiting:duration-100 exiting:ease-in exiting:fade-out",
				)}
				placement="bottom start"
			>
				<Dialog aria-label={name} className="grid gap-y-2 p-4 outline-none">
					<div className="flex items-center gap-x-3">
						{image == null ? null : (
							<Image
								alt=""
								className="shrink-0 rounded-full object-cover block-10 inline-10"
								height={40}
								src={image}
								width={40}
							/>
						)}
						<span className="font-bold">{name}</span>
					</div>

					{description == null ? null : <p className="text-sm text-neutral-600">{description}</p>}

					{isLoading ? (
						<div className="flex items-center gap-x-2 text-sm text-neutral-500" role="status">
							<LoaderCircleIcon aria-hidden={true} className="animate-spin block-4 inline-4" />
							<span>{t("loading")}</span>
						</div>
					) : null}
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
}
