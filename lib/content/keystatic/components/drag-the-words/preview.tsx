/* eslint-disable react/jsx-no-literals */

import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

interface DragTheWordsPreviewProps {
	children: ReactNode;
}

export function DragTheWordsPreview(props: Readonly<DragTheWordsPreviewProps>): ReactNode {
	const { children } = props;

	return (
		<div className="grid gap-y-2 rounded-md border border-neutral-200 p-4">
			<NotEditable>
				<p className="text-xs text-neutral-500">
					Use this syntax to create blanks (with optional hint):
				</p>
				<table className="w-full text-xs text-neutral-500">
					<tbody>
						<tr>
							<td className="pr-3 font-mono">{"@@answer@@"}</td>
							<td>Single accepted answer</td>
						</tr>
						<tr>
							<td className="pr-3 font-mono">{"@@answer::hint@@"}</td>
							<td>Answer with hint</td>
						</tr>
					</tbody>
				</table>
			</NotEditable>
			{children}
		</div>
	);
}
