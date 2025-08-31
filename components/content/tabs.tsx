"use client";

import type { ReactNode } from "react";
import {
	Tab as AriaTab,
	TabList as AriaTabList,
	TabPanel as AriaTabPanel,
	Tabs as AriaTabs,
} from "react-aria-components";

import { getChildrenElements } from "@/components/content/get-children-elements";

interface TabsProps {
	children: ReactNode;
}

export function Tabs(props: Readonly<TabsProps>): ReactNode {
	const { children } = props;

	const tabs = getChildrenElements<TabProps>(children);

	return (
		<AriaTabs className="my-4">
			<AriaTabList className="my-4 flex flex-wrap items-center gap-x-4 border-b border-neutral-200">
				{tabs.map((tab, index) => {
					const { title } = tab.props;

					const id = String(index);

					return (
						<AriaTab
							key={id}
							className="-mb-px cursor-default border-b-2 border-transparent py-3 transition selected:border-current selected:font-bold"
							id={id}
						>
							{title}
						</AriaTab>
					);
				})}
			</AriaTabList>

			{tabs.map((tab, index) => {
				const { children } = tab.props;

				const id = String(index);

				return (
					<AriaTabPanel key={id} id={id}>
						{children}
					</AriaTabPanel>
				);
			})}
		</AriaTabs>
	);
}

interface TabProps {
	children: ReactNode;
	title: string;
}

export function Tab(_props: Readonly<TabProps>): ReactNode {
	return null;
}
