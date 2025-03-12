/* eslint-disable no-restricted-imports */

import Link, { type LinkProps } from "next/link";
import type { FC, ReactNode } from "react";

export { redirect, usePathname, useRouter } from "next/navigation";

export type LocaleLinkProps = Omit<LinkProps, "href"> & {
	children: ReactNode;
	href?: string | undefined;
};

export const LocaleLink = Link as FC<LocaleLinkProps>;
