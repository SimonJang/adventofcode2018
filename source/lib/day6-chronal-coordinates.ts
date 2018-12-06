import {readInput, parseOutput, parseOutputDay6} from '../utils';
import {Coords} from '../entities';

const calculateManhattanDistance = (start: Coords, end: Coords) => Math.abs((start.x - end.x)) + Math.abs(start.y - end.y);

// Solution 1
(() => {
	const raw = readInput(6);
	const input: Coords[] = parseOutput(parseOutputDay6, raw);

	const {x: maxX} = input.reduce((max, current) => current.x > max.x ? current : max);
	const {y: maxY} = input.reduce((max, current) => current.y > max.y ? current : max);

	const xRow = Array.from(Array(maxX + 1).keys());
	const yRow = Array.from(Array(maxY + 1).keys());

	const exceptionsSet = new Set();

	const coordsMap = yRow.reduce((currentYRow, currentY) => {
		const row = xRow.reduce((currentXRow, currentX) => {
			const currentCoords = {
				x: currentX,
				y: currentY
			};

			const {index: lowestIndex} = input.reduce(({index, distance}, coords, i) => {
				const distanceToCoords = calculateManhattanDistance(currentCoords, coords);

				if (distanceToCoords === 0) {
					return {index: String.fromCharCode(i + 65), distance: 0};
				}

				if (distanceToCoords < distance) {
					return {index: String.fromCharCode(i + 97), distance: distanceToCoords};
				}

				if (distanceToCoords === distance) {
					return {index: '.', distance};
				}

				return {index, distance};

			}, {index: [], distance: Infinity} as any);

			if (currentY === 0 || currentX === 0 || currentY === yRow.length - 1 || currentX === xRow.length - 1) {
				exceptionsSet.add(lowestIndex);
			}

			return `${currentXRow}${lowestIndex}`;
		}, '');

		return `${currentYRow}${row}\n`;
	}, '');

	const maxMap = coordsMap.split('\n')
		.filter(item => item.trim())
		.reduce((map, current) => {
			return [...current].reduce((maxValueMap, currentChar) => {
				if (exceptionsSet.has(currentChar)) {
					return maxValueMap;
				}

				maxValueMap.set(currentChar, (map.get(currentChar) || 1) + 1);

				return maxValueMap;
			}, map);
		}, new Map());

	const maxValue = [...maxMap.entries()]
		.reduce(([previousKey, previousValue], [currentKey, currentValue]) => {
			return previousValue - currentValue > 0
				? [previousKey, previousValue]
				: [currentKey, currentValue];
		});

	console.log(maxValue);
})();

// Solution 2
(() => {
	const raw = readInput(6);
	const input: Coords[] = parseOutput(parseOutputDay6, raw);

	const {x: maxX} = input.reduce((max, current) => current.x > max.x ? current : max);
	const {y: maxY} = input.reduce((max, current) => current.y > max.y ? current : max);

	const xRow = Array.from(Array(maxX + 1).keys());
	const yRow = Array.from(Array(maxY + 1).keys());

	let areaCounter = 0;

	yRow.reduce((_, currentY) => {
		xRow.reduce((__, currentX) => {
			const currentCoords = {
				x: currentX,
				y: currentY
			};

			const sum = input.reduce((previous, coords) => {
				const distanceToCoords = calculateManhattanDistance(currentCoords, coords);

				return previous + distanceToCoords;
			}, 0);

			if (sum < 10000) {
				areaCounter++;
			}
		}, undefined);
	}, undefined);

	console.log('area counter', areaCounter);
})();
