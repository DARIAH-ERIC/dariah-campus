import { type ResourcePreview } from "@/cms/api/resources.api";

type AuthorListItem = Pick<
	ResourcePreview["authors"][number],
	"avatar" | "firstName" | "id" | "lastName"
>;
export interface ResourceListItem
	extends Pick<ResourcePreview, "abstract" | "date" | "id" | "kind" | "lang" | "title"> {
	type: Pick<ResourcePreview["type"], "id">;
	authors: Array<AuthorListItem>;
	draft?: boolean;
}

/**
 * Provides minimal data necessary for resource list view.
 */
export function getResourceListData(resources: Array<ResourcePreview>): Array<ResourceListItem> {
	return resources.map((resource) => {
		return {
			id: resource.id,
			kind: resource.kind,
			type: resource.type,
			draft: resource.kind === "posts" && resource.draft === true,
			title: resource.shortTitle ?? resource.title,
			date: resource.date,
			lang: resource.lang,
			abstract: resource.abstract,
			authors: resource.authors.map((author) => {
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
			}),
		};
	});
}
