import { type Person } from "@/cms/api/people.api";

export type AuthorListItem = Pick<Person, "avatar" | "firstName" | "id" | "lastName">;

/**
 * Provides minimal data necessary for author list view.
 */
export function getAuthorListData(authors: Array<Person>): Array<AuthorListItem> {
	return authors.map((author) => {
		const authorListItem: AuthorListItem = {
			id: author.id,
			lastName: author.lastName,
		};
		if (author.firstName != null) {
			authorListItem.firstName = author.firstName;
		}
		if (author.avatar != null) {
			authorListItem.avatar = author.avatar;
		}
		return authorListItem;
	});
}
