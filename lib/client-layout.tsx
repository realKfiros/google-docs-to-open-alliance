"use client";

import type { ReactNode } from "react";
import { ThemeProvider, type DefaultTheme } from "styled-components";
import GlobalStyle from "@/styles/global";

type ClientLayoutProps = {
	children: ReactNode;
};

const theme: DefaultTheme = {
	colors: {
		primary: "#111",
		secondary: "#0070f3",
	},
};

export const ClientLayout = ({ children }: ClientLayoutProps) => {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			{children}
		</ThemeProvider>
	);
}
