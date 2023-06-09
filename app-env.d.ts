/// <reference types="@stefanprobst/next-svg/types" />

declare module "*.mdx" {
	import { type ComponentType } from "react";

	import { type MdxContentProps } from "@/mdx/runMdxSync";

	const Component: ComponentType<MdxContentProps>;
	const frontmatter: Record<string, unknown>;

	export { frontmatter };
	export default Component;
}

declare module "*.svg?symbol" {
	import { type FC, type SVGProps } from "react";

	const Image: FC<SVGProps<SVGSVGElement> & { title?: string }>;

	export default Image;
}
