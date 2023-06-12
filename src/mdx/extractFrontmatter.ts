import { type VFile } from "vfile";
import { matter } from "vfile-matter";

/**
 * Extracts YAML frontmatter from `VFile`.
 *
 * This mutates the input file: parsed frontmatter will be available on `file.data.matter`.
 */
export function extractFrontmatter(file: VFile): VFile {
	return matter(file, { strip: true });
}
