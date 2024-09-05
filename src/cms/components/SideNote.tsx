import cx from "clsx";
import { type FC, type ReactNode, type SVGProps } from "react";

import AlertIcon from "@/assets/icons/exclamation.svg?symbol";
import InfoIcon from "@/assets/icons/info.svg?symbol";
import LightBulbIcon from "@/assets/icons/light-bulb.svg?symbol";
import LightningBoltIcon from "@/assets/icons/lightning-bolt.svg?symbol";
import PencilIcon from "@/assets/icons/pencil.svg?symbol";
import { Icon } from "@/common/Icon";
import { capitalize } from "@/utils/capitalize";

export const types = ["danger", "info", "note", "tip", "warning"] as const;

export type SideNoteType = (typeof types)[number];

export interface SideNoteProps {
	/**
	 * SideNote type.
	 *
	 * @default "note"
	 */
	type?: SideNoteType;
	/**
	 * Optional title. Defaults to value of `type`.
	 */
	title?: string;
	children: ReactNode;
}

const styles: Record<SideNoteType, string> = {
	note: "bg-neutral-100 border-neutral-600 text-neutral-800",
	info: "bg-blue-50 border-blue-600 text-blue-800",
	tip: "bg-green-50 border-green-600 text-green-800",
	warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
	danger: "bg-red-50 border-red-600 text-red-800",
};

const icons: Record<SideNoteType, FC<SVGProps<SVGSVGElement>>> = {
	note: PencilIcon,
	info: InfoIcon,
	tip: LightBulbIcon,
	warning: AlertIcon,
	danger: LightningBoltIcon,
};

/**
 * SideNote.
 */
export function SideNote(props: SideNoteProps): JSX.Element {
	/** In the CMS preview, props can be anything, so be extra careful. */
	const type = props.type !== undefined && types.includes(props.type) ? props.type : "note";
	const title = props.title ?? capitalize(type);

	return (
		<aside className={cx("border-l-4 px-6 py-6 my-12 space-y-3 rounded", styles[type])}>
			<strong className="flex items-center space-x-2 font-bold">
				<Icon icon={icons[type]} className="flex-shrink-0" />
				<span>{title}</span>
			</strong>
			<div className="underlined-links">{props.children}</div>
		</aside>
	);
}
