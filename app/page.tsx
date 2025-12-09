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

	const renderers = {
		//This custom renderer changes how images are rendered
		//we use it to constrain the max width of an image to its container
		image: ({
					alt,
					src,
					title,
				}: {
			alt?: string;
			src?: string;
			title?: string;
		}) => (
			<img
				alt={alt}
				src={src}
				title={title}
				style={{ maxWidth: 475 }}  />
		),
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
					<Markdown
						rehypePlugins={[rehypeRaw]}
						components={{
							img: (props) =>
							{
								const size = props.alt?.match(/image\|(\d+)x(\d+)/)  // Regex to look for sizing pattern
								const width = size ? size[1] : "400"
								const height = size ? size[2] : "250"

								return (
									<img
										alt={props.alt}
										src={props.src}
										title={props.title}
										width={width}
										height={height}/>
								);
							}
						}}>
						{result.text}
					</Markdown>
					<button onClick={() => navigator.clipboard.writeText(result?.text)}>Copy</button>
				</section>
			)}
		</main>
	);
}
