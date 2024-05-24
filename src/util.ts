export const genData = (start: number, end: number) =>
	new Array(end - start + 1).fill(0).map((_, i) => start + i);

export const splitData = <T>(arr: T[], length: number) =>
	arr.reduce((acc: T[][], cur) => {
		const lastArr = acc[acc.length - 1] ?? [];
		if (lastArr.length >= length) return [...acc, [cur]];
		return [...acc.slice(0, -1), [...lastArr, cur]];
	}, []);
