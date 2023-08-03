import { type ReactNode } from "react";
import { type OverlayTriggerState } from "react-stately";

import CloseIcon from "@/assets/icons/x.svg?symbol";
import { Icon } from "@/common/Icon";
import { ModalDialog } from "@/common/ModalDialog";

export interface LightBoxProps extends OverlayTriggerState {
	children: ReactNode;
	caption?: string;
}

/**
 * LightBox.
 */
export function LightBox(props: LightBoxProps): JSX.Element | null {
	if (!props.isOpen) return null;

	return (
		<ModalDialog aria-label="Media lightbox" state={props}>
			<div className="absolute inset-0 flex flex-col justify-between p-4 space-y-4 text-white bg-neutral-800">
				<header className="flex justify-end">
					<button
						onClick={props.close}
						className="transition rounded-full hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-white"
					>
						<Icon icon={CloseIcon} className="w-10 h-10 p-2" />
						<span className="sr-only">Close</span>
					</button>
				</header>
				<div className="relative flex-1 p-4 overflow-hidden max-w-[calc((16/9*100vh)-264px)] mx-auto w-full">
					{props.children}
				</div>
				<footer>{props.caption}</footer>
			</div>
		</ModalDialog>
	);
}
