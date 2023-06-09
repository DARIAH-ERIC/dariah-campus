import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useButton } from "react-aria";
import { type AriaSearchFieldProps, useSearchField } from "react-aria";
import { useOverlayTriggerState, useSearchFieldState } from "react-stately";

import AcademicCapIcon from "@/assets/icons/academic-cap.svg?symbol";
import DocumentIcon from "@/assets/icons/document-text.svg?symbol";
import LightningBoltIcon from "@/assets/icons/lightning-bolt.svg?symbol";
import SearchIcon from "@/assets/icons/search.svg?symbol";
import ClearIcon from "@/assets/icons/x.svg?symbol";
import { Icon } from "@/common/Icon";
import { ModalDialog } from "@/common/ModalDialog";
import { Spinner } from "@/common/Spinner";
import { useI18n } from "@/i18n/useI18n";
import { routes } from "@/navigation/routes.config";
import { SearchDialogContext } from "@/search/SearchDialog.context";
import { type SearchStatus } from "@/search/useSearch";
import { useSearch } from "@/search/useSearch";

export interface SearchDialogProps {
	children: ReactNode;
}

/**
 * Search dialog.
 */
export function SearchDialog(props: SearchDialogProps): JSX.Element {
	const { t } = useI18n();
	const router = useRouter();

	const dialogState = useOverlayTriggerState({});
	const [searchTerm, setSearchTerm] = useState("");
	const { data: searchResults, status } = useSearch(searchTerm);

	// const openButtonRef = useRef<HTMLButtonElement>(null)
	// const { buttonProps: openButtonProps } = useButton(
	//   {
	//     'aria-label': t('common.search'),
	//     onPress() {
	//       dialogState.open()
	//     },
	//   },
	//   openButtonRef,
	// )

	// const closeButtonRef = useRef<HTMLButtonElement>(null)
	// const { buttonProps: closeButtonProps } = useButton(
	//   {
	//     onPress() {
	//       dialogState.close()
	//     },
	//   },
	//   closeButtonRef,
	// )

	function onSubmit(searchTerm: string) {
		setSearchTerm(searchTerm);
	}

	useEffect(() => {
		router.events.on("routeChangeStart", dialogState.close);

		return () => {
			router.events.off("routeChangeStart", dialogState.close);
		};
	}, [router.events, dialogState.close]);

	return (
		<Fragment>
			<SearchDialogContext.Provider value={dialogState}>
				{props.children}
			</SearchDialogContext.Provider>
			{dialogState.isOpen ? (
				<ModalDialog
					// TODO: use aria-label instead of title
					// If a dialog does not have a visible title element, an aria-label or aria-labelledby prop must be passed instead to identify the element to assistive technology.
					title={t("common.search")}
					state={dialogState}
					isDismissable
				>
					<div className="flex flex-col space-y-4">
						<SearchField
							autoFocus
							label={t("common.search")}
							placeholder={t("common.search")}
							onSubmit={onSubmit}
							isDisabled={status === "disabled"}
							loadingState={status}
							value={searchTerm}
							onChange={setSearchTerm}
						/>
						{Array.isArray(searchResults) && searchResults.length > 0 ? (
							<ul className="overflow-y-auto">
								{searchResults.map((result) => {
									const href =
										result.type === "courses"
											? routes.course({ id: result.id })
											: routes.resource({ kind: result.kind, id: result.id });

									const icon = result.type === "courses" ? AcademicCapIcon : DocumentIcon;

									return (
										<li key={result.id}>
											<article>
												<Link
													href={href}
													className="flex flex-col px-2 py-2 space-y-1 transition rounded hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100"
												>
													<h3 className="flex items-center space-x-2 font-medium">
														<Icon icon={icon} className="w-5 h-5" />
														<span>{result.title}</span>
													</h3>
													{result._snippetResult?.abstract.value != null ? (
														<p
															dangerouslySetInnerHTML={{
																__html: result._snippetResult.abstract.value,
															}}
														/>
													) : null}
													<dl>
														<dt className="sr-only">{t("common.tags")}</dt>
														<dd className="my-px">
															<ul className="flex flex-wrap">
																{result.tags.map((tag) => {
																	return (
																		<li
																			key={tag.id}
																			className="mb-1 mr-4 text-xs font-bold tracking-wide uppercase text-primary-600"
																		>
																			{tag.name}
																		</li>
																	);
																})}
															</ul>
														</dd>
													</dl>
												</Link>
											</article>
										</li>
									);
								})}
							</ul>
						) : status === "success" ? (
							<div className="py-4 text-center text-neutral-500">{t("common.noResultsFound")}</div>
						) : null}
					</div>
				</ModalDialog>
			) : null}
		</Fragment>
	);
}

interface SearchFieldProps extends AriaSearchFieldProps {
	loadingState?: SearchStatus;
}

/**
 * Search input field.
 */
function SearchField(props: SearchFieldProps) {
	// const { label } = props
	const loadingState = props.loadingState ?? "idle";

	const state = useSearchFieldState(props);
	const inputRef = useRef<HTMLInputElement>(null);
	const { labelProps, inputProps, clearButtonProps } = useSearchField(props, state, inputRef);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { buttonProps } = useButton(clearButtonProps, buttonRef);

	return (
		<label {...labelProps} className="flex flex-col space-y-1.5">
			<div className="flex items-center flex-1 w-full px-4 py-2 text-lg transition border rounded-full shadow-xl border-primary-600 text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600 focus-visible:border-primary-600">
				{loadingState === "loading" ? (
					<Spinner className="flex-shrink-0 w-5 h-5 text-primary-600" />
				) : loadingState === "error" ? (
					<Icon icon={LightningBoltIcon} className="flex-shrink-0 w-5 h-5 text-error-600" />
				) : (
					<Icon icon={SearchIcon} className="flex-shrink-0 w-5 h-5 stroke-2" />
				)}
				<input {...inputProps} ref={inputRef} className="flex-1 min-w-0 p-2 focus:outline-none" />
				{state.value !== "" ? (
					<button {...buttonProps} ref={buttonRef}>
						<Icon icon={ClearIcon} className="flex-shrink-0 w-5 h-5" />
					</button>
				) : null}
			</div>
		</label>
	);
}
