import { google } from "googleapis";

const scopes = ["https://www.googleapis.com/auth/documents.readonly"];

const auth = new google.auth.JWT({
	email: process.env.CLIENT_EMAIL,
	key: atob(process.env.PRIVATE_KEY!),
	scopes
});

export async function getDocumentMarkdown(documentId: string): Promise<{ title: string, text: string }> {
	const docs = google.docs({ version: "v1", auth });
	const res = await docs.documents.get({ documentId });

	const document = res.data;
	const body = document.body?.content ?? [];
	const inlineObjects = (document.inlineObjects ?? {}) as Record<string, any>;

	const TARGET_HEIGHT = 200;

	const text = body.map((structuralElement) => {
		const paragraph = structuralElement.paragraph;
		if (!paragraph) return "\n";

		const elements = paragraph.elements ?? [];

		const images: {
			objectId: string;
			contentUri: string;
			origWidth: number;
			origHeight: number;
		}[] = [];

		for (const el of elements) {
			if (el.inlineObjectElement) {
				const objectId = el.inlineObjectElement.inlineObjectId!;
				const inlineObj = inlineObjects[objectId];
				const embedded = inlineObj?.inlineObjectProperties?.embeddedObject;
				const img = embedded?.imageProperties;

				if (img?.contentUri) {
					images.push({
						objectId,
						contentUri: img.contentUri,
						origWidth: img.width?.magnitude ?? 300,
						origHeight: img.height?.magnitude ?? 300
					});
				}
			}
		}

		if (images.length > 0) {
			const mdImages = `<div align="center">

${images.map((img) => {
	const ratio = img.origWidth / img.origHeight;
	const width = Math.round(TARGET_HEIGHT * ratio);
	return `![](${img.contentUri}=${width}x${TARGET_HEIGHT})`;
}).join(" ")}

</div>\n`;

			return mdImages;
		}

		const { paragraphStyle } = paragraph || {};
		const [paragraphType, paragraphTypeNum] = (paragraphStyle?.namedStyleType || "").split("_");

		let paragraphText = elements.map((el) => {
			let text = el.textRun?.content ?? "";
			if (paragraphType === 'NORMAL' && text.trim())
			{
				if (el.textRun?.textStyle?.bold)
					text = `**${text.trim()}**`;
				if (el.textRun?.textStyle?.italic)
					text = `*${text.trim()}*`;
			}
			return text;
		}).join("");

		if (paragraphType === "HEADING") {
			const level = parseInt(paragraphTypeNum);
			paragraphText = "#".repeat(level) + ` <span style="color:#2163af"><strong>${paragraphText.trim()}</strong></span>`;
		}

		if (paragraph.bullet) {
			paragraphText = "* " + paragraphText;
		}

		return paragraphText;
	}).join("\n");

	return {
		title: document.title ?? "",
		text,
	};
}
