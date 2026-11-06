import type { ReactNode } from "react";

import { Callout } from "#/components/content/callout.tsx";
import { Carousel, CarouselItem } from "#/components/content/carousel.tsx";
import { ContentSection } from "#/components/content/content-section.tsx";
import { Diagram, DiagramCaption, DiagramCodeBlock } from "#/components/content/diagram.tsx";
import { Disclosure } from "#/components/content/disclosure.tsx";
import { Drop, QuizDragTheWords } from "#/components/content/drag-the-words.tsx";
import { Embed } from "#/components/content/embed.tsx";
import { ExternalResource } from "#/components/content/external-resource.tsx";
import { Figure } from "#/components/content/figure.tsx";
import { Blank, QuizFillInTheBlank } from "#/components/content/fill-in-the-blank.tsx";
import { Grid, GridItem } from "#/components/content/grid.tsx";
import { ImageComparisonSlider } from "#/components/content/image-comparison-slider.tsx";
import { QuizImageDropZone, QuizImageDropZones } from "#/components/content/image-drop-zones.tsx";
import { ImageLayer, ImageLayers } from "#/components/content/image-layers.tsx";
import { Language, LanguageBlock } from "#/components/content/language.tsx";
import { LinkButton } from "#/components/content/link-button.tsx";
import { Link as ContentLink } from "#/components/content/link.tsx";
import { QuizMatching, QuizMatchingZone } from "#/components/content/matching.tsx";
import { MermaidDiagram } from "#/components/content/mermaid-diagram.tsx";
import { QuizOrdering, QuizOrderingItem } from "#/components/content/ordering.tsx";
import {
	QuizChoice,
	QuizChoiceAnswer,
	QuizChoiceAnswerErrorMessage,
	QuizChoiceAnswerLabel,
	QuizChoiceQuestion,
} from "#/components/content/quiz-choice.tsx";
import { QuizImageHotspot, QuizImageHotspots } from "#/components/content/quiz-image-hotspots.tsx";
import { QuizQuestion } from "#/components/content/quiz-question.tsx";
import { Quiz, QuizErrorMessage, QuizSuccessMessage } from "#/components/content/quiz.tsx";
import { TableOfContents } from "#/components/content/table-of-contents.tsx";
import { Tab, Tabs } from "#/components/content/tabs.tsx";
import { VideoCard } from "#/components/content/video-card.tsx";
import { Video } from "#/components/content/video.tsx";
import {
	Worksheet,
	WorksheetDescription,
	WorksheetQuestion,
	WorksheetSection,
	WorksheetSectionDescription,
} from "#/components/content/worksheet.tsx";
import { Image } from "#/components/image.tsx";
import { Link } from "#/components/link.tsx";

export const components = {
	a: Link,
	Blank,
	Callout,
	Carousel,
	CarouselItem,
	ContentSection,
	Diagram,
	DiagramCaption,
	DiagramCodeBlock,
	Disclosure,
	Worksheet,
	WorksheetDescription,
	WorksheetQuestion,
	WorksheetSection,
	WorksheetSectionDescription,
	Drop,
	Embed,
	ExternalResource,
	Figure,
	Grid,
	GridItem,
	img: Image,
	ImageComparisonSlider,
	Language,
	LanguageBlock,
	ImageLayer,
	ImageLayers,
	Link: ContentLink,
	LinkButton,
	MermaidDiagram,
	Quiz,
	QuizChoice,
	QuizChoiceAnswer,
	QuizChoiceAnswerErrorMessage,
	QuizChoiceAnswerLabel,
	QuizChoiceQuestion,
	QuizErrorMessage,
	QuizDragTheWords,
	QuizFillInTheBlank,
	QuizImageDropZone,
	QuizImageDropZones,
	QuizImageHotspot,
	QuizImageHotspots,
	QuizMatching,
	QuizMatchingZone,
	QuizOrdering,
	QuizOrderingItem,
	QuizQuestion,
	QuizSuccessMessage,
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
	Page(props: Readonly<{ children: ReactNode; id: string; moduleId: string }>): ReactNode {
		const { children } = props;

		return children;
	},
	PageTitle(_props: Readonly<{ children: ReactNode }>): ReactNode {
		// const { children } = props;

		// TODO: Avoid multiple h1 elements.
		// return <h1>{children}</h1>;

		// FIXME: currently titles are duplicated in markdown
		return null;
	},
	PageIntro(props: Readonly<{ children: ReactNode }>): ReactNode {
		const { children } = props;

		return <div className="lead">{children}</div>;
	},
	PageContent(props: Readonly<{ children: ReactNode }>): ReactNode {
		const { children } = props;

		return children;
	},
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
					{files.map(({ file }, index) => (
						<li key={index}>
							<a href={file}>{file}</a>
						</li>
					))}
				</ul>
			</aside>
		);
	},
	IframeElement(props: Readonly<{ w: number; h: number; alt: string; src: string }>): ReactNode {
		const { src } = props;

		if (src.startsWith("https://www.youtube.com/embed/")) {
			const id = new URL(src).pathname.split("/").pop();

			if (id != null && id !== "") {
				return <Video id={id} provider="youtube" />;
			}
		}

		return <Embed src={src} />;
	},
	Assign(props: Readonly<{ children: ReactNode; id: string; moduleId: string }>): ReactNode {
		const { children } = props;

		return children;
	},
	AssignTitle(_props: Readonly<{ children: ReactNode }>): ReactNode {
		// const { children } = props;

		// return <h2>{children}</h2>;

		// FIXME: currently titles are duplicated in markdown
		return null;
	},
	AssignIntro(props: Readonly<{ children: ReactNode }>): ReactNode {
		const { children } = props;

		return <div>{children}</div>;
	},
	Lesson(props: Readonly<{ children: ReactNode }>): ReactNode {
		const { children } = props;

		return children;
	},
	LessonTitle(_props: Readonly<{ children: ReactNode }>): ReactNode {
		// const { children } = props;

		// return <h2>{children}</h2>;

		// FIXME: currently titles are duplicated in markdown
		return null;
	},
	LessonIntro(props: Readonly<{ children: ReactNode }>): ReactNode {
		const { children } = props;

		return <div>{children}</div>;
	},
	LessonPage(props: { children: ReactNode; id: string; prev_id: string; next_id: string }): ReactNode {
		const { children } = props;

		return children;
	},
	LessonPageTitle(_props: Readonly<{ children: ReactNode }>): ReactNode {
		// const { children } = props;

		// return <h3>{children}</h3>;

		// FIXME: currently titles are duplicated in markdown
		return null;
	},
	LessonPageIntro(props: Readonly<{ children: ReactNode }>): ReactNode {
		const { children } = props;

		return <div>{children}</div>;
	},
	LessonPageContent(props: Readonly<{ children: ReactNode }>): ReactNode {
		const { children } = props;

		return children;
	},
};

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
