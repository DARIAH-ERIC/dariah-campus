export const calloutKinds = [
	{ label: "Caution", value: "caution" },
	{ label: "Important", value: "important" },
	{ label: "Note", value: "note" },
	{ label: "Tip", value: "tip" },
	{ label: "Warning", value: "warning" },
	{ label: "Plain", value: "none" },
] as const;

export type CalloutKind = (typeof calloutKinds)[number]["value"];

export const contentLanguages = [
	{ label: "English", value: "en" },
	{ label: "German", value: "de" },
	{ label: "Swedish", value: "sv" },
] as const;

export type ContentLanguage = (typeof contentLanguages)[number]["value"];

export const contentLicenses = [{ label: "CC BY 4.0", value: "cc-by-4.0" }] as const;

export type ContentLicense = (typeof contentTypes)[number]["value"];

export const contentTypes = [
	{ label: "Audio", value: "audio" },
	{ label: "Slides", value: "slides" },
	{ label: "Training module", value: "training-module" },
	{ label: "Video", value: "video" },
	{ label: "Webinar recording", value: "webinar-recording" },
	{ label: "Website", value: "website" },
] as const;

export type ContentType = (typeof contentTypes)[number]["value"];

export const figureAlignments = [
	{ label: "Center", value: "center" },
	{ label: "Right, 1/4", value: "right-one-fourth" },
	{ label: "Right, 1/3", value: "right-one-third" },
	{ label: "Right, 1/2", value: "right-one-half" },
	{ label: "Right, 2/3", value: "right-two-thirds" },
	{ label: "Stretch", value: "stretch" },
] as const;

export type FigureAlignment = (typeof figureAlignments)[number]["value"];

export const gridAlignments = [
	{ label: "Center", value: "center" },
	{ label: "Stretch", value: "stretch" },
] as const;

export type GridAlignment = (typeof gridAlignments)[number]["value"];

export const gridLayouts = [
	{ label: "Two columns", value: "two-columns" },
	{ label: "Three columns", value: "three-columns" },
	{ label: "Four columns", value: "four-columns" },
	{ label: "Two columns, right is 2x as wide", value: "one-two-columns" },
	{ label: "Two columns, right is 3x as wide", value: "one-three-columns" },
	{ label: "Two columns, right is 4x as wide", value: "one-four-columns" },
] as const;

export type GridLayout = (typeof gridLayouts)[number]["value"];

export const linkKinds = [
	{ label: "Direct URL", value: "external" },
	{ label: "Heading identifier", value: "hash" },
	{ label: "Download", value: "download" },
	{ label: "Events", value: "resources-events" },
	{ label: "External resources", value: "resources-external" },
	{ label: "Hosted resources", value: "resources-hosted" },
	{ label: "Pathfinders", value: "resources-pathfinders" },
	{ label: "Curricula", value: "curricula" },
	{ label: "Search", value: "search" },
	{ label: "Documentation", value: "documentation" },
] as const;

export type LinkKind = (typeof linkKinds)[number]["value"];

export const socialMediaKinds = [
	{ label: "Bluesky", value: "bluesky" },
	{ label: "Email", value: "email" },
	{ label: "Facebook", value: "facebook" },
	{ label: "Flickr", value: "flickr" },
	{ label: "GitHub", value: "github" },
	{ label: "Instagram", value: "instagram" },
	{ label: "LinkedIn", value: "linkedin" },
	{ label: "Mastodon", value: "mastodon" },
	{ label: "ORCID", value: "orcid" },
	{ label: "RSS Feed", value: "rss" },
	{ label: "Twitter", value: "twitter" },
	{ label: "Website", value: "website" },
	{ label: "YouTube", value: "youtube" },
] as const;

export type SocialMediaKind = (typeof socialMediaKinds)[number]["value"];

export const videoProviders = [
	{ label: "Nakala", value: "nakala" },
	{ label: "University of Helsinki", value: "uni-helsinki" },
	{ label: "Vimeo", value: "vimeo" },
	{ label: "YouTube", value: "youtube" },
] as const;

export type VideoProvider = (typeof videoProviders)[number]["value"];
