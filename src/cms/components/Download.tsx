import { type UrlString } from "@/utils/ts/aliases";

export interface DownloadProps {
	url: UrlString;
	title: string;
	fileName?: string;
}

/**
 * Download link.
 */
export function Download(props: DownloadProps): JSX.Element | null {
	const { url, title, fileName } = props;

	if (url.length === 0) return null;

	return (
		<a href={url} download={fileName ?? true}>
			{title}
		</a>
	);
}
