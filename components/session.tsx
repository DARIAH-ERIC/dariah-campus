import { assert } from "@acdh-oeaw/lib";
import { DownloadIcon } from "lucide-react";
import type { MDXContent } from "mdx/types";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { client } from "@/lib/content/client";

interface SessionProps {
	attachments: ReadonlyArray<{ label: string; file: string }>;
	children: ReactNode;
	index: number;
	links: ReadonlyArray<{ label: string; href: string }>;
	presentations: ReadonlyArray<{
		attachments: ReadonlyArray<{ label: string; file: string }>;
		content: MDXContent;
		links: ReadonlyArray<{ label: string; href: string }>;
		speakers: ReadonlyArray<string>;
		title: string;
	}>;
	speakers: ReadonlyArray<{
		id: string;
		name: string;
		image: { src: string; height: number; width: number };
		SpeakerDescription: MDXContent;
	}>;
	title: string;
}

export function Session(props: Readonly<SessionProps>): ReactNode {
	const { attachments, children, index, links, presentations, speakers, title } = props;

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
												className="inline-flex items-center gap-x-2 text-brand-700 transition hover:underline focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
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
												className="inline-flex items-center gap-x-2 text-brand-700 transition hover:underline focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
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
					{presentations.map((presentation, presentationIndex) => {
						const { title, links, attachments, content } = presentation;

						const PresentationContent = content;

						const speakers = presentation.speakers.map((id) => {
							const person = client.collections.people.get(id)!;
							assert(person, `Missing person "${id}".`);
							const SpeakerDescription = person.content;
							return {
								id,
								...person.metadata,
								SpeakerDescription,
							};
						});

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
																		className="inline-flex items-center gap-x-2 text-brand-700 transition hover:underline focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
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
																		className="inline-flex items-center gap-x-2 text-brand-700 transition hover:underline focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
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
