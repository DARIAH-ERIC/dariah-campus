"use client";

import { type ReactNode, useEffect, useId, useState } from "react";

interface MermaidDiagramProps {
	diagram: string;
}

export function MermaidDiagram(props: Readonly<MermaidDiagramProps>): ReactNode {
	const { diagram } = props;

	const id = useId();
	const [svg, setSvg] = useState("");

	useEffect(() => {
		async function render() {
			const { default: mermaid } = await import("mermaid");

			const result = await mermaid.render(id, diagram);
			setSvg(result.svg);
		}

		void render();
	}, [id, diagram]);

	return <figure dangerouslySetInnerHTML={{ __html: svg }} data-mermaid-diagram={true} />;
}
