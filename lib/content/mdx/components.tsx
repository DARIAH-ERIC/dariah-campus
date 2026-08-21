import { Callout } from "#/components/content/callout.tsx";
import { Carousel, CarouselItem } from "#/components/content/carousel.tsx";
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
import { LinkButton } from "#/components/content/link-button.tsx";
import { Link as ContentLink } from "#/components/content/link.tsx";
import { MermaidDiagram } from "#/components/content/mermaid-diagram.tsx";
import {
	QuizChoice,
	QuizChoiceAnswer,
	QuizChoiceAnswerErrorMessage,
	QuizChoiceAnswerLabel,
	QuizChoiceQuestion,
} from "#/components/content/quiz-choice.tsx";
import { QuizImageHotspot, QuizImageHotspots } from "#/components/content/quiz-image-hotspots.tsx";
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
	QuizSuccessMessage,
	Tab,
	TableOfContents,
	Tabs,
	Video,
	VideoCard,
};

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
