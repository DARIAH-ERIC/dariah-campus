export function range(n: number, start = 0): Array<number> {
	return Array.from(Array(n).keys(), (num) => {
		return num + start;
	});
}
