'use client';

import {useState} from 'react';
import type {ReactNode} from 'react';
import {useServerInsertedHTML} from 'next/navigation';
import {ServerStyleSheet, StyleSheetManager} from 'styled-components';

type StyledComponentRegistryProps = {
	children: ReactNode;
}

export const StyledComponentsRegistry = ({children}: StyledComponentRegistryProps) => {
	const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

	useServerInsertedHTML(() => {
		const styles = styledComponentsStyleSheet.getStyleElement();
		styledComponentsStyleSheet.instance.clearTag();
		return <>{styles}</>;
	});

	if (typeof window !== 'undefined') {
		return <>{children}</>;
	}

	return (
		<StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
			{children}
		</StyleSheetManager>
	);
};
