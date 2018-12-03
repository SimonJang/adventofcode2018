import {readInput, parseOutput, parseOutputDay3} from '../utils';
import {Claim} from '../entities';

// Solution 1
(() => {
	const raw = readInput(3);
	const claims: Claim[] = parseOutput(parseOutputDay3, raw);

	const doubles = new Set();

	claims.reduce((container, current) => {
		const xLength = Array.from(Array(current.size.x).keys());
		const yLength = Array.from(Array(current.size.y).keys());

		xLength.reduce(xCoord => {
			yLength.reduce(yCoord => {
				const record = `${xCoord},${yCoord}`;

				if (container.has(record)) {
					if (!doubles.has(record)) {
						doubles.add(record);
					}
				} else {
					container.add(record);
				}

				return yCoord + 1;

			}, current.start.y);

			return xCoord + 1;
		}, current.start.x);

		return container;

	}, new Set());

	console.log('# doubles', [...doubles.values()].length);
})();

// Solution 2
(() => {
	const raw = readInput(3);
	const claims: Claim[] = parseOutput(parseOutputDay3, raw);

	const doubles = new Set();
	const untouched = new Set();

	const analysis = (reverse: boolean = false) => {
		return (container, current, index, arr) => {
			const xLength = Array.from(Array(current.size.x).keys());
			const yLength = Array.from(Array(current.size.y).keys());

			let touched = false;

			xLength.reduce(xCoord => {
				yLength.reduce(yCoord => {
					const record = `${xCoord},${yCoord}`;

					if (container.has(record)) {
						touched = true;

						if (!doubles.has(record)) {
							doubles.add(record);
						}
					} else {
						container.add(record);
					}

					return yCoord + 1;

				}, current.start.y);

				return xCoord + 1;
			}, current.start.x);

			if (!touched) {
				const untouchedIndex = reverse
					? arr.length - index - 1
					: index;

				if (!untouched.has(untouchedIndex)) {
					untouched.add(untouchedIndex);

					return container;
				}

				console.log('unique record #', untouchedIndex + 1);
			}

			return container;
		};
	};

	claims.reduce(analysis(), new Set());
	claims.reverse().reduce(analysis(true), new Set());
})();
