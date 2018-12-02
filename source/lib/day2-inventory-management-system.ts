import {readInput, parseOutput, parseTextToArray} from '../utils';

// Solution 1
(() => {
	const raw = readInput(2);
	const input: string[] = parseOutput(parseTextToArray, raw);

	let doubles = 0;
	let triples = 0;

	for (const word of input) {
		const charMap = word
			.split('')
			.reduce((container, current) => {
				if (container.has(current)) {
					container.set(current, (container.get(current) as number) + 1);

					return container;
				}

				container.set(current, 1);

				return container;
			}, new Map<string, number>());

		const values = [...charMap.values()];

		if (values.indexOf(2) !== -1) {
			doubles++;
		}

		if (values.indexOf(3) !== -1) {
			triples++;
		}
	}

	const checksum = doubles * triples;

	console.log('checksum', checksum);
})();

// Solution 2
(() => {
	const raw = readInput(2);
	const input: string[] = parseOutput(parseTextToArray, raw);

	input.reduce((___, current, _, arr) => {
		arr.reduce((__, word) => {
			const differents: number[] = [];

			for (const [index] of word.split('').entries()) {
				if (current[index] === word[index]) {
					continue;
				}

				differents.push(index);
			}

			if (differents.length === 1) {
				const [oneOffIndex] = differents;

				console.log('common', word.replace(word[oneOffIndex], ''), current.replace(current[oneOffIndex], ''));

				arr.splice(1);
			}

			return current;

		}, current);

		return ___;
	});
})();
