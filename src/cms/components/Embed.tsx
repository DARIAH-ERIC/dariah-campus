import { useRef, useState } from "react";

import FullscreenIcon from "@/assets/icons/fullscreen.svg?symbol";
import { Icon } from "@/common/Icon";
import { Spinner } from "@/common/Spinner";

interface EmbedProps {
	src: string;
	title: string;
}

export function Embed(props: EmbedProps) {
	const { src, title } = props;

	const [isLoadingIframe, setIsLoadingIframe] = useState(true);
	const ref = useRef<HTMLIFrameElement | null>(null);

	function onLoadIframe() {
		setIsLoadingIframe(false);
	}

	return (
		<figure>
			<div className="w-full aspect-square relative border">
				<div className="absolute inset-0 flex flex-col items-center justify-center text-primary-600">
					<Spinner className={isLoadingIframe ? undefined : "hidden"} />
				</div>
				<iframe
					src={src}
					title={title}
					allowFullScreen
					allow="fullscreen"
					loading="lazy"
					onLoad={onLoadIframe}
					className="w-full h-full object-cover inset-0 absolute"
					ref={ref}
				/>
			</div>
			<div className="flex justify-end">
				<button
					className="font-medium px-4 py-1 rounded inline-flex items-center transition gap-x-2 hover:text-[#069]"
					onClick={() => {
						if (ref.current == null) return;
						ref.current.requestFullscreen();
					}}
				>
					<Icon className="shrink-0 size-6" icon={FullscreenIcon} />
					Display fullscreen
				</button>
			</div>
		</figure>
	);
}
