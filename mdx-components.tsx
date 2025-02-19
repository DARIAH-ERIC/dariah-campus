import { Callout } from "@/components/content/callout";
import { Disclosure } from "@/components/content/disclosure";
import { Embed } from "@/components/content/embed";
import { ExternalResource } from "@/components/content/external-resource";
import { Figure } from "@/components/content/figure";
import { Grid, GridItem } from "@/components/content/grid";
import { Link as ContentLink } from "@/components/content/link";
import { LinkButton } from "@/components/content/link-button";
import { Quiz, QuizErrorMessage, QuizSuccessMessage } from "@/components/content/quiz";
import { QuizChoice, QuizChoiceAnswer, QuizChoiceQuestion } from "@/components/content/quiz-choice";
import { QuizTextInput } from "@/components/content/quiz-text-input";
import { ServerImage as Image } from "@/components/content/server-image";
import { TableOfContents } from "@/components/content/table-of-contents";
import { Tab, Tabs } from "@/components/content/tabs";
import { Video } from "@/components/content/video";
import { VideoCard } from "@/components/content/video-card";
import { Link } from "@/components/link";

const components = {
	a: Link,
	Callout,
	Disclosure,
	Embed,
	ExternalResource,
	Figure,
	Grid,
	GridItem,
	img: Image,
	Link: ContentLink,
	LinkButton,
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

declare global {
	type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
