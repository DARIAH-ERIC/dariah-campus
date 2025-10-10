import type { ReactNode } from "react";

import { Callout } from "@/components/content/callout";
import { Diagram, DiagramCaption, DiagramCodeBlock } from "@/components/content/diagram";
import { Disclosure } from "@/components/content/disclosure";
import { Embed } from "@/components/content/embed";
import { ExternalResource } from "@/components/content/external-resource";
import { Figure } from "@/components/content/figure";
import { Grid, GridItem } from "@/components/content/grid";
import { Link as ContentLink } from "@/components/content/link";
import { LinkButton } from "@/components/content/link-button";
import { MermaidDiagram } from "@/components/content/mermaid-diagram";
import { Quiz, QuizErrorMessage, QuizSuccessMessage } from "@/components/content/quiz";
import { QuizChoice, QuizChoiceAnswer, QuizChoiceQuestion } from "@/components/content/quiz-choice";
import { QuizTextInput } from "@/components/content/quiz-text-input";
import { TableOfContents } from "@/components/content/table-of-contents";
import { Tab, Tabs } from "@/components/content/tabs";
import { Video } from "@/components/content/video";
import { VideoCard } from "@/components/content/video-card";
import { Image } from "@/components/image";
import { Link } from "@/components/link";

export const components = {
	a: Link,
	Callout,
	Diagram,
	DiagramCaption,
	DiagramCodeBlock,
	Disclosure,
	Embed,
	ExternalResource,
	Figure,
	Grid,
	GridItem,
	img: Image,
	Link: ContentLink,
	LinkButton,
	MermaidDiagram,
	Quiz,
	QuizChoice,
	QuizChoiceAnswer,
	QuizChoiceQuestion,
	QuizErrorMessage,
	QuizSuccessMessage,
	QuizTextInput,
	Tab,
	TableOfContents,
	Tabs,
	Video,
	VideoCard,

	/**
	 * DARIAH-teach components.
	 *
	 * Need to decide on Resource
	 */
	Resource(
		props: Readonly<{
			children: ReactNode;
			title: string;
			id: string;
			moduleId: string;
			files: Array<{ file: string }>;
		}>,
	): ReactNode {
		const { files } = props;

		return (
			<aside>
				{/* FIXME: currently titles are duplicated in markdown  */}
				{/* <h2>{title}</h2> */}
				<ul role="list">
					{files.map(({ file }, index) => {
						return (
							<li key={index}>
								<a href={file}>{file}</a>
							</li>
						);
					})}
				</ul>
			</aside>
		);
	},
};

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
