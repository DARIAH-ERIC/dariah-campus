import { Fira_Code, Roboto } from "next/font/google";

export const body = Roboto({
	style: ["normal"],
	subsets: ["latin"],
	variable: "--_font-body",
});

export const code = Fira_Code({
	preload: false,
	variable: "--_font-code",
});
