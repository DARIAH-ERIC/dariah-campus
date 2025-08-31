export function pickRandom<T>(values: Array<T>, count: number): Array<T> {
	if (values.length <= count) {
		return values.slice();
	}

	const shuffled = values.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
	}

	return shuffled.slice(0, count);
}
