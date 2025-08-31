export interface NavigationAction {
	type: "action";
	onAction: () => void;
	label: string;
}

export interface NavigationLink {
	type: "link";
	href: string;
	label: string;
}

export interface NavigationSeparator {
	type: "separator";
}

export type NavigationMenuItem = NavigationLink | NavigationSeparator | NavigationAction;

export interface NavigationMenu {
	type: "menu";
	label: string;
	children: Record<string, NavigationMenuItem>;
}

export type NavigationItem =
	| NavigationAction
	| NavigationLink
	| NavigationSeparator
	| NavigationMenu;
