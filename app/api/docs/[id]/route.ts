import { NextResponse } from "next/server";
import { getDocumentMarkdown } from "@/lib/docs";

type Params = {
	params: Promise<{ id: string }>;
};

export async function GET(_req: Request, { params }: Params) {
	const { id } = await params;

	if (!id) {
		return NextResponse.json({ error: "Missing document id" }, { status: 400 });
	}

	try {
		const doc = await getDocumentMarkdown(id);
		return NextResponse.json(doc);
	} catch (err) {
		console.error("Error reading doc:", err);
		return NextResponse.json(
			{ error: "Failed to read document" },
			{ status: 500 }
		);
	}
}
