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
	 * Most of these should be dropped in another transform step for the actual content migration.
	 */
	Page(props: { children: ReactNode; id: string; moduleId: string }) {
		const { children } = props;

		return children;
	},
	PageTitle(_props: { children: ReactNode }) {
		// const { children } = props;

		// TODO: Avoid multiple h1 elements.
		// return <h1>{children}</h1>;

		// FIXME: currently titles are duplicated in markdown
		return null;
	},
	PageIntro(props: { children: ReactNode }) {
		const { children } = props;

		// eslint-disable-next-line tailwindcss/no-custom-classname
		return <div className="lead">{children}</div>;
	},
	PageContent(props: { children: ReactNode }) {
		const { children } = props;

		return children;
	},
	Resource(props: {
		children: ReactNode;
		title: string;
		id: string;
		moduleId: string;
		files: Array<{ file: string }>;
	}) {
		const { files, title } = props;

		return (
			<aside>
				<h2>{title}</h2>
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
	IframeElement(props: { w: number; h: number; alt: string; src: string }) {
		const { src } = props;

		if (src.startsWith("https://www.youtube.com/embed/")) {
			const id = new URL(src).pathname.split("/").pop();

			if (id) {
				return <Video id={id} provider="youtube" />;
			}
		}

		return <Embed src={src} />;
	},
	Assign(props: { children: ReactNode; id: string; moduleId: string }) {
		const { children } = props;

		return children;
	},
	AssignTitle(_props: { children: ReactNode }) {
		// const { children } = props;

		// return <h2>{children}</h2>;

		// FIXME: currently titles are duplicated in markdown
		return null;
	},
	AssignIntro(props: { children: ReactNode }) {
		const { children } = props;

		// eslint-disable-next-line tailwindcss/no-custom-classname
		return <div className="lead">{children}</div>;
	},
	Lesson(props: { children: ReactNode }) {
		const { children } = props;

		return children;
	},
	LessonTitle(_props: { children: ReactNode }) {
		// const { children } = props;

		// return <h2>{children}</h2>;

		// FIXME: currently titles are duplicated in markdown
		return null;
	},
	LessonIntro(props: { children: ReactNode }) {
		const { children } = props;

		// eslint-disable-next-line tailwindcss/no-custom-classname
		return <div className="lead">{children}</div>;
	},
	LessonPage(props: { children: ReactNode; id: string; prev_id: string; next_id: string }) {
		const { children } = props;

		return children;
	},
	LessonPageTitle(_props: { children: ReactNode }) {
		// const { children } = props;

		// return <h3>{children}</h3>;

		// FIXME: currently titles are duplicated in markdown
		return null;
	},
	LessonPageIntro(props: { children: ReactNode }) {
		const { children } = props;

		// eslint-disable-next-line tailwindcss/no-custom-classname
		return <div className="lead">{children}</div>;
	},
	LessonPageContent(props: { children: ReactNode }) {
		const { children } = props;

		return children;
	},
};

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
