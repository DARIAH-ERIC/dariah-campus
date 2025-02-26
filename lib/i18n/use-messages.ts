import { useMessages } from "next-intl";

export function useMetadata() {
	const { metadata } = useMessages();

	return metadata;
}
