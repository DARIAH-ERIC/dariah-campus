import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { block, inline, mark, repeating, wrapper } from "@keystatic/core/content-components";
import {
	AppWindowIcon,
	BookIcon,
	CaptionsIcon,
	ChevronDownSquareIcon,
	GridIcon,
	HashIcon,
	ImageIcon,
	InfoIcon,
	LinkIcon,
	ListIcon,
	MessageCircleQuestionIcon,
	SquareIcon,
	SuperscriptIcon,
	VideoIcon,
} from "lucide-react";
/** Required by `scripts/metadata/dump.ts`. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";

import {
	calloutKinds,
	figureAlignments,
	gridAlignments,
	gridLayouts,
	videoProviders,
} from "@/lib/content/options";
import { createLinkSchema } from "@/lib/keystatic/create-link-schema";
import {
	CalloutPreview,
	DisclosurePreview,
	EmbedPreview,
	ExternalResourcePreview,
	FigurePreview,
	GridItemPreview,
	GridPreview,
	HeadingIdPreview,
	LinkButtonPreview,
	QuizChoiceAnswerPreview,
	QuizChoicePreview,
	QuizChoiceQuestionPreview,
	QuizErrorMessagePreview,
	QuizPreview,
	QuizSuccessMessagePreview,
	QuizTextInputPreview,
	TableOfContentsPreview,
	TabPreview,
	TabsPreview,
	VideoCardPreview,
	VideoPreview,
} from "@/lib/keystatic/previews";

export const createCallout = createComponent((_paths, _locale) => {
	return {
		Callout: wrapper({
			label: "Callout",
			description: "Insert a note, tip, warning, or error.",
			icon: <InfoIcon />,
			schema: {
				kind: fields.select({
					label: "Kind",
					options: calloutKinds,
					defaultValue: "note",
				}),
				title: fields.text({
					label: "Title",
					validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<CalloutPreview kind={value.kind} title={value.title}>
						{children}
					</CalloutPreview>
				);
			},
		}),
	};
});

export const createDisclosure = createComponent((_paths, _locale) => {
	return {
		Disclosure: wrapper({
			label: "Disclosure",
			description: "Insert text hidden behind a toggle.",
			icon: <ChevronDownSquareIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return <DisclosurePreview title={value.title}>{children}</DisclosurePreview>;
			},
		}),
	};
});

export const createEmbed = createComponent((_paths, _locale) => {
	return {
		Embed: wrapper({
			label: "Embed",
			description: "Insert content from another website.",
			icon: <AppWindowIcon />,
			schema: {
				src: fields.url({
					label: "URL",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return <EmbedPreview src={value.src}>{children}</EmbedPreview>;
			},
		}),
	};
});

export const createExternalResource = createComponent((_paths, _locale) => {
	return {
		ExternalResource: block({
			label: "External resource",
			description: "Insert an link to an external resource.",
			icon: <BookIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
				subtitle: fields.text({
					label: "Subtitle",
					validation: { isRequired: true },
				}),
				url: fields.url({
					label: "URL",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <ExternalResourcePreview subtitle={value.subtitle} title={value.title} />;
			},
		}),
	};
});

export const createFigure = createComponent((paths, _locale) => {
	return {
		Figure: wrapper({
			label: "Figure",
			description: "Insert an image with caption.",
			icon: <ImageIcon />,
			schema: {
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				alt: fields.text({
					label: "Image description for assistive technology",
					description: "Leave empty if the image is only presentational",
					validation: { isRequired: false },
				}),
				alignment: fields.select({
					label: "Alignment",
					options: figureAlignments,
					defaultValue: "stretch",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<FigurePreview alignment={value.alignment} alt={value.alt} src={value.src}>
						{children}
					</FigurePreview>
				);
			},
		}),
	};
});

export const createFootnote = createComponent((_paths, _locale) => {
	return {
		Footnote: mark({
			label: "Footnote",
			icon: <SuperscriptIcon />,
			schema: {},
			className: "underline decoration-dotted align-super text-sm",
		}),
	};
});

export const createGrid = createComponent((_paths, _locale) => {
	return {
		Grid: repeating({
			label: "Grid",
			description: "Insert a layout grid.",
			icon: <GridIcon />,
			schema: {
				layout: fields.select({
					label: "Layout",
					options: gridLayouts,
					defaultValue: "two-columns",
				}),
				alignment: fields.select({
					label: "Vertical alignment",
					options: gridAlignments,
					defaultValue: "stretch",
				}),
			},
			children: ["GridItem"],
			ContentView(props) {
				const { children, value } = props;

				return (
					<GridPreview alignment={value.alignment} layout={value.layout}>
						{children}
					</GridPreview>
				);
			},
		}),
		GridItem: wrapper({
			label: "Grid item",
			description: "Insert a layout grid cell.",
			icon: <SquareIcon />,
			schema: {
				alignment: fields.select({
					label: "Vertical alignment",
					options: gridAlignments,
					defaultValue: "stretch",
				}),
			},
			forSpecificLocations: true,
			ContentView(props) {
				const { children, value } = props;

				return <GridItemPreview alignment={value.alignment}>{children}</GridItemPreview>;
			},
		}),
	};
});

export const createHeadingId = createComponent((_paths, _locale) => {
	return {
		HeadingId: inline({
			label: "Heading identifier",
			description: "Add a custom link target to a heading.",
			icon: <HashIcon />,
			schema: {
				id: fields.text({
					label: "ID",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <HeadingIdPreview>{value.id}</HeadingIdPreview>;
			},
		}),
	};
});

export const createLink = createComponent((paths, locale) => {
	return {
		Link: mark({
			label: "Link",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(paths.downloadPath, locale),
			},
			tag: "a",
		}),
	};
});

export const createLinkButton = createComponent((paths, locale) => {
	return {
		LinkButton: wrapper({
			label: "LinkButton",
			description: "Insert a link, which looks like a button.",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(paths.downloadPath, locale),
			},
			ContentView(props) {
				const { children, value } = props;

				return <LinkButtonPreview link={value.link}>{children}</LinkButtonPreview>;
			},
		}),
	};
});

export const createQuiz = createComponent((_paths, _locale) => {
	return {
		Quiz: repeating({
			label: "Quiz",
			description: "An interactive quiz.",
			icon: <MessageCircleQuestionIcon />,
			children: ["QuizChoice", "QuizTextInput"],
			validation: { children: { min: 1 } },
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizPreview>{children}</QuizPreview>;
			},
		}),
		QuizChoice: repeating({
			label: "Choice quiz",
			description: "A single or multiple choice quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			children: [
				"QuizChoiceQuestion",
				"QuizChoiceAnswer",
				"QuizSuccessMessage",
				"QuizErrorMessage",
			],
			validation: { children: { min: 1 } },
			schema: {
				variant: fields.select({
					label: "Variant",
					options: [
						{ label: "Single choice", value: "single" },
						{ label: "Multiple choice", value: "multiple" },
					],
					defaultValue: "multiple",
				}),
				buttonLabel: fields.text({
					label: "Button label",
					description: "Custom label for 'Check answer' button.",
					validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<QuizChoicePreview buttonLabel={value.buttonLabel} variant={value.variant}>
						{children}
					</QuizChoicePreview>
				);
			},
		}),
		QuizChoiceAnswer: wrapper({
			label: "Answer",
			description: "An answer in a single/multiple choice quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {
				kind: fields.select({
					label: "Kind",
					options: [
						{ label: "Correct", value: "correct" },
						{ label: "Incorrect", value: "incorrect" },
					],
					defaultValue: "incorrect",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return <QuizChoiceAnswerPreview kind={value.kind}>{children}</QuizChoiceAnswerPreview>;
			},
		}),
		QuizChoiceQuestion: wrapper({
			label: "Question",
			description: "A question in a single/multiple choice quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizChoiceQuestionPreview>{children}</QuizChoiceQuestionPreview>;
			},
		}),
		QuizErrorMessage: wrapper({
			label: "Quiz error message",
			description: "Help text for incorrect answers.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizErrorMessagePreview>{children}</QuizErrorMessagePreview>;
			},
		}),
		QuizSuccessMessage: wrapper({
			label: "Quiz success message",
			description: "Help text for correct answers.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizSuccessMessagePreview>{children}</QuizSuccessMessagePreview>;
			},
		}),
		QuizTextInput: wrapper({
			label: "Text input quiz.",
			description: "A text input quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizTextInputPreview>{children}</QuizTextInputPreview>;
			},
		}),
	};
});

export const createTableOfContents = createComponent((_paths, _locale) => {
	return {
		TableOfContents: block({
			label: "Table of contents",
			description: "Insert a table of contents.",
			icon: <ListIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <TableOfContentsPreview title={value.title} />;
			},
		}),
	};
});

export const createTabs = createComponent((_paths, _locale) => {
	return {
		Tabs: repeating({
			label: "Tabs",
			description: "Insert tabs.",
			icon: <CaptionsIcon />,
			schema: {},
			children: ["Tab"],
			ContentView(props) {
				const { children } = props;

				return <TabsPreview>{children}</TabsPreview>;
			},
		}),
		Tab: wrapper({
			label: "Tab",
			description: "Insert a tab panel.",
			icon: <CaptionsIcon />,
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
			},
			forSpecificLocations: true,
			ContentView(props) {
				const { children, value } = props;

				return <TabPreview title={value.title}>{children}</TabPreview>;
			},
		}),
	};
});

export const createVideo = createComponent((_paths, _locale) => {
	return {
		Video: wrapper({
			label: "Video",
			description: "Insert a video.",
			icon: <VideoIcon />,
			schema: {
				provider: fields.select({
					label: "Provider",
					options: videoProviders,
					defaultValue: "youtube",
				}),
				id: fields.text({
					label: "Video ID",
					validation: { isRequired: true },
				}),
				startTime: fields.number({
					label: "Start time",
					validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<VideoPreview id={value.id} provider={value.provider} startTime={value.startTime}>
						{children}
					</VideoPreview>
				);
			},
		}),
	};
});

export const createVideoCard = createComponent((paths, _locale) => {
	return {
		VideoCard: block({
			label: "Video card",
			description: "Insert an video card.",
			icon: <VideoIcon />,
			schema: {
				provider: fields.select({
					label: "Provider",
					options: videoProviders,
					defaultValue: "youtube",
				}),
				id: fields.text({
					label: "Video ID",
					validation: { isRequired: true },
				}),
				startTime: fields.number({
					label: "Start time",
					validation: { isRequired: false },
				}),
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
				subtitle: fields.text({
					label: "Subtitle",
					validation: { isRequired: false },
				}),
				image: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
			},
			ContentView(props) {
				const { value } = props;

				return (
					<VideoCardPreview
						id={value.id}
						image={value.image}
						provider={value.provider}
						startTime={value.startTime}
						subtitle={value.subtitle}
						title={value.title}
					/>
				);
			},
		}),
	};
});
