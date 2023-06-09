import cx from "clsx";
import Link from "next/link";

import { useI18n } from "@/i18n/useI18n";
import { routes } from "@/navigation/routes.config";

export interface ReUseConditionsProps {
	className?: string;
}

/**
 * Reuse conditions.
 */
export function ReUseConditions(props: ReUseConditionsProps): JSX.Element {
	const { t } = useI18n();

	return (
		<div className={cx("space-y-1.5", props.className)}>
			<h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
				{t("common.reuseConditions")}
			</h2>
			<p>
				Resources hosted on DARIAH-Campus are subjects to the{" "}
				<Link
					href={routes.docs({ id: "reuse-charter" })}
					className="transition rounded text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
				>
					DARIAH-Campus Training Materials Reuse Charter
				</Link>
			</p>
		</div>
	);
}
