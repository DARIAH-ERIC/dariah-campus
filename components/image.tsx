/* eslint-disable no-restricted-imports */

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import type { ReactNode } from "react";

import { env } from "@/config/env.config";

interface ImageProps extends Omit<NextImageProps, "loader"> {}

export function Image(props: Readonly<ImageProps>): ReactNode {
	const { alt = "", src, ...rest } = props;

	if (typeof src === "string") {
		const owner = env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER;
		const repo = env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME;

		if (owner != null && repo != null) {
			const github = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/`;

			if (src.startsWith(github)) {
				// eslint-disable-next-line @next/next/no-img-element
				return <img {...rest} alt={alt} src={src} />;
			}
		}
	}

	return <NextImage {...rest} alt={alt} src={src} />;
}
