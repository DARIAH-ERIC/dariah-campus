import { type ReactNode } from "react";

import PencilIcon from "@/assets/icons/pencil.svg?symbol";
import { type collections } from "@/cms/cms.config";
import { Icon } from "@/common/Icon";
import { routes } from "@/navigation/routes.config";
import { createUrl } from "@/utils/createUrl";
import { url as baseUrl } from "~/config/site.config";

export interface EditLinkProps {
	children: ReactNode;
	className?: string;
	collection: keyof typeof collections;
	id: string;
}

/**
 * Link to directly edit resource via cms.
 *
 * We cannot link to CMS via client-side transition, because Decap CMS
 * unfortunately sets global styles, which would bleed into the app when navigating
 * back via browser back button.
 */
export function EditLink(props: EditLinkProps): JSX.Element {
	const { className, collection, id, children } = props;

	return (
		<a
			href={String(
				createUrl({
					...routes.cms(),
					hash: `/collections/${collection}/entries/${id}/index`,
					baseUrl,
				}),
			)}
			className={className}
		>
			<Icon icon={PencilIcon} className="flex-shrink-0" />
			{children}
		</a>
	);
}
