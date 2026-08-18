import { defineConfig } from "oxlint";

const config = defineConfig({
	env: {
		builtin: true,
		browser: true,
	},
	jsPlugins: [
		// { name: "react-hooks-js", specifier: "eslint-plugin-react-hooks" },
	],
	plugins: ["jsx-a11y", "react"],
	rules: {
		/**
		 * ================================================================================================================
		 * Correctness.
		 * ================================================================================================================
		 */

		"jsx-a11y/alt-text": "error",
		"jsx-a11y/anchor-has-content": "error",
		"jsx-a11y/anchor-is-valid": ["error", { components: ["Link"] }],
		"jsx-a11y/aria-activedescendant-has-tabindex": "error",
		"jsx-a11y/aria-props": "error",
		"jsx-a11y/aria-proptypes": "error",
		"jsx-a11y/aria-role": "error",
		"jsx-a11y/aria-unsupported-elements": "error",
		"jsx-a11y/autocomplete-valid": "error",
		"jsx-a11y/click-events-have-key-events": "warn",
		"jsx-a11y/control-has-associated-label": "off",
		"jsx-a11y/heading-has-content": "error",
		"jsx-a11y/html-has-lang": "error",
		"jsx-a11y/iframe-has-title": "error",
		"jsx-a11y/img-redundant-alt": "warn",
		"jsx-a11y/label-has-associated-control": "warn",
		"jsx-a11y/lang": "error",
		"jsx-a11y/media-has-caption": "warn",
		"jsx-a11y/mouse-events-have-key-events": "warn",
		"jsx-a11y/no-access-key": "error",
		"jsx-a11y/no-aria-hidden-on-focusable": "error",
		"jsx-a11y/no-autofocus": ["warn", { ignoreNonDOM: true }],
		"jsx-a11y/no-distracting-elements": "off",
		"jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
		"jsx-a11y/no-noninteractive-tabindex": "error",
		/** @see {@link https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html} */
		"jsx-a11y/no-redundant-roles": ["warn", { ul: ["list"], ol: ["list"] }],
		"jsx-a11y/no-static-element-interactions": "warn",
		/** @see {@link https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/920} */
		"jsx-a11y/prefer-tag-over-role": "off",
		"jsx-a11y/role-has-required-aria-props": "error",
		"jsx-a11y/role-supports-aria-props": "error",
		"jsx-a11y/scope": "error",
		"jsx-a11y/tabindex-no-positive": "error",

		"react/exhaustive-deps": "error",
		"react/forward-ref-uses-ref": "error",
		"react/jsx-key": "error",
		"react/jsx-no-duplicate-props": "error",
		"react/jsx-no-undef": "error",
		"react/jsx-props-no-spread-multi": "error",
		"react/no-children-prop": "error",
		"react/no-danger-with-children": "error",
		"react/no-did-mount-set-state": "error",
		"react/no-direct-mutation-state": "error",
		"react/no-find-dom-node": "error",
		"react/no-is-mounted": "error",
		"react/no-render-return-value": "error",
		"react/no-string-refs": "error",
		"react/no-this-in-sfc": "error",
		"react/no-unsafe": "error",
		"react/no-will-update-set-state": "error",
		"react/void-dom-elements-no-children": "error",

		/**
		 * ================================================================================================================
		 * Suspicious.
		 * ================================================================================================================
		 */

		"react/iframe-missing-sandbox": "warn",
		"react/jsx-no-comment-textnodes": "warn",
		"react/jsx-no-script-url": "warn",
		"react/no-namespace": "error",
		"react/no-unstable-nested-components": "error",
		"react/react-in-jsx-scope": "off",
		"react/style-prop-object": "warn",

		/**
		 * ================================================================================================================
		 * Perf.
		 * ================================================================================================================
		 */

		"react/jsx-no-constructed-context-values": "warn",
		"react/no-array-index-key": "warn",
		"react/no-object-type-as-default-prop": "warn",

		/**
		 * ================================================================================================================
		 * Pedantic.
		 * ================================================================================================================
		 */

		"react/checked-requires-onchange-or-readonly": "warn",
		"react/display-name": "off",
		"react/jsx-no-target-blank": "off",
		"react/jsx-no-useless-fragment": "warn",
		"react/no-unescaped-entities": "warn",
		"react/rules-of-hooks": "error",

		/**
		 * ================================================================================================================
		 * Restriction.
		 * ================================================================================================================
		 */

		"jsx-a11y/anchor-ambiguous-text": "off",

		"react/button-has-type": "error",
		"react/forbid-dom-props": "off",
		"react/forbid-elements": "off",
		"react/jsx-filename-extension": "off",
		"react/jsx-no-literals": "off",
		"react/no-clone-element": "warn",
		"react/no-danger": "off",
		"react/no-multi-comp": "off",
		"react/no-react-children": "warn",
		"react/no-unknown-property": "warn",
		"react/only-export-components": "off",
		"react/prefer-function-component": "error",

		/**
		 * ================================================================================================================
		 * Style.
		 * ================================================================================================================
		 */

		"react/function-component-definition": "error",
		"react/hook-use-state": "warn",
		"react/jsx-boolean-value": ["error", "always"],
		"react/jsx-curly-brace-presence": "off",
		"react/jsx-fragments": "off",
		"react/jsx-handler-names": "off",
		"react/jsx-max-depth": "off",
		"react/jsx-pascal-case": "off",
		"react/jsx-props-no-spreading": "off",
		"react/no-redundant-should-component-update": "off",
		"react/no-set-state": "off",
		"react/prefer-es6-class": "off",
		"react/self-closing-comp": "off",
		"react/state-in-constructor": "off",

		/**
		 * ================================================================================================================
		 * Nursery.
		 * ================================================================================================================
		 */

		"react/react-compiler": "error",
		"react/require-render-return": "off",
	},
});

export default config;
