"use client";

import {FormEvent, useState} from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import styled from "styled-components";

const PageContainer = styled.div`
	max-width: calc(100vw - 20px);
	min-width: 0;
	margin: 40px auto;
	padding: 16px;
	position: relative;

	> .post {
		position: relative;
		overflow: auto;
		display: flex;

		> .topic-avatar {
			align-self: flex-start;
			position: sticky;
			top: 0;
			flex-shrink: 0;         /* שלא יתכווץ כשצרים */
			margin-right: 12px;
			margin-bottom: 25px;
			width: 50px;
			height: 50px;
			background-color: dodgerblue;
			border-radius: 50%;
			overflow-anchor: none;
		}

		> .topic {
			/* בלי float בכלל */
			flex: 1 1 0;
			max-width: calc(690px + 0.75rem * 2);
			min-width: 0;
			position: relative;
			border-top: 1px solid rgb(48.62, 48.62, 48.62);
			padding: 0 0.75rem 0.25rem 0.75rem;

			> * {
				padding-block-start: 1rem;
			}

			> .topic-creator {
				font-weight: bold;
			}

			> .topic-body {
				line-height: 1.5;
			}
		}
	}
`;
export default function Page() {
	const [docId, setDocId] = useState("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<{ title: string; text: string } | null>(null);
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
		<PageContainer>
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
				<div className="post">
					<div className="topic-avatar" />
					<div className="topic">
						<div className="topic-creator">User</div>
						<div className="topic-body">
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
						</div>
					</div>
				</div>
			)}
		</PageContainer>
	);
}
