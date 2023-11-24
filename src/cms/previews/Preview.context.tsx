import { type PreviewTemplateComponentProps } from "decap-cms-core";
import { createContext, type ReactNode, useContext, useMemo } from "react";

interface PreviewContextValues {
	/**
	 * The preview iframe's `document`.
	 */
	document?: Document;
	isPreview?: boolean;
}

const PreviewContext = createContext<PreviewContextValues>({});

export interface PreviewProviderProps extends PreviewTemplateComponentProps {
	children: ReactNode;
}

/**
 * Provides preview iframe values via context.
 */
export function PreviewProvider(props: PreviewProviderProps): JSX.Element {
	const { document, children } = props;

	const context = useMemo(() => {
		return { document, isPreview: true };
	}, [document]);

	return <PreviewContext.Provider value={context}>{children}</PreviewContext.Provider>;
}

export function usePreview(): PreviewContextValues {
	return useContext(PreviewContext);
}
