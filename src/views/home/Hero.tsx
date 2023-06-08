import Image from "next/image";

import HeroImage from "~/public/assets/images/student.svg";

/**
 * Hero section on home page.
 */
export function Hero(): JSX.Element {
	return (
		<div className="flex flex-col items-center space-y-4 text-center">
			<Image alt="" className="h-48 lg:h-60 text-primary-600 mx-auto" src={HeroImage} />
			<h1 className="text-5xl lg:text-6xl font-bold">Looking for learning resources?</h1>
			<p className="text-xl lg:text-2xl text-neutral-500">
				DARIAH-CAMPUS is a discovery framework and hosting platform for learning resources.
			</p>
		</div>
	);
}
