import {NextResponse} from "next/server";
import {accessToken, getGoogleDocs} from "@/lib/docs";

type Params = {
	params: Promise<{id: string; objectId: string}>;
};

export async function GET(_req: Request, {params}: Params) {
	const {id, objectId} = await params;

	try {
		const docs = getGoogleDocs();
		const res = await docs.documents.get({documentId: id});

		const inlineObjects = res.data.inlineObjects ?? {};
		const inlineObj = inlineObjects[objectId];

		if (!inlineObj) {
			return new NextResponse("Image not found", { status: 404 });
		}

		const embedded = inlineObj.inlineObjectProperties?.embeddedObject;
		const imgProps = embedded?.imageProperties;
		const contentUri = imgProps?.contentUri as string | undefined;

		if (!contentUri) {
			return new NextResponse("No contentUri", { status: 404 });
		}

		const { token } = await accessToken();
		if (!token) {
			return new NextResponse("Auth error", { status: 500 });
		}

		const resp = await fetch(contentUri, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!resp.ok) {
			console.error(
				"Failed to fetch image from Google:",
				resp.status,
				resp.statusText
			);
			return new NextResponse("Failed to fetch image", { status: 502 });
		}

		const arrayBuffer = await resp.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const contentType = resp.headers.get("content-type") || "image/png";

		return new NextResponse(buffer, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=3600",
			},
		});
	} catch (e) {
		console.error(e);
		return new NextResponse("Server error", { status: 500 });
	}
}
