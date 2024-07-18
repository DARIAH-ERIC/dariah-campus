import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import {
	Tab as AriaTab,
	TabList as AriaTabList,
	TabPanel as AriaTabPanel,
	Tabs as AriaTabs,
} from "react-aria-components";

interface TabsProps {
	children: ReactNode;
}

export function Tabs(props: TabsProps) {
	const { children } = props;

	/** Note that we actually get back children wrapped with `React.lazy`. */
	const tabs = getChildrenElements(children) as Array<ReactElement<TabProps>>;

	return (
		<AriaTabs>
			<AriaTabList className="flex flex-wrap items-center gap-x-4 border-b mb-4">
				{tabs.map((tab, index) => {
					const { title } = tab.props;

					const id = String(index);

					return (
						<AriaTab
							key={id}
							className="cursor-default border-b-2 border-transparent transition hover:text-neutral-950 data-[selected]:border-current data-[selected]:font-medium"
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

export function Tab(_props: TabProps) {
	return null;
}

function getChildrenElements(children: ReactNode) {
	return Children.toArray(children).filter(isValidElement);
}
