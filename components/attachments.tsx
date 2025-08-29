import type { ReactNode } from "react";

interface AttachmentsProps {
	label: ReactNode;
	attachments: Array<{ label: string; file: string }>;
}

export function Attachments(props: Readonly<AttachmentsProps>): ReactNode {
	const { label, attachments } = props;

	if (attachments.length === 0) {
		return null;
	}

	return (
		<dl className="grid gap-y-0.5 text-sm text-neutral-500">
			<dt className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{label}</dt>
			<dd>
				<ul className="inline text-xs font-medium tracking-wide uppercase">
					{attachments.map((attachment, index) => {
						const { label, file } = attachment;

						return (
							<li key={index} className="leading-none">
								<a download={true} href={file}>
									{label}
								</a>
							</li>
						);
					})}
				</ul>
			</dd>
		</dl>
	);
}
