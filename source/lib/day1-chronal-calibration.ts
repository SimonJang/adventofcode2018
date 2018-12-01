import {readInput, parseOutput, parseTextToArray} from '../utils';

// // Solution 1
(() => {
	const raw = readInput(1);
	const input: string[] = parseOutput(parseTextToArray, raw);

	const result = input.reduce((current, next) => current + Number(next), 0);

	console.log(result);
})();

// Solution 2
(() => {
	const raw = readInput(1);
	const input: string[] = parseOutput(parseTextToArray, raw);

	let duplicate = false;
	let start = 0;

	const freqSet = new Set();

	freqSet.add(0);

	do {
		start = input.reduce((current, next, _, arr) => {
			const op = current + Number(next);

			if (freqSet.has(op)) {
				duplicate = true;
				arr.splice(1);

				console.log(op);
			}

			freqSet.add(op);

			return op;
		}, start);
	} while (duplicate === false);
})();
