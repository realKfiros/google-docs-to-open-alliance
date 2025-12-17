export const getGoogleDocsId = (text: string): string | null => {
	try {
		const url = new URL(text.trim());
		const m = url.pathname.match(/\/d\/([a-zA-Z0-9-_]+)/);
		return m?.[1] ?? null;
	} catch {
		return null;
	}
}
