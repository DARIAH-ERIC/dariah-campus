export function pickRandom<T>(values: Array<T>, count: number): Array<T> {
	if (values.length <= count) {
		return values;
	}

	const picked = new Set<T>();

	do {
		const random = values[Math.floor(Math.random() * values.length)]!;
		picked.add(random);
	} while (picked.size < 3);

	return Array.from(picked);
}
