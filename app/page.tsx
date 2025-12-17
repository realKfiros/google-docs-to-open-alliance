"use client";

import {FormEvent, useEffect, useMemo, useState} from "react";
import {getGoogleDocsId} from "@/lib/validations/google-docs";
import {Button} from "@/lib/styles/Button";
import {Page} from "@/lib/styles/Page";
import {Form} from "@/lib/styles/Form";
import {Instruction} from "@/lib/styles/Instruction";
import {ErrorMessage} from "@/lib/styles/ErrorMessage";
import {Post} from "@/lib/styles/Post";
import {MD} from "@/lib/components/MD";

const documentGuidelinesLink = "https://ninjas4744.blossom-kc.com/Launcher?assignment=274&anonymous=1";

export default function () {
	const [titleColorsInput, setTitleColorsInput] = useState("#ff0000");
	const [docInput, setDocInput] = useState("");
	const docId = useMemo(() => getGoogleDocsId(docInput), [docInput]);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<{ title: string; text: string } | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const colorFromStorage = localStorage.getItem("titleColorsInput");
		if (colorFromStorage) {
			setTitleColorsInput(colorFromStorage);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("titleColorsInput", titleColorsInput);
	}, [titleColorsInput]);

	const handleSubmit = async (e: FormEvent) =>
	{
		e.preventDefault();
		if (!docId) return;

		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const res = await fetch(`/api/docs/${encodeURIComponent(docId)}?color=${titleColorsInput.split('#')[1]}`);
			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Unknown error");
			} else {
				setResult(data);
			}
		}
		catch (err) {
			setError("Network error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Page>
			<h1 className="page-title">Google Docs to Open Alliance Converter</h1>
			<p className="page-description">Write open alliance posts and updates on google docs and convert them to Chief Delphi's markdown</p>
			<Instruction>To get the best results, use these <a href={documentGuidelinesLink} target="_blank">document formatting guidelines</a></Instruction>

			<Form
				onSubmit={handleSubmit}
				className="document-form">

				<div className="field">
					<label htmlFor="title-colors-input">Color for titles</label>
					<input
						type="color"
						value={titleColorsInput}
						onChange={(e) => setTitleColorsInput(e.target.value)}
						id="title-colors-input" />
				</div>

				<div className="field">
					<label htmlFor="doc-url-input">Google Docs URL</label>
					<input
						type="text"
						value={docInput}
						onChange={(e) => setDocInput(e.target.value)}
						placeholder="Document URL"
						id="doc-url-input" />
				</div>

				{docId && (
					<Button
						type="submit"
						disabled={loading || !docInput}>
						{loading ? "Loading..." : "Read Document"}
					</Button>
				)}
			</Form>

			{error && (
				<ErrorMessage>Error: {error}</ErrorMessage>
			)}

			{result && (
				<Post>
					<div className="topic-avatar" />
					<div className="topic">
						<div className="topic-creator">User</div>
						<div className="topic-body">
							<MD text={result.text} />
							<Button
								onClick={() => navigator.clipboard.writeText(result?.text)}>
								Copy
							</Button>
						</div>
					</div>
				</Post>
			)}
		</Page>
	);
}
