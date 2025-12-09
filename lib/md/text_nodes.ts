export const center = (text: string) => `<div align="center">

${text}

</div>\n`;

export const embed = (text: string) => center(`<div style="display: block; margin-bottom: 12px;">
	<iframe
		style="width: 100%; aspect-ratio: 16/9;"
		src="${text}"
		frameBorder="0"
		allowFullScreen></iframe>
</div>`);

export const wrapText = (wrapper: string, text: string) => `${wrapper}${text.trim()}${wrapper}`;

export const coloredTitleText = (text: string, color: string) => `<span style="color:${color}"><strong>${text.trim()}</strong></span>`;
