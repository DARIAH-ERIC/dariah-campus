import type { ReactNode } from "react";

export interface QuizExplanation {
	definition: ReactNode;
	id: string;
	term: string;
}

interface QuizExplanationsProps {
	entries: Array<QuizExplanation>;
	label: string;
}

/**
 * What the parts of an exercise mean, held back until it has been answered so it explains them instead of solving them.
 * Renders nothing for an exercise nobody explained, so the caller need not check.
 */
export function QuizExplanations(props: Readonly<QuizExplanationsProps>): ReactNode {
	const { entries, label } = props;

	if (entries.length === 0) {
		return null;
	}

	return (
		<div className="grid gap-y-2">
			{/* A widget must emit no headings, or it would turn up in the table of contents - see `Callout`. */}
			<strong className="not-prose text-sm font-bold text-neutral-600">{label}</strong>

			<dl className="grid gap-y-3">
				{entries.map((entry) => (
					<div key={entry.id} className="grid gap-y-1">
						<dt className="not-prose text-sm font-medium text-neutral-700">{entry.term}</dt>
						<dd className="ms-0 text-sm text-neutral-700 **:first:mbs-0 **:last:mbe-0">{entry.definition}</dd>
					</div>
				))}
			</dl>
		</div>
	);
}
