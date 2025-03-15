import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import {
	Button,
	Disclosure,
	DisclosureGroup,
	DisclosurePanel,
	Heading,
} from "@/app/(app)/(index)/_components/disclosure";
import { VideoCard } from "@/app/(app)/(index)/_components/video-card";
import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { SearchForm } from "@/components/search-form";
import { ServerImage as Image } from "@/components/server-image";
import { createClient } from "@/lib/content/create-client";

interface IndexPageProps extends EmptyObject {}

export const dynamic = "force-static";

export async function generateMetadata(
	_props: Readonly<IndexPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const _t = await getTranslations("IndexPage");

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

export default function IndexPage(_props: Readonly<IndexPageProps>): ReactNode {
	return (
		<MainContent className="mx-auto w-full max-w-screen-lg space-y-24 px-4 py-8 xs:px-8 xs:py-16 md:py-24">
			<HeroSection />
			<SearchSection />
			<BrowseSection />
			<AboutSection />
			<FaqSection />
			<TestimonialSection />
			<TeamSection />
		</MainContent>
	);
}

async function HeroSection(): Promise<ReactNode> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const page = await client.indexPage.get();
	const { image, lead, title } = page.data;

	return (
		<section className="flex flex-col items-center gap-y-4 text-center">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img alt="" className="mx-auto h-48 text-brand-700 lg:h-60" src={image} />
			<h1 className="text-5xl font-bold lg:text-6xl">{title}</h1>
			<p className="text-xl text-neutral-500 lg:text-2xl">{lead}</p>
		</section>
	);
}

async function SearchSection(): Promise<ReactNode> {
	const t = await getTranslations("IndexPage");

	return (
		<section>
			<h2 className="sr-only">{t("search")}</h2>

			<SearchForm action="/search">
				<label>
					<span className="sr-only">{t("search")}</span>
					<div className="group relative mx-auto flex w-full max-w-2xl overflow-hidden rounded-full bg-white bg-clip-padding text-lg shadow-xl transition focus-within:ring focus-within:ring-brand-800">
						<input
							className="flex-1 rounded-l-full border border-neutral-200 bg-none px-6 py-5 transition placeholder:text-neutral-400 group-focus-within:border-brand-800 group-hover:border-brand-800 focus:outline-none"
							name="q" // FIXME: change when removing instantsearch
							placeholder={`${t("find-learning-resources")}...`}
							type="search"
						/>
						<button
							className="inline-flex items-center gap-x-2 rounded-r-full border border-l-transparent bg-neutral-50 pl-6 pr-10 text-brand-800 transition group-focus-within:border-brand-800 group-focus-within:border-l-transparent hover:bg-brand-800 hover:text-white group-hover:border-brand-800 group-hover:border-l-transparent focus:bg-brand-700 focus:text-white focus:outline-none"
							type="submit"
						>
							<SearchIcon aria-hidden={true} className="size-5 stroke-2" />
							<span className="text-base font-medium">{t("search")}</span>
						</button>
					</div>
				</label>
			</SearchForm>
		</section>
	);
}

async function BrowseSection(): Promise<ReactNode> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const page = await client.indexPage.get();
	const { lead, links, title } = page.data["browse-section"];

	return (
		<Section>
			<SectionTitle>{title}</SectionTitle>
			<SectionLead>{lead}</SectionLead>
			<ul className="grid gap-8 py-6 md:grid-cols-3" role="list">
				{links.map((link, index) => {
					return (
						<li key={index}>
							<article className="relative flex h-full flex-col items-center gap-y-2 rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-md transition focus-within:ring focus-within:ring-brand-700 hover:shadow-lg">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img alt="" className="size-20 text-brand-700" src={link.image} />
								<h3 className="text-xl font-semibold">
									<Link
										className="after:absolute after:inset-0 focus:outline-none"
										href={link.href}
									>
										{link.title}
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

async function AboutSection(): Promise<ReactNode> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const page = await client.indexPage.get();
	const { lead, title, videos } = page.data["about-section"];

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
								image={video.image}
								title={video.title}
							/>
						</li>
					);
				})}
			</ul>
		</Section>
	);
}

async function FaqSection(): Promise<ReactNode> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const page = await client.indexPage.get();
	const { faq, lead, title } = page.data["faq-section"];

	return (
		<Section>
			<SectionTitle>{title}</SectionTitle>
			<SectionLead>{lead}</SectionLead>
			<DisclosureGroup className="mx-auto flex w-full max-w-screen-md flex-col gap-y-6 py-6 text-lg">
				{faq.map(async (item, index) => {
					const { content, title } = item;

					const { default: Content } = await page.compile(content);

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
							<DisclosurePanel className="space-y-1.5 p-6 text-left">
								<Content
									components={{
										// eslint-disable-next-line react/no-unstable-nested-components
										a(props) {
											return (
												<a
													{...props}
													className="rounded p-0.5 text-brand-700 underline transition hover:no-underline focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
												>
													{props.children}
												</a>
											);
										},
									}}
								/>
							</DisclosurePanel>
						</Disclosure>
					);
				})}
			</DisclosureGroup>
		</Section>
	);
}

async function TestimonialSection(): Promise<ReactNode> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const page = await client.indexPage.get();
	const { lead, title, videos } = page.data["testimonial-section"];

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
								image={video.image}
								title={video.title}
							/>
						</li>
					);
				})}
			</ul>
		</Section>
	);
}

async function TeamSection(): Promise<ReactNode> {
	const locale = await getLocale();

	const client = await createClient(locale);
	const page = await client.indexPage.get();
	const { lead, team, title } = page.data["team-section"];

	return (
		<Section>
			<SectionTitle>{title}</SectionTitle>
			<SectionLead>{lead}</SectionLead>
			<ul className="mx-auto grid grid-cols-2 gap-8 py-6 md:grid-cols-4" role="list">
				{team.map(async (item, index) => {
					const { person: id, role } = item;

					const person = await client.people.get(id);
					const { image, name } = person.data;

					return (
						<li key={index}>
							<article className="flex flex-col items-center">
								<Image
									alt=""
									className="mb-2 size-24 rounded-full border border-neutral-200 object-cover"
									height={96}
									src={image}
									width={96}
								/>
								<h3 className="font-bold">{name}</h3>
								<p className="text-sm text-neutral-500">{role}</p>
							</article>
						</li>
					);
				})}
			</ul>
		</Section>
	);
}

interface SectionProps {
	children: ReactNode;
}

function Section(props: SectionProps): ReactNode {
	const { children } = props;

	return <section className="flex flex-col gap-y-2 text-center">{children}</section>;
}

interface SectionTitleProps {
	children: ReactNode;
}

function SectionTitle(props: SectionTitleProps): ReactNode {
	const { children } = props;

	return <h2 className="text-3xl font-bold lg:text-4xl">{children}</h2>;
}

interface SectionLeadProps {
	children: ReactNode;
}

function SectionLead(props: SectionLeadProps): ReactNode {
	const { children } = props;

	return <p className="text-lg text-neutral-500 lg:text-xl">{children}</p>;
}
