import { assert } from "@acdh-oeaw/lib";
import { cn } from "@acdh-oeaw/style-variants";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import {
	Button,
	Disclosure,
	DisclosureGroup,
	DisclosurePanel,
	Heading,
} from "@/app/(app)/(default)/(index)/_components/disclosure";
import { VideoCard } from "@/app/(app)/(default)/(index)/_components/video-card";
import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { SearchForm } from "@/components/search-form";
import type { IndexPage as IndexPageContent } from "@/lib/content/client/index-page";
import { createClient } from "@/lib/content/create-client";

export function generateMetadata(): Metadata {
	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
		 */
		// title: undefined,
	};

	return metadata;
}

export default async function IndexPage(): Promise<ReactNode> {
	const client = await createClient();

	const page = await client.singletons.indexPage.get();

	return (
		<div className="mx-auto w-full max-w-screen-lg space-y-24 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<HeroSection hero={page} />
			<SearchSection />
			<BrowseSection section={page["browse-section"]} />
			<AboutSection section={page["about-section"]} />
			<FaqSection section={page["faq-section"]} />
			<TestimonialSection section={page["testimonial-section"]} />
			<TeamSection section={page["team-section"]} />
		</div>
	);
}

interface HeroSectionProps {
	hero: IndexPageContent;
}

function HeroSection(props: Readonly<HeroSectionProps>): ReactNode {
	const { hero } = props;

	const { image, lead, title } = hero;

	return (
		<section className="flex flex-col items-center gap-y-4 text-center">
			<Image
				alt=""
				className="mx-auto h-48 w-auto text-brand-700 lg:h-60"
				loading="eager"
				preload={true}
				src={image}
			/>
			<h1 className="text-5xl font-bold lg:text-6xl">{title}</h1>
			<p className="text-xl text-neutral-500 lg:text-2xl">{lead}</p>
		</section>
	);
}

function SearchSection(): ReactNode {
	const t = useTranslations("IndexPage");

	return (
		<section>
			<h2 className="sr-only">{t("search")}</h2>

			<SearchForm action="/search">
				<label>
					<span className="sr-only">{t("search")}</span>
					<div className="group relative mx-auto flex w-full max-w-2xl overflow-hidden rounded-full bg-white bg-clip-padding text-lg shadow-xl transition focus-within:ring focus-within:ring-brand-800">
						<input
							className="min-w-0 flex-1 rounded-l-full border border-neutral-200 bg-none px-6 py-5 transition group-focus-within:border-brand-800 group-hover:border-brand-800 placeholder:text-neutral-400 focus:outline-none"
							name="q" // FIXME: change when removing instantsearch
							placeholder={`${t("search")}...`}
							type="search"
						/>
						<button
							className="inline-flex items-center gap-x-2 rounded-r-full border border-neutral-200 border-l-transparent bg-neutral-50 pr-10 pl-6 text-neutral-600 transition group-focus-within:border-brand-800 group-focus-within:border-l-transparent group-hover:border-brand-800 group-hover:border-l-transparent hover:bg-brand-800 hover:text-white focus:bg-brand-700 focus:text-white focus:outline-none"
							type="submit"
						>
							<SearchIcon aria-hidden={true} className="size-5 stroke-2" />
							<span className="text-base font-medium">{t("submit-search-form")}</span>
						</button>
					</div>
				</label>
			</SearchForm>
		</section>
	);
}

interface BrowseSectionProps {
	section: IndexPageContent["browse-section"];
}

function BrowseSection(props: Readonly<BrowseSectionProps>): ReactNode {
	const { section } = props;

	const { lead, links, title } = section;

	return (
		<Section>
			<SectionTitle>{title}</SectionTitle>
			<SectionLead>{lead}</SectionLead>
			<ul className="grid gap-8 py-6 md:grid-cols-3" role="list">
				{links.map((link, index) => {
					const { title, href, image } = link;

					return (
						<li key={index}>
							<article className="relative flex h-full flex-col items-center gap-y-2 rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-md transition focus-within:ring focus-within:ring-brand-700 hover:shadow-lg">
								<Image alt="" className="size-20 text-brand-700" src={image} />
								<h3 className="text-xl font-semibold">
									<Link className="after:absolute after:inset-0 focus:outline-none" href={href}>
										{title}
									</Link>
								</h3>
								<p className="text-neutral-500">{link.description}</p>
							</article>
						</li>
					);
				})}
			</ul>
		</Section>
	);
}

interface AboutSectionProps {
	section: IndexPageContent["about-section"];
}

function AboutSection(props: Readonly<AboutSectionProps>): ReactNode {
	const { section } = props;

	const { lead, title, videos } = section;

	return (
		<Section>
			<SectionTitle>{title}</SectionTitle>
			<SectionLead>{lead}</SectionLead>
			<ul className="grid gap-8 py-6 md:grid-cols-2" role="list">
				{videos.map((video, index) => {
					return (
						<li key={index}>
							<VideoCard
								description={video.description}
								id={video.id}
								src={video.src}
								title={video.title}
							/>
						</li>
					);
				})}
			</ul>
		</Section>
	);
}

interface FaqSectionProps {
	section: IndexPageContent["faq-section"];
}

function FaqSection(props: Readonly<FaqSectionProps>): ReactNode {
	const { section } = props;

	const { faq, lead, title } = section;

	return (
		<Section>
			<SectionTitle>{title}</SectionTitle>
			<SectionLead>{lead}</SectionLead>
			<DisclosureGroup className="mx-auto flex w-full max-w-screen-md flex-col gap-y-6 py-6 text-lg">
				{faq.map((item, index) => {
					const { content: Content, title } = item;

					return (
						<Disclosure key={index} className="group flex flex-col">
							<Heading className="flex flex-1 bg-white">
								<Button
									className="flex flex-1 items-center justify-between rounded-xl border border-neutral-200 p-6 text-brand-700 shadow-md transition hover:shadow-lg focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
									slot="trigger"
								>
									<span className="text-left">{title}</span>
									<ChevronDownIcon
										aria-hidden={true}
										className="size-5 shrink-0 transition group-expanded:rotate-180"
									/>
								</Button>
							</Heading>
							<DisclosurePanel className="prose space-y-1.5 p-6 text-left">
								<Content />
							</DisclosurePanel>
						</Disclosure>
					);
				})}
			</DisclosureGroup>
		</Section>
	);
}

interface TestimonialSectionProps {
	section: IndexPageContent["testimonial-section"];
}

function TestimonialSection(props: Readonly<TestimonialSectionProps>): ReactNode {
	const { section } = props;

	const { lead, title, videos } = section;

	return (
		<Section>
			<SectionTitle>{title}</SectionTitle>
			<SectionLead>{lead}</SectionLead>
			<ul className="grid gap-8 py-6 md:grid-cols-3" role="list">
				{videos.map((video, index) => {
					return (
						<li key={index}>
							<VideoCard
								description={video.description}
								id={video.id}
								src={video.src}
								title={video.title}
							/>
						</li>
					);
				})}
			</ul>
		</Section>
	);
}

interface TeamSectionProps {
	section: IndexPageContent["team-section"];
}

async function TeamSection(props: Readonly<TeamSectionProps>): Promise<ReactNode> {
	const { section } = props;

	const { lead, team, title } = section;

	const client = await createClient();

	return (
		<Section>
			<SectionTitle>{title}</SectionTitle>
			<SectionLead>{lead}</SectionLead>
			<ul
				className={cn(
					"mx-auto grid grid-cols-2 gap-8 py-6",
					team.length % 2 === 0 ? "md:grid-cols-4" : "md:grid-cols-3",
				)}
				role="list"
			>
				{await Promise.all(
					team.map(async (item, index) => {
						const { person: id, role } = item;

						const person = await client.collections.people.get(id);
						assert(person, `Missing person "${id}".`);
						const { image, name } = person.metadata;

						return (
							<li key={index}>
								<article className="flex flex-col items-center">
									<Image
										alt=""
										className="mb-2 size-24 rounded-full border border-neutral-200 object-cover"
										height={96}
										sizes="96px"
										src={image}
										width={96}
									/>
									<h3 className="font-bold">{name}</h3>
									<p className="text-sm text-neutral-500">{role}</p>
								</article>
							</li>
						);
					}),
				)}
			</ul>
		</Section>
	);
}

interface SectionProps {
	children: ReactNode;
}

function Section(props: Readonly<SectionProps>): ReactNode {
	const { children } = props;

	return <section className="flex flex-col gap-y-2 text-center">{children}</section>;
}

interface SectionTitleProps {
	children: ReactNode;
}

function SectionTitle(props: Readonly<SectionTitleProps>): ReactNode {
	const { children } = props;

	return <h2 className="text-3xl font-bold lg:text-4xl">{children}</h2>;
}

interface SectionLeadProps {
	children: ReactNode;
}

function SectionLead(props: Readonly<SectionLeadProps>): ReactNode {
	const { children } = props;

	return <p className="text-lg text-neutral-500 lg:text-xl">{children}</p>;
}
