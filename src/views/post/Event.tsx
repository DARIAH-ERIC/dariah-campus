import cx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, OverlayArrow, Tooltip, TooltipTrigger } from "react-aria-components";
import {
	FaCheck,
	FaClipboard,
	FaCloud,
	FaEnvelope,
	FaFilePdf,
	FaFlickr,
	FaGlobe,
	FaTwitter,
} from "react-icons/fa";
import { type OverlayTriggerState, useOverlayTriggerState } from "react-stately";

import OrcidIcon from "@/assets/icons/brand/orcid.svg?symbol";
import AvatarIcon from "@/assets/icons/user.svg?symbol";
import CloseIcon from "@/assets/icons/x.svg?symbol";
import { type Event as EventData, type EventMetadata } from "@/cms/api/events.api";
import { Figure } from "@/cms/components/Figure";
import { Video } from "@/cms/components/Video";
import { getFullName } from "@/cms/utils/getFullName";
import { Icon } from "@/common/Icon";
import { ModalDialog } from "@/common/ModalDialog";
import { PageContent } from "@/common/PageContent";
import { ResponsiveImage } from "@/common/ResponsiveImage";
import { Mdx as EventContent, Mdx } from "@/mdx/Mdx";
import { isNonEmptyString } from "@/utils/isNonEmptyString";

export interface EventProps {
	event: EventData;
	isPreview?: boolean;
}

/**
 * Event resource.
 */
export function Event(props: EventProps): JSX.Element {
	const { event } = props;
	const { metadata } = event.data;

	const aboutDialog = useOverlayTriggerState({});
	const prepDialog = useOverlayTriggerState({});

	return (
		<PageContent>
			<EventOverview event={event} aboutDialog={aboutDialog} prepDialog={prepDialog} />
			<div className="body__borders">
				<EventSessions
					sessions={metadata.sessions}
					// downloads={metadata.downloads}
					meta={metadata}
				/>
				<EventSideNav sessions={metadata.sessions} />
			</div>
			<EventFooter
				event={event}
				hasAboutOverlay={Boolean(metadata.about)}
				hasPrepOverlay={Boolean(metadata.prep)}
				aboutDialog={aboutDialog}
				prepDialog={prepDialog}
			/>
		</PageContent>
	);
}

interface EventOverviewProps {
	event: EventProps["event"];
	aboutDialog: OverlayTriggerState;
	prepDialog: OverlayTriggerState;
}

/**
 * Event overview.
 */
function EventOverview(props: EventOverviewProps) {
	const { event, aboutDialog, prepDialog } = props;
	const { metadata } = event.data;
	const { about, prep, featuredImage, logo, sessions, social, eventType, title } = metadata;

	return (
		<section id="body" className="!h-screen !min-h-screen w-full home">
			{featuredImage != null ? (
				<>
					{/* FIXME: next/image does not support blob */}
					{typeof featuredImage === "string" && featuredImage.startsWith("blob:") ? (
						<img
							src={featuredImage}
							alt=""
							loading="lazy"
							className="absolute inset-0 object-cover h-full"
						/>
					) : (
						<Image src={featuredImage} alt="" fill className="object-cover" priority />
					)}
					<div className="bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.65)] absolute inset-0" />
				</>
			) : null}

			<div className="home__wrapper-1">
				<div className="home__wrapper-2">
					<div className="home__wrapper-3">
						<div className="relative home__main">
							{logo != null ? (
								<div className="absolute bottom-full left-[-3.125vw] w-32">
									{/* FIXME: next/image does not support blob */}
									{typeof logo === "string" && logo.startsWith("blob:") ? (
										<img
											src={logo}
											alt=""
											loading="lazy"
											className="absolute inset-0 object-cover h-full"
										/>
									) : (
										<Image src={logo} alt="" fill className="object-cover" />
									)}
								</div>
							) : null}

							<h1 className="font-bold h1">
								<span>{eventType}</span>
							</h1>
							<h2 className="font-bold h2">
								<span>{title}</span>
							</h2>

							<EventContent
								{...event}
								components={{
									a: function EventOverlayLink(props) {
										return (
											<a href={props.href} target="_blank" rel="noopener noreferrer">
												{props.children}
											</a>
										);
									},
									h2: function EventSubtitle() {
										return null;
										// return (
										//   <h2 className="font-bold h2">
										//     <span>{props.children}</span>
										//   </h2>
										// )
									},
									p: function EventIntro(props) {
										return <p className="home__intro">{props.children}</p>;
									},
									Figure,
									Image: ResponsiveImage,
								}}
							/>

							<EventToc sessions={sessions} />
						</div>

						<aside className="home__aside">
							<EventSocialLinks social={social} meta={metadata} />
							<EventNav
								hasAboutOverlay={Boolean(metadata.about)}
								hasPrepOverlay={Boolean(metadata.prep)}
								aboutDialog={aboutDialog}
								prepDialog={prepDialog}
								social={metadata.social}
								synthesis={metadata.synthesis}
							/>
						</aside>
					</div>
				</div>
			</div>

			{aboutDialog.isOpen && about != null ? (
				<EventOverlay content={about.code} label="About the event" state={aboutDialog} />
			) : null}

			{prepDialog.isOpen && prep != null ? (
				<EventOverlay content={prep.code} label="Notes for preparation" state={prepDialog} />
			) : null}
		</section>
	);
}

interface EventOverlayProps {
	content: string;
	label: string;
	state: OverlayTriggerState;
}

/**
 * Event overlay.
 */
function EventOverlay(props: EventOverlayProps) {
	const { content, label, state } = props;

	return (
		<ModalDialog
			aria-label={label}
			state={state}
			isDismissable
			style={{ padding: 0, overflowY: "auto" }}
			className="max-w-screen-2xl"
		>
			<div className="popin-content flex flex-col relative bg-[#0870ac] shadow-md px-[6.25vw]">
				<button
					onClick={state.close}
					className="popin-closer rounded-full text-white text-4xl absolute right-[1.5625vw] top-[1.5625vw] opacity-75 transition duration-[400ms] ease-out hover:opacity-100 hover:duration-150"
				>
					<span className="sr-only">Close</span>
					<Icon icon={CloseIcon} className="" />
				</button>

				<div className="popin-core bg-white px-[6.25vw] py-[3.125vw]">
					<h1 id="about" className="relative mb-20 text-6xl font-bold uppercase h1">
						About
					</h1>
					<Mdx
						code={content}
						components={{
							a: function EventOverlayLink(props) {
								return (
									<a
										href={props.href}
										className="transition text-event-violet1 hover:text-event-violet2"
										target="_blank"
										rel="noopener noreferrer"
									>
										{props.children}
									</a>
								);
							},
							h1: function EventOverlayHeading(props) {
								return <h1 className="relative font-bold h1">{props.children}</h1>;
							},
							h2: function EventOverlaySubheading(props) {
								return <h2 className="relative font-bold h3">{props.children}</h2>;
							},
							p: function EventOverlayParagraph(props) {
								return <p className="my-4 leading-relaxed">{props.children}</p>;
							},
							ul: function EventOverlayList(props) {
								return <ul className="list-disc">{props.children}</ul>;
							},
							Figure,
							Image: ResponsiveImage,
						}}
					/>
				</div>
			</div>
		</ModalDialog>
	);
}

interface EventTocProps {
	sessions: EventProps["event"]["data"]["metadata"]["sessions"];
}

/**
 * Event table of contents (sessions).
 */
function EventToc(props: EventTocProps) {
	const { sessions } = props;

	return (
		<ul className="home__index">
			{sessions.map((session, index) => {
				return (
					<li key={index}>
						<a href={`#session-${index}`}>
							<small>
								<span>Session {index + 1}</span>
							</small>
							<strong>{session.title}</strong>
						</a>
					</li>
				);
			})}
		</ul>
	);
}

interface EventSocialLinksProps {
	social: EventProps["event"]["data"]["metadata"]["social"];
	meta: EventMetadata;
}
/**
 * Event social media links.
 */
function EventSocialLinks(props: EventSocialLinksProps) {
	const { social = {}, meta } = props;

	const [isOpen, setOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	const citation = [
		meta.authors.map((person) => [person.firstName, person.lastName].join(" ")).join(", "),
		`(${new Date(meta.date).getUTCFullYear()})` + ":",
		meta.title + ".",
		meta.eventType,
	].join(" ");

	function onCopyCitation() {
		setCopied(true);
		window.navigator.clipboard.writeText(citation);
		window.setTimeout(() => {
			setCopied(false);
		}, 2500);
	}

	return (
		<ul className="home__share">
			<li className="mr-2.5">
				<TooltipTrigger delay={750} isOpen={isOpen || copied} onOpenChange={setOpen}>
					<Button onPress={onCopyCitation} className="!inline-grid">
						<div
							className={cx(
								"relative flex items-center justify-center h-full",
								copied && "bg-green-600",
							)}
						>
							{copied ? <FaCheck /> : <FaClipboard />}
							<span className="sr-only">Copy citation</span>
						</div>
					</Button>
					<Tooltip className="rounded text-xs bg-neutral-800 text-white px-4 py-2 outline-none shadow max-w-[320px] data-[placement=top]:mb-2 data-[placement=bottom]:mt-2 group">
						<OverlayArrow>
							<svg
								width={8}
								height={8}
								viewBox="0 0 8 8"
								className="block fill-neutral-800 group-data-[placement=bottom]:rotate-180"
							>
								<path d="M0 0 L4 4 L8 0" />
							</svg>
						</OverlayArrow>
						<div className="overflow-auto max-h-[200px]">
							{copied ? (
								<span>Citation copied</span>
							) : (
								<>
									<strong className="mb-1 block">Copy citation to clipboard:</strong>
									<div>{citation}</div>
								</>
							)}
						</div>
					</Tooltip>
				</TooltipTrigger>
			</li>
			{isNonEmptyString(social.twitter) ? (
				<li className="mr-2.5">
					<a
						href={String(new URL(social.twitter, "https://twitter.com"))}
						className="home__share__twitter !inline-grid"
						aria-label="Share on Twitter"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="relative flex items-center justify-center h-full">
							<FaTwitter />
						</div>
					</a>
				</li>
			) : null}
			{isNonEmptyString(social.website) ? (
				<li className="mr-2.5">
					<a
						href={social.website}
						aria-label="Visit website"
						className="!inline-grid"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="relative flex items-center justify-center h-full">
							<FaGlobe />
						</div>
					</a>
				</li>
			) : null}
			{isNonEmptyString(social.email) ? (
				<li className="mr-2.5">
					<a href={`mailto:${social.email}`} aria-label="Contact">
						<div className="relative flex items-center justify-center h-full">
							<FaEnvelope />
						</div>
					</a>
				</li>
			) : null}
		</ul>
	);
}

interface EventNavProps {
	social: EventProps["event"]["data"]["metadata"]["social"];
	synthesis: EventProps["event"]["data"]["metadata"]["synthesis"];
	aboutDialog: OverlayTriggerState;
	prepDialog: OverlayTriggerState;
	hasAboutOverlay: boolean;
	hasPrepOverlay: boolean;
}

/**
 *
 */
function EventNav(props: EventNavProps) {
	const { hasAboutOverlay, aboutDialog, hasPrepOverlay, prepDialog, social, synthesis } = props;

	return (
		<div>
			<ul className="flex flex-col items-end home__links">
				{hasAboutOverlay ? (
					<li>
						<button
							onClick={aboutDialog.open}
							className="link-popin text-white opacity-50 transition duration-[400ms] ease-out hover:opacity-100 hover:duration-150 focus:opacity-100 focus:duration-150 rounded"
						>
							<span>About</span>
						</button>
					</li>
				) : null}
				{hasPrepOverlay ? (
					<li>
						<button
							onClick={prepDialog.open}
							className="link-popin text-white opacity-50 transition duration-[400ms] ease-out hover:opacity-100 hover:duration-150 focus:opacity-100 focus:duration-150 rounded"
						>
							<span>How to prepare</span>
						</button>
					</li>
				) : null}
				{isNonEmptyString(social?.flickr) ? (
					<li>
						<a
							href={social?.flickr}
							target="_blank"
							rel="noopener noreferrer"
							className="!flex items-center"
						>
							<FaFlickr size="0.75em" className="mr-2.5" />
							<span>See the photos</span>
						</a>
					</li>
				) : null}
				{isNonEmptyString(synthesis) ? (
					<li className="download">
						<a
							href={synthesis}
							download
							className="!flex items-center"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaFilePdf size="0.75em" className="mr-2.5" />
							<span>Download the full synthesis</span>
						</a>
					</li>
				) : null}
			</ul>
		</div>
	);
}

interface EventSessionsProps {
	sessions: EventProps["event"]["data"]["metadata"]["sessions"];
	meta: EventMetadata;
}

function EventSessions(props: EventSessionsProps) {
	const { meta, sessions = [] } = props;

	return (
		<div className="relative">
			{sessions.map((session, index) => {
				return <EventSession key={index} session={session} index={index} meta={meta} />;
			})}
		</div>
	);
}

interface EventSessionProps {
	session: EventProps["event"]["data"]["metadata"]["sessions"][number];
	index: number;
	meta: EventMetadata;
}

function EventSession(props: EventSessionProps) {
	const { session, index, meta } = props;

	const [isOpen, setOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	const speakers = session.speakers.map((person) => [person.firstName, person.lastName].join(" "));

	const year = `(${new Date(meta.date).getUTCFullYear()})`;

	const title = session.title;

	const citation = [speakers, year + ":", title, "in:", meta.title + ".", meta.eventType].join(" ");

	function onCopyCitation() {
		setCopied(true);
		window.navigator.clipboard.writeText(citation);
		window.setTimeout(() => {
			setCopied(false);
		}, 2500);
	}

	const hasSynthesis = isNonEmptyString(session.synthesis);

	return (
		<div id={`session-${index}`} className="session">
			<div className="session__heading">
				<h1 className="font-bold h1">
					<span className="square" />
					<strong>{session.title}</strong>
				</h1>
				<div className="flex">
					<TooltipTrigger delay={750} isOpen={isOpen || copied} onOpenChange={setOpen}>
						<Button
							className={cx(
								"!flex items-center justify-center text-white link-download p-[1vw]",
								hasSynthesis && "!mx-4",
								copied && "!bg-green-600",
							)}
							onPress={onCopyCitation}
						>
							{copied ? (
								<FaCheck size="1.5em" className="w-full h-full" />
							) : (
								<FaClipboard size="1.5em" className="w-full h-full" />
							)}
							<span className="sr-only">Copy citation to clipboard</span>
						</Button>
						<Tooltip
							isOpen={copied || undefined}
							className="rounded text-xs overflow-auto bg-neutral-800 text-white px-4 py-2 outline-none shadow max-w-[320px] data-[placement=top]:mb-2 data-[placement=bottom]:mt-2 group"
						>
							<OverlayArrow>
								<svg
									width={8}
									height={8}
									viewBox="0 0 8 8"
									className="block fill-neutral-800 group-data-[placement=bottom]:rotate-180"
								>
									<path d="M0 0 L4 4 L8 0" />
								</svg>
							</OverlayArrow>
							<div className="overflow-auto max-h-[200px]">
								{copied ? (
									<span>Citation copied</span>
								) : (
									<>
										<strong className="mb-1 block">Copy citation to clipboard:</strong>
										<div>{citation}</div>
									</>
								)}
							</div>
						</Tooltip>
					</TooltipTrigger>
					{hasSynthesis ? (
						<a
							href={session.synthesis}
							download
							target="_blank"
							rel="noopener noreferrer"
							className="!flex items-center justify-center text-white link-download p-[1vw]"
						>
							<FaFilePdf size="1.5em" className="w-full h-full" />
							<span className="sr-only">Download the session synthesis</span>
						</a>
					) : null}
				</div>
			</div>

			<div className="session__core">
				<Mdx
					code={session.body.code}
					components={{
						Download: function EventSessionDownload(props) {
							return (
								<div className="session__downloads">
									<a
										href={props.url}
										download
										target="_blank"
										rel="noopener noreferrer"
										className="link-download !flex"
									>
										<span className="mr-2.5 text-event-orange flex items-center">
											<FaFilePdf size="1.8em" />
										</span>
										<strong>
											{props.label ?? "Download the slides"}
											<br />
											<span>(PDF)</span>
										</strong>
									</a>
								</div>
							);
						},
						Link: function EventSessionLink(props) {
							return (
								<div className="session__downloads">
									<a
										href={props.href}
										className="link-download !flex items-center"
										target="_blank"
										rel="noopener noreferrer"
									>
										<span className="mr-2.5 text-event-orange flex items-center">
											<FaCloud size="1.8em" />
										</span>
										<strong>{props.label ?? props.href}</strong>
									</a>
								</div>
							);
						},
						Speakers: function EventSessionSpeakers(props) {
							return (
								<div className="session__speakers">
									<h3 className="h2">
										<strong>Speaker{props.children?.length > 1 ? "s" : ""}</strong>
										<span>for this session</span>
									</h3>
									<ul className="space-y-[3.125vw] list-speakers">{props.children}</ul>
								</div>
							);
						},
						Speaker: function EventSessionSpeaker(props) {
							const speaker = session.speakers
								// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
								?.filter(Boolean)
								.find((speaker) => {
									return speaker.id === props.speaker;
								});

							if (speaker == null) return null;

							return (
								<li>
									<div className="hidden event-md:block absolute w-[9.375vw] h-[9.375vw]">
										{speaker.avatar != null ? (
											typeof speaker.avatar === "string" ? (
												<img src={speaker.avatar} alt="" loading="lazy" className="object-cover" />
											) : (
												<Image
													src={speaker.avatar}
													alt=""
													className="object-cover"
													placeholder="blur"
													fill
												/>
											)
										) : (
											<Icon
												icon={AvatarIcon}
												className="absolute left-0 right-0 w-[9.375vw] h-[9.375vw] rounded-full border-[0.3vw] border-event-violet2 text-event-violet2 bg-event-pink1"
											/>
										)}
									</div>
									<div className="list-speakers__bio">
										<h3 className="font-bold h3">{getFullName(speaker)}</h3>
										<div className="leading-snug text-[#1e396c]">
											{props.children ?? speaker.description}
										</div>
										<ul className="list-speakers__links text-event-violet1">
											{speaker.twitter != null ? (
												<li>
													<a
														href={String(new URL(speaker.twitter, "https://twitter.com"))}
														target="_blank"
														rel="noopener noreferrer"
														className="!flex items-center"
													>
														<FaTwitter size="0.75em" className="mr-1" />
														<span>{speaker.twitter}</span>
													</a>
												</li>
											) : null}
											{speaker.email != null ? (
												<li>
													<a href={`mailto:${speaker.email}`} className="!flex items-center">
														<FaEnvelope size="0.75em" className="mr-1" />
														<span>{speaker.email}</span>
													</a>
												</li>
											) : null}
											{speaker.website != null ? (
												<li>
													<a
														href={speaker.website}
														className="!flex items-center"
														target="_blank"
														rel="noopener noreferrer"
													>
														<FaGlobe size="0.75em" className="mr-1" />
														<span>Personal Website</span>
													</a>
												</li>
											) : null}
											{speaker.orcid != null ? (
												<li>
													<a
														href={String(new URL(speaker.orcid, "https://orcid.org"))}
														className="!flex items-center"
														target="_blank"
														rel="noopener noreferrer"
													>
														<Icon icon={OrcidIcon} className="w-[0.75em] h-[0.75em] mr-1" />
														<span>ORCID</span>
													</a>
												</li>
											) : null}
										</ul>
									</div>
								</li>
							);
						},
						h2: function Heading2(props) {
							return (
								<h2 className="font-bold h2 h2--counter" {...props}>
									{props.children}
								</h2>
							);
						},
						h3: function Heading3(props) {
							return (
								<h3 className="font-bold h3" {...props}>
									{props.children}
								</h3>
							);
						},
						p: function Paragraph(props) {
							return (
								<p className="text-[1.7vw] text-[#00396C] mb-[1em] leading-snug" {...props}>
									{props.children}
								</p>
							);
						},
						a: function Anchor(props) {
							return (
								<a {...props} target="_blank" rel="noopener noreferrer">
									{props.children}
								</a>
							);
						},
						ul: function List(props) {
							return (
								<ul {...props} className="list-standard text-event-violet1">
									{props.children}
								</ul>
							);
						},
						ol: function OrderedList(props) {
							return (
								<ol {...props} className="list-ordered text-event-violet1">
									{props.children}
								</ol>
							);
						},
						Figure,
						Video,
						Image: ResponsiveImage,
					}}
				/>
				{session.synthesis != null ? (
					<div className="session__downloads">
						<a
							href={session.synthesis}
							className="link-download !flex items-center"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span className="!text-event-orange">
								<FaFilePdf size="1.8em" className="mr-2.5" />
							</span>
							<strong>
								Download the complete session synthesis
								<br />
								<span>(PDF)</span>
							</strong>
						</a>
					</div>
				) : null}
			</div>
		</div>
	);
}

/**
 * Session nav.
 */
interface EventSideNavProps {
	sessions: EventProps["event"]["data"]["metadata"]["sessions"];
}

function EventSideNav(props: EventSideNavProps) {
	const { sessions } = props;

	return (
		<div id="nav-anchors" className="bottom-0 !z-10 hidden md:block">
			<ol className="sticky top-40">
				<li>
					<Link href={{ hash: "body" }} className="internal-link">
						<strong>Scroll to top</strong>
					</Link>
				</li>
				{sessions.map((session, index) => {
					return (
						<li key={index}>
							<Link href={{ hash: `session-${index}` }}>
								<strong>{session.title}</strong>
							</Link>
						</li>
					);
				})}
				<li>
					<Link href={{ hash: "footer" }} className="internal-link">
						<strong>Scroll to bottom</strong>
					</Link>
				</li>
			</ol>
		</div>
	);
}

interface EventFooterProps {
	event: EventProps["event"];
	hasAboutOverlay: boolean;
	hasPrepOverlay: boolean;
	aboutDialog: OverlayTriggerState;
	prepDialog: OverlayTriggerState;
}

/**
 * Event overview.
 */
function EventFooter(props: EventFooterProps) {
	const { event, hasAboutOverlay, hasPrepOverlay, aboutDialog, prepDialog } = props;

	const { licence, social, synthesis } = event.data.metadata;

	return (
		<div id="footer">
			<div className="px-[6.25vw]">
				{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
				<div className="footer__credits">{licence?.name}</div>
				<ul className="footer__links">
					{hasAboutOverlay ? (
						<li>
							<button
								onClick={aboutDialog.open}
								className="font-bold link-popin hover:text-event-orange transition ease-out duration-[400ms] hover:duration-150"
							>
								About
							</button>
						</li>
					) : null}
					{hasPrepOverlay ? (
						<li>
							<button
								onClick={prepDialog.open}
								className="font-bold link-popin hover:text-event-orange transition ease-out duration-[400ms] hover:duration-150"
							>
								Prep
							</button>
						</li>
					) : null}
					{social?.flickr != null ? (
						<li>
							<a
								href={social.flickr}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center"
							>
								<FaFlickr size="0.75em" className="mr-1" />
								See the photos
							</a>
						</li>
					) : null}
					{synthesis != null ? (
						<li className="download">
							<a
								href={synthesis}
								download
								className="flex items-center"
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaFilePdf size="0.75em" className="mr-1" />
								Download the full synthesis
							</a>
						</li>
					) : null}
				</ul>
				<h3 className="h3">Organisation</h3>
				<ul className="footer__partners">
					{event.data.metadata.partners.map((partner) => {
						return (
							<li key={partner.id} className="items-center flex-1 h-12">
								<a
									href={partner.url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center w-full h-full"
								>
									{partner.logo != null ? (
										typeof partner.logo === "string" ? (
											<img
												alt={partner.name}
												className="text-white opacity-75 flex-1 h-full transition duration-[400ms] ease-out hover:opacity-100 hover:duration-150 object-contain"
												src={partner.logo}
												loading="lazy"
											/>
										) : (
											<div className="relative flex-1 h-full">
												<Image
													alt={partner.name}
													className="text-white object-contain opacity-75 transition duration-[400ms] ease-out hover:opacity-100 hover:duration-150"
													src={partner.logo}
													fill
												/>
											</div>
										)
									) : (
										partner.name
									)}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
