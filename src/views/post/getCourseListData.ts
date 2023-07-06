import { type CoursePreview } from "@/cms/api/courses.api";

type EditorListIem = Pick<
	Exclude<CoursePreview["editors"], undefined>[number],
	"avatar" | "firstName" | "id" | "lastName"
>;
export interface CourseListItem extends Pick<CoursePreview, "abstract" | "date" | "id" | "title"> {
	editors?: Array<EditorListIem>;
}

/**
 * Provides minimal data necessary for course list view.
 */
export function getCourseListData(courses: Array<CoursePreview>): Array<CourseListItem> {
	return courses.map((course) => {
		return {
			id: course.id,
			title: course.shortTitle ?? course.title,
			date: course.date,
			abstract: course.abstract,
			editors:
				course.editors?.map((editor) => {
					const editorListIem: EditorListIem = {
						id: editor.id,
						lastName: editor.lastName,
					};
					if (editor.firstName != null) {
						editorListIem.firstName = editor.firstName;
					}
					if (editor.avatar != null) {
						editorListIem.avatar = editor.avatar;
					}
					return editorListIem;
				}) ?? [],
		};
	});
}
