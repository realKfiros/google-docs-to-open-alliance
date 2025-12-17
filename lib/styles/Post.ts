import styled from "styled-components";

export const Post = styled.div`
	position: relative;
	overflow: auto;
	display: flex;

	> .topic-avatar {
		align-self: flex-start;
		position: sticky;
		top: 0;
		flex-shrink: 0;
		margin-right: 12px;
		margin-bottom: 25px;
		width: 50px;
		height: 50px;
		background-color: dodgerblue;
		border-radius: 50%;
		overflow-anchor: none;
	}

	> .topic {
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
`;
