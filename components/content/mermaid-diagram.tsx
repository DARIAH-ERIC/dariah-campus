"use client";

import { type ReactNode, useEffect, useId, useState } from "react";

import { useDiagramContext } from "@/components/content/diagram";

interface MermaidDiagramProps {
	diagram: string;
}

export function MermaidDiagram(props: Readonly<MermaidDiagramProps>): ReactNode {
	const { diagram } = props;

	const id = useId();
	const [svg, setSvg] = useState("");
	const [href, setHref] = useState<string | null>(null);
	const { link } = useDiagramContext();

	useEffect(() => {
		let isCanceled = false;
		let url: string | null = null;

		async function render() {
			const { default: mermaid } = await import("mermaid");

			const result = await mermaid.render(id, diagram);
			if (isCanceled) return;
			setSvg(result.svg);

			const blob = new Blob([result.svg], { type: "image/svg+xml" });
			url = URL.createObjectURL(blob);
			setHref(url);
		}

		void render();

		return () => {
			isCanceled = true;

			if (url != null) {
				URL.revokeObjectURL(url);
			}
		};
	}, [id, diagram]);

	return (
		<div>
			{/* eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml */}
			<div dangerouslySetInnerHTML={{ __html: svg }} data-mermaid-diagram={true} />
			{link && href != null ? (
				<a
					className="text-xs font-normal italic underline decoration-dotted hover:no-underline"
					href={href}
					rel="noopener noreferrer"
					target="_blank"
				>
					{"View diagram in separate tab."}
				</a>
			) : null}
		</div>
	);
}
