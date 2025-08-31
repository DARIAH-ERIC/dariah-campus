import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { Image } from "@/components/image";

const maxAvatars = 3;

interface AvatarsListProps {
	avatars: Array<{
		id: string;
		name: string;
		image: StaticImageData | string;
	}>;
	label: string;
}

export function AvatarsList(props: Readonly<AvatarsListProps>): ReactNode {
	const { avatars, label } = props;

	return (
		<dl>
			<div>
				<dt className="sr-only">{label}</dt>
				<dd>
					<ul className="flex items-center gap-x-1">
						{avatars.slice(0, maxAvatars).map((avatar) => {
							return (
								<li key={avatar.id} className="flex">
									<span className="sr-only">{avatar.name}</span>
									<Image
										alt=""
										className="size-8 rounded-full object-cover"
										height={32}
										src={avatar.image}
										width={32}
									/>
								</li>
							);
						})}
					</ul>
				</dd>
			</div>
		</dl>
	);
}
