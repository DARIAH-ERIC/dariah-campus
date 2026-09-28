export interface WorksheetDocumentQuestion {
	label: string;
	value: string;
}

export interface WorksheetDocumentSection {
	/** Rich text, already serialised by `serializeRichText`. */
	descriptionHtml?: string;
	questions: Array<WorksheetDocumentQuestion>;
	/** Already resolved to its fallback by the caller, so every view agrees on the same title. */
	title: string;
}

export interface WorksheetDocumentSource {
	title: string;
	url: string;
}

export interface CreateWorksheetDocumentParams {
	/** Name of the platform, printed above the document title. */
	brand: string;
	/** Rich text, already serialised by `serializeRichText`. */
	descriptionHtml?: string;
	labels: {
		/** Printed instead of an answer which the learner left empty. */
		emptyAnswer: string;
		generated: string;
		source: string;
	};
	language: string;
	sections: Array<WorksheetDocumentSection>;
	/** The page the learner filled in the form on. */
	source: WorksheetDocumentSource | null;
	title: string;
}

/** Word only understands a small subset of css, so the stylesheet avoids modern layout and logical properties. */
const stylesheet = `
@page { margin: 2cm; }
body { margin: 2rem auto; max-width: 45rem; padding: 0 1rem; color: #1c1c1c; font-family: "Segoe UI", Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.5; }
.brand { margin: 0 0 0.25rem; color: #016cab; font-size: 9pt; font-weight: bold; letter-spacing: 0.08em; text-transform: uppercase; }
h1 { margin: 0 0 0.5rem; padding-bottom: 0.5rem; border-bottom: 2pt solid #016cab; color: #07304a; font-size: 20pt; line-height: 1.25; }
.description { color: #444444; }
h2 { margin: 2rem 0 0; color: #016cab; font-size: 14pt; page-break-after: avoid; }
.section-description { color: #444444; font-size: 10pt; }
h3 { margin: 1.25rem 0 0.25rem; font-size: 11pt; page-break-after: avoid; }
.answer { margin: 0 0 0 0.75rem; padding-left: 0.75rem; border-left: 2pt solid #dcdcdc; }
.answer p { margin: 0 0 0.5rem; }
.answer p:last-child { margin-bottom: 0; }
.empty { color: #6a6a6a; font-style: italic; }
footer { margin-top: 2.5rem; padding-top: 0.5rem; border-top: 1pt solid #dcdcdc; color: #6a6a6a; font-size: 9pt; }
footer p { margin: 0 0 0.25rem; }
a { color: #016cab; }
.rich-text > :first-child { margin-top: 0; }
.rich-text > :last-child { margin-bottom: 0; }
.rich-text p { margin: 0 0 0.5rem; }
.rich-text ul, .rich-text ol { margin: 0 0 0.5rem; padding-left: 1.5rem; }
.rich-text li { margin: 0 0 0.25rem; }
.rich-text blockquote { margin: 0 0 0.5rem; padding-left: 0.75rem; border-left: 2pt solid #dcdcdc; color: #444444; }
.rich-text code { font-family: Consolas, "Courier New", monospace; font-size: 10pt; }
.rich-text h1, .rich-text h2, .rich-text h3, .rich-text h4 { margin: 0.75rem 0 0.25rem; color: inherit; padding: 0; border: 0; font-size: 11pt; }
`;

function escapeHtml(value: string): string {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

/** Turns the plain text a learner typed into paragraphs, so line breaks survive in the document. */
function createParagraphs(value: string): string {
	return value
		.split(/\n{2,}/u)
		.map((paragraph) => `<p>${escapeHtml(paragraph.trim()).replaceAll("\n", "<br />")}</p>`)
		.join("\n");
}

/**
 * Creates a standalone html document, which is served both as a `.doc` download, and as the source for printing to pdf
 * via the browser's print dialog.
 */
export function createWorksheetDocument(params: CreateWorksheetDocumentParams): string {
	const { brand, descriptionHtml, labels, language, sections, source, title } = params;

	const body = sections
		.map((section) => {
			const heading = `<h2>${escapeHtml(section.title)}</h2>`;

			const intro =
				section.descriptionHtml != null
					? `<div class="rich-text section-description">${section.descriptionHtml}</div>`
					: "";

			const questions = section.questions
				.map((question) => {
					const value = question.value.trim();

					const answer =
						value.length > 0 ? createParagraphs(value) : `<p class="empty">${escapeHtml(labels.emptyAnswer)}</p>`;

					return `<h3>${escapeHtml(question.label)}</h3>\n<div class="answer">${answer}</div>`;
				})
				.join("\n");

			return `<section>\n${heading}\n${intro}\n${questions}\n</section>`;
		})
		.join("\n");

	const footer = [
		`<p>${escapeHtml(labels.generated)}</p>`,
		source != null
			? `<p>${escapeHtml(labels.source)}: <a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a></p>`
			: "",
	]
		.filter(Boolean)
		.join("\n");

	return `<!doctype html>
<html lang="${escapeHtml(language)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>${stylesheet}</style>
</head>
<body>
<header>
<p class="brand">${escapeHtml(brand)}</p>
<h1>${escapeHtml(title)}</h1>
${descriptionHtml != null ? `<div class="rich-text description">${descriptionHtml}</div>` : ""}
</header>
${body}
<footer>
${footer}
</footer>
</body>
</html>
`;
}
