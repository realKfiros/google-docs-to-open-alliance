import rehypeRaw from "rehype-raw";
import Markdown from "react-markdown";

type MDProps = {
	text: string;
};

export const MD = ({text}: MDProps) => {
	return <Markdown
		rehypePlugins={[rehypeRaw]}
		components={{
			img: ({src, title, alt}) =>
			{
				const size = alt?.match(/image\|(\d+)x(\d+)/)  // Regex to look for sizing pattern
				const width = size ? size[1] : "400"
				const height = size ? size[2] : "250"

				return (
					<img
						alt={alt}
						src={src}
						title={title}
						width={width}
						height={height}/>
				);
			}
		}}>
		{text}
	</Markdown>;
};
