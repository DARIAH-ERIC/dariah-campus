import { Fira_Code, Roboto } from "next/font/google";

export const body = Roboto({
	style: ["normal", "italic"],
	subsets: ["latin", "latin-ext"],
	variable: "--_font-body",
});

export const code = Fira_Code({
	preload: false,
	style: ["normal"],
	subsets: ["latin", "latin-ext"],
	variable: "--_font-code",
});
