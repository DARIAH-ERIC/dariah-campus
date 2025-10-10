import { Callout } from "@/components/content/callout";
import { Diagram, DiagramCaption, DiagramCodeBlock } from "@/components/content/diagram";
import { Disclosure } from "@/components/content/disclosure";
import { Embed } from "@/components/content/embed";
import { ExternalResource } from "@/components/content/external-resource";
import { Figure } from "@/components/content/figure";
import { Grid, GridItem } from "@/components/content/grid";
import { ImageSlider } from "@/components/content/image-slider";
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
	ImageSlider,
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
};

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
