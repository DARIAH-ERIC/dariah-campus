import typographyPlugin from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import animatePlugin from "tailwindcss-animate";
import reactAriaComponentsPlugin from "tailwindcss-react-aria-components";

const config = {
	content: [
		"./app/**/*.@(ts|tsx)",
		"./components/**/*.@(ts|tsx)",
		"./config/**/*.@(ts|tsx)",
		"./lib/**/*.@(ts|tsx)",
		"./styles/**/*.css",
	],
	corePlugins: {
		container: false,
	},
	plugins: [animatePlugin, reactAriaComponentsPlugin, typographyPlugin],
	theme: {
		extend: {
			boxShadow: {
				sm: "rgba(0, 0, 0, 0.08) 0px 2px 8px 0px",
				md: "rgba(0, 0, 0, 0.08) 0px 5px 15px 0px",
				lg: "rgba(0, 0, 0, 0.12) 0px 10px 35px 0px",
			},
			colors: {
				error: colors.red,
				success: colors.green,
				warning: colors.yellow,
				important: colors.blue,
				neutral: colors.neutral,
				brand: {
					"50": "#f0f9ff",
					"100": "#dff3ff",
					"200": "#b9e7fe",
					"300": "#7bd7fe",
					"400": "#34c2fc",
					"500": "#0aaced",
					"600": "#0089cb",
					"700": "#006699" /** Logo color. */,
					"800": "#055d87",
					"900": "#0a4c70",
					"950": "#07304a",
				},
			},
			fontFamily: {
				body: ["var(--font-body)", "system-ui", "sans-serif"],
			},
			gridTemplateColumns: {
				"content-layout": "1fr 720px 1fr",
			},
			maxWidth: {
				content: "720px",
			},
			ringOffsetWidth: {
				DEFAULT: "2px",
			},
			typography(theme: (key: string) => string) {
				return {
					DEFAULT: {
						css: {
							maxWidth: "none",
							/** Don't add quotes around `blockquote`. */
							"blockquote p:first-of-type::before": null,
							"blockquote p:last-of-type::after": null,
							/** Don't add backticks around inline `code`. */
							"code::before": null,
							"code::after": null,
							"overflow-wrap": "break-word",
							"a:focus": {
								outline: "none",
							},
							"a:focus-visible": {
								borderRadius: theme("borderRadius.DEFAULT"),
								color: theme("colors.primary.600"),
								boxShadow: `white 0px 0px 0px 2px, ${theme("colors.primary.600")} 0px 0px 0px 5px`,
							},
							"figcaption > p:first-child": {
								marginTop: 0,
							},
							"figcaption > p:last-child": {
								marginBottom: 0,
							},
							pre: {
								/** Match `poimandres` theme. */
								backgroundColor: "#1b1e28",
							},
							strong: {
								color: "inherit",
							},
							h2: {
								fontSize: theme("fontSize.2xl")[0],
								fontWeight: theme("fontWeight.bold"),
							},
							h3: {
								fontSize: theme("fontSize.xl")[0],
								fontWeight: theme("fontWeight.bold"),
							},
							h4: {
								fontSize: theme("fontSize.lg")[0],
								fontWeight: theme("fontWeight.bold"),
							},
							h5: {
								fontSize: theme("fontSize.base")[0],
								fontWeight: theme("fontWeight.bold"),
							},
							h6: {
								fontSize: theme("fontSize.base")[0],
								fontStyle: "italic",
							},
							".no-list": {
								listStyle: "none",
								paddingLeft: 0,
							},
							".no-list p": {
								marginTop: "0.5em",
								marginBottom: "0.5em",
							},
							/** Mermaid diagrams. */
							"svg[role~=graphics-document]": {
								marginBlock: "1.5rem",
								marginInline: "auto",
							},
						},
					},
				};
			},
		},
		screens: {
			"2xs": "360px",
			xs: "480px",
			sm: "640px",
			md: "840px",
			lg: "1048px",
			xl: "1280px",
			"2xl": "1440px",
		},
	},
} satisfies Config;

export default config;
