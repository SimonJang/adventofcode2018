import {readInput, parseOutput, parseTextToArray} from '../utils';

// // Solution 1
(() => {
	const raw = readInput(5);
	const [polymer]: string[] = parseOutput(parseTextToArray, raw);

	const cleanedPolymerLength = [...polymer].reduce((stringBuilder, current) => {
		if (stringBuilder.length === 0) {
			stringBuilder.unshift(current);

			return stringBuilder;
		}

		if (Math.abs(stringBuilder[0].charCodeAt(0) - current.charCodeAt(0)) !== 32) {
			stringBuilder.unshift(current);

			return stringBuilder;
		}

		stringBuilder.shift();

		return stringBuilder;
	}, [] as string[])
	.reverse()
	.join('')
	.length;

	console.log(cleanedPolymerLength);
})();

// Solution 2
(() => {
	const raw = readInput(5);
	const [polymer]: string[] = parseOutput(parseTextToArray, raw);

	const scanPolymer = (polymerString: string) => {
		return [...polymerString].reduce((stringBuilder, current) => {
			if (stringBuilder.length === 0) {
				stringBuilder.unshift(current);

				return stringBuilder;
			}

			if (Math.abs(stringBuilder[0].charCodeAt(0) - current.charCodeAt(0)) !== 32) {
				stringBuilder.unshift(current);

				return stringBuilder;
			}

			stringBuilder.shift();

			return stringBuilder;
		}, [] as string[])
		.length;
	};

	const alphabet = [...Array(26).keys()].map(i => String.fromCharCode(i + 97));

	const bestHit = alphabet.reduce(({longest, length}, current) => {
		const filteredPolymer = polymer
			.split(current)
			.join('')
			.split(current.toUpperCase())
			.join('');

		const filteredPolymerLength = scanPolymer(filteredPolymer);

		return length > filteredPolymerLength
			? {longest: current, length: filteredPolymerLength}
			: {longest, length};
	}, {longest: '', length: polymer.length});

	console.log(bestHit);
})();
