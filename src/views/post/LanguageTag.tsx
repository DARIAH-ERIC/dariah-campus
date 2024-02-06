interface LanguageTagProps {
	lang: string;
}

export function LanguageTag(props: LanguageTagProps): JSX.Element {
	const { lang } = props;

	return (
		<div className="text-xs font-medium bg-primary-600 text-white px-2 py-1 rounded">
			{lang.toUpperCase()}
		</div>
	);
}
