export const getYouTubeId = (url: string): string | null => {
	try {
		const parsed = new URL(url);

		const hosts = ["youtube.com", "www.youtube.com", "youtu.be", "www.youtu.be"];
		if (!hosts.includes(parsed.host)) return null;

		if (parsed.searchParams.has("v")) {
			return parsed.searchParams.get("v");
		}

		if (parsed.host.includes("youtu.be")) {
			const id = parsed.pathname.slice(1);
			return id || null;
		}

		if (parsed.pathname.startsWith("/shorts/")) {
			return parsed.pathname.replace("/shorts/", "");
		}

		if (parsed.pathname.startsWith("/embed/")) {
			return parsed.pathname.replace("/embed/", "");
		}

		return null;
	} catch {
		return null;
	}
}
