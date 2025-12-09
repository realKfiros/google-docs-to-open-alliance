"use client";

import {FormEvent, useState} from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function HomePage() {
	const [docId, setDocId] = useState("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<{ title: string; text: string } | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent) =>
	{
		e.preventDefault();
		if (!docId) return;

		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const res = await fetch(`/api/docs/${encodeURIComponent(docId)}`);
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
		<main style={{maxWidth: 800, margin: "40px auto", padding: 16}}>
			<h1>Google Docs to Open Alliance</h1>

			<form onSubmit={handleSubmit} style={{marginBottom: 24}}>
				<label style={{display: "block", marginBottom: 8}}>
					Google Docs ID:
				</label>
				<input
					type="text"
					value={docId}
					onChange={(e) => setDocId(e.target.value)}
					style={{
						width: "100%",
						padding: 8,
						marginBottom: 8,
						borderRadius: 4,
						border: "1px solid #ccc",
					}}
					placeholder="1A2b3C... from the document URL"
				/>
				<button
					type="submit"
					disabled={loading || !docId}
					style={{
						padding: "8px 16px",
						borderRadius: 4,
						border: "none",
						background: "#0070f3",
						color: "#fff",
						cursor: "pointer",
					}}
				>
					{loading ? "Loading..." : "Read Document"}
				</button>
			</form>

			{error && (
				<div style={{color: "red", marginBottom: 16}}>Error: {error}</div>
			)}

			{result && (
				<section>
					<h2>{result.title}</h2>
					<pre
						style={{
							whiteSpace: "pre-wrap",
							padding: 12,
							borderRadius: 4,
						}}>
						<Markdown rehypePlugins={[rehypeRaw]}>{result.text}</Markdown>
					</pre>
					<button onClick={() => navigator.clipboard.writeText(result?.text)}>Copy</button>
				</section>
			)}
		</main>
	);
}
