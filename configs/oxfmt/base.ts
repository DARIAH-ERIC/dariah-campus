import { defineConfig } from "oxfmt";

const config = defineConfig({
	jsdoc: true,
	printWidth: 120,
	sortImports: {
		groups: [
			["side_effect"],
			["side_effect_style"],
			["style"],
			["builtin"],
			["external"],
			["internal", "subpath"],
			["unknown"],
		],
	},
	sortPackageJson: {
		sortScripts: true,
	},
	useTabs: true,
});

export default config;
