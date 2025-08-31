import singleton from "@content/navigation";

import type { SingletonClient } from "@/lib/content/types";
import { getLinkProps } from "@/lib/content/utils/get-link-props";
import type {
	NavigationLink,
	// NavigationMenu,
	NavigationSeparator,
} from "@/lib/navigation/navigation";

const items = singleton.get("")!.document.links;

const navigation = Object.fromEntries(
	items
		.map((item) => {
			switch (item.discriminant) {
				case "link": {
					const link: NavigationLink = {
						type: "link",
						href: getLinkProps(item.value.link).href,
						label: item.value.label,
					};

					return link;
				}

				// case "menu": {
				// 	const menu: NavigationMenu = {
				// 		type: "menu",
				// 		label: item.value.label,
				// 		children: Object.fromEntries(
				// 			item.value.items
				// 				.map((item) => {
				// 					switch (item.discriminant) {
				// 						case "link": {
				// 							const link: NavigationLink = {
				// 								type: "link",
				// 								...getLinkProps(item.value.link),
				// 								label: item.value.label,
				// 							};

				// 							return link;
				// 						}

				// 						case "separator": {
				// 							const separator: NavigationSeparator = {
				// 								type: "separator",
				// 							};

				// 							return separator;
				// 						}
				// 					}
				// 				})
				// 				.map((item, index) => {
				// 					return [`item-${String(index)}`, item];
				// 				}),
				// 		),
				// 	};

				// 	return menu;
				// }

				case "separator": {
					const separator: NavigationSeparator = {
						type: "separator",
					};

					return separator;
				}
			}
		})
		.map((item, index) => {
			return [`item-${String(index)}`, item];
		}),
);

export type Navigation = typeof navigation;

export const client: SingletonClient<Navigation> = {
	get() {
		return navigation;
	},
};
