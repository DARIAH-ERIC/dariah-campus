import type { ReactNode } from "react";

interface AttachmentsListProps {
	attachments: ReadonlyArray<{ label: string; file: string }>;
	label: string;
}

export function AttachmentsList(props: AttachmentsListProps): ReactNode {
	const { attachments, label } = props;

	if (attachments.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-y-1.5 text-sm text-neutral-500">
			<div className="text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</div>
			<div className="inline">
				<ul className="inline text-xs uppercase tracking-wide">
					{attachments.map((attachment, index) => {
						const { label, file } = attachment;

						return (
							<li key={index} className="list-none">
								<a download={true} href={file}>
									{label}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
