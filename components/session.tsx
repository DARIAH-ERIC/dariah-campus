import { DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC, ReactNode } from "react";

import { ServerImage as Image } from "@/components/server-image";
import type { MdxContent } from "@/lib/content/compile-mdx";

interface SessionProps {
	attachments: ReadonlyArray<{ label: string; file: string }>;
	children: ReactNode;
	compile: (code: string) => Promise<MdxContent<Record<string, unknown>>>;
	index: number;
	links: ReadonlyArray<{ label: string; href: string }>;
	peopleById: Map<string, { data: { name: string; image: string; content: string } }>;
	presentations: ReadonlyArray<{
		attachments: ReadonlyArray<{ label: string; file: string }>;
		content: string;
		links: ReadonlyArray<{ label: string; href: string }>;
		speakers: ReadonlyArray<string>;
		title: string;
	}>;
	speakers: ReadonlyArray<{
		id: string;
		name: string;
		image: string;
		SpeakerDescription: FC;
	}>;
	title: string;
}

export function Session(props: SessionProps): ReactNode {
	const {
		attachments,
		children,
		compile,
		index,
		links,
		peopleById,
		presentations,
		speakers,
		title,
	} = props;

	const t = useTranslations("Session");

	return (
		<article className="grid content-start gap-y-8 py-8">
			<div className="prose">
				<h2>
					<span className="mr-2">{index}.</span>
					{title}
				</h2>
			</div>

			{children}

			{speakers.length > 0 || attachments.length > 0 || links.length > 0 ? (
				<footer className="my-8 rounded-lg border border-neutral-200 bg-neutral-100 p-8">
					<dl className="grid content-start gap-y-8">
						{speakers.length > 0 ? (
							<div className="grid content-start gap-y-6">
								<dt className="border-b border-neutral-200 pb-2 text-xl font-bold">
									{t("speakers", { count: speakers.length })}
								</dt>
								<dd>
									<ul className="grid list-none content-start gap-y-12" role="list">
										{speakers.map((speaker, index) => {
											const { name, image, SpeakerDescription } = speaker;

											return (
												<li key={index}>
													<div className="grid content-start gap-y-4">
														<Image
															alt=""
															className="aspect-square size-20 rounded-full border border-neutral-200 object-cover"
															height={128}
															sizes="256px"
															src={image}
															width={128}
														/>
														<strong className="text-lg font-bold">{name}</strong>
														<div className="prose prose-sm">
															<SpeakerDescription />
														</div>
													</div>
												</li>
											);
										})}
									</ul>
								</dd>
							</div>
						) : null}

						{attachments.length > 0 ? (
							<div className="grid content-start gap-y-6">
								<dt className="border-b border-neutral-200 pb-2 text-xl font-bold">
									{t("attachments", { count: attachments.length })}
								</dt>
								<dd>
									{attachments.map((attachment, index) => {
										return (
											<a
												key={index}
												className="inline-flex items-center gap-x-2 text-primary-600 transition hover:underline focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
												download={true}
												href={attachment.file}
											>
												<DownloadIcon aria-hidden={true} className="size-4 shrink-0" />
												{attachment.label}
											</a>
										);
									})}
								</dd>
							</div>
						) : null}

						{links.length > 0 ? (
							<div className="grid content-start gap-y-6">
								<dt className="border-b border-neutral-200 pb-2 text-xl font-bold">
									{t("links", { count: links.length })}
								</dt>
								<dd>
									{links.map((link, index) => {
										return (
											<a
												key={index}
												className="inline-flex items-center gap-x-2 text-primary-600 transition hover:underline focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
												href={link.href}
											>
												{link.label}
											</a>
										);
									})}
								</dd>
							</div>
						) : null}
					</dl>
				</footer>
			) : null}

			{presentations.length > 0 ? (
				<ol>
					{presentations.map(async (presentation, presentationIndex) => {
						const { title, links, attachments, content } = presentation;

						const { default: PresentationContent } = await compile(content);

						const speakers = await Promise.all(
							presentation.speakers.map(async (id) => {
								const person = peopleById.get(id)!;
								const { default: SpeakerDescription } = await compile(person.data.content);
								return {
									id,
									...person.data,
									SpeakerDescription,
								};
							}),
						);

						return (
							<li key={presentationIndex}>
								<article className="grid content-start gap-y-8 py-8">
									<div className="prose">
										<h2>
											<span className="mr-2">
												{index}.{presentationIndex + 1}.
											</span>
											{title}
										</h2>
									</div>

									<div className="prose">
										<PresentationContent />
									</div>

									{speakers.length > 0 || attachments.length > 0 || links.length > 0 ? (
										<footer className="my-8 rounded-lg border border-neutral-200 bg-neutral-100 p-8">
											<dl className="grid content-start gap-y-8">
												{speakers.length > 0 ? (
													<div className="grid content-start gap-y-6">
														<dt className="border-b border-neutral-200 pb-2 text-xl font-bold">
															{t("speakers", { count: speakers.length })}
														</dt>
														<dd>
															<ul className="grid list-none content-start gap-y-12" role="list">
																{speakers.map((speaker, index) => {
																	const { name, image, SpeakerDescription } = speaker;

																	return (
																		<li key={index}>
																			<div className="grid content-start gap-y-4">
																				<Image
																					alt=""
																					className="aspect-square size-20 rounded-full border border-neutral-200 object-cover"
																					height={128}
																					sizes="256px"
																					src={image}
																					width={128}
																				/>
																				<strong className="text-lg font-bold">{name}</strong>
																				<div className="prose prose-sm">
																					<SpeakerDescription />
																				</div>
																			</div>
																		</li>
																	);
																})}
															</ul>
														</dd>
													</div>
												) : null}

												{attachments.length > 0 ? (
													<div className="grid content-start gap-y-6">
														<dt className="border-b border-neutral-200 pb-2 text-xl font-bold">
															{t("attachments", { count: attachments.length })}
														</dt>
														<dd>
															{attachments.map((attachment, index) => {
																return (
																	<a
																		key={index}
																		className="inline-flex items-center gap-x-2 text-primary-600 transition hover:underline focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
																		download={true}
																		href={attachment.file}
																	>
																		<DownloadIcon aria-hidden={true} className="size-4 shrink-0" />
																		{attachment.label}
																	</a>
																);
															})}
														</dd>
													</div>
												) : null}

												{links.length > 0 ? (
													<div className="grid content-start gap-y-6">
														<dt className="border-b border-neutral-200 pb-2 text-xl font-bold">
															{t("links", { count: links.length })}
														</dt>
														<dd>
															{links.map((link, index) => {
																return (
																	<a
																		key={index}
																		className="inline-flex items-center gap-x-2 text-primary-600 transition hover:underline focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
																		href={link.href}
																	>
																		{link.label}
																	</a>
																);
															})}
														</dd>
													</div>
												) : null}
											</dl>
										</footer>
									) : null}
								</article>
							</li>
						);
					})}
				</ol>
			) : null}
		</article>
	);
}
