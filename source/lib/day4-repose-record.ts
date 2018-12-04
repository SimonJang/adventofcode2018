import {readInput, parseOutput, parseOutputDay4} from '../utils';
import {GuardLog} from '../entities';

const sleep = 'falls asleep';
const change = 'Guard';

// Solution 1
(() => {
	const raw = readInput(4);
	const logs: GuardLog[] = parseOutput(parseOutputDay4, raw);

	// Calculate all sleep data
	const {map: sleepData} = logs.reduce((dto, current) => {
		const {minutes, description, guard} = current;
		const {lastGuard, sleepMinute, map} = dto;

		if (description.startsWith(change) && guard) {
			if (!map.has(guard)) {
				map.set(guard, []);
			}

			return {map, sleepMinute, lastGuard: guard};
		}

		if (description.startsWith(sleep)) {
			return {map, sleepMinute: minutes, lastGuard};
		}

		const hour = Array.from(Array(59).keys());
		const sleepTime: number[] = hour.slice(sleepMinute, minutes);

		const container: number[][] = map.get(lastGuard) as number[][];
		container.push(sleepTime);
		map.set(lastGuard, container);

		return {map, sleepMinute, lastGuard};

	}, {map: new Map<number, number[][]>(), lastGuard: 0, sleepMinute: 0});

	// Calculate sleepiest guard
	const {guard: sleepyGuard, sleepData: sleepDataFromGuard} = [...sleepData.entries()]
		.reduce(({currentMax, sleepData: sleepScore, guard: currentMaxGuard}, [key, value]) => {
			let sum = 0;
			for (const arr of value) {
				sum += arr.length;
			}

			return {
				currentMax: sum >= currentMax ? sum : currentMax,
				sleepData: sum >= currentMax ? value : sleepScore,
				guard: sum >= currentMax ? key : currentMaxGuard,
			};
		}, {currentMax: 0, sleepData: [], guard: undefined} as any);

	console.log('most sleep guard #', sleepyGuard);

	// Calculate sleepiest minute
	const maxMapCalc = sleepDataFromGuard.reduce((maxMap, sleepArray) => {
		for (const item of sleepArray) {
			maxMap.set(item, (maxMap.get(item) || 0) + 1);
		}

		return maxMap;
	}, new Map<number, number>());

	const [max] = [...maxMapCalc.entries()].reduce(([previousKey, previousValue], [currentKey, currentValue]) => {
		return previousValue - currentValue > 0
			? [previousKey, previousValue]
			: [currentKey, currentValue];
	});

	console.log('minute most asleep', max);

	console.log('response', max * sleepyGuard);
})();

// Solution 2
(() => {
	const raw = readInput(4);
	const logs: GuardLog[] = parseOutput(parseOutputDay4, raw);

	// Calculate all sleep data
	const {map: sleepData} = logs.reduce((dto, current) => {
		const {minutes, description, guard} = current;
		const {lastGuard, sleepMinute, map} = dto;

		if (description.startsWith(change) && guard) {
			if (!map.has(guard)) {
				map.set(guard, []);
			}

			return {map, sleepMinute, lastGuard: guard};
		}

		if (description.startsWith(sleep)) {
			return {map, sleepMinute: minutes, lastGuard};
		}

		const hour = Array.from(Array(59).keys());
		const sleepTime: number[] = hour.slice(sleepMinute, minutes);

		const container: number[][] = map.get(lastGuard) as number[][];
		container.push(sleepTime);
		map.set(lastGuard, container);

		return {map, sleepMinute, lastGuard};

	}, {map: new Map<number, number[][]>(), lastGuard: 0, sleepMinute: 0});

	// Sleepiest minute of all guards
	const maxSleepMap = [...sleepData.entries()]
		.reduce((maxMap, [key, value]) => {
			const sleepMinutesMap = new Map<number, number>();

			for (const arr of value) {
				for (const item of arr) {
					sleepMinutesMap.set(item, (sleepMinutesMap.get(item) || 0) + 1);
				}
			}

			if ([...sleepMinutesMap.entries()].length === 0) {
				return maxMap;
			}

			const [max, iterations] = [...sleepMinutesMap.entries()].reduce(([previousKey, previousValue], [currentKey, currentValue]) => {
				return previousValue - currentValue > 0
					? [previousKey, previousValue]
					: [currentKey, currentValue];
			});

			maxMap.set(key, [max, iterations]);

			return maxMap;
		}, new Map<number, [number, number]>());

	const [winGuard, [minute, winIterations]] = [...maxSleepMap.entries()].reduce(([previousKey, [previousMinute, previousIteration]], [currentKey, [currentMinute, currentIteration]]) => {
		return previousIteration - currentIteration > 0
			? [previousKey, [previousMinute, previousIteration]]
			: [currentKey, [currentMinute, currentIteration]];
	});

	console.log(`guard #${winGuard} is most asleep on minute ${minute}. He wins with ${winIterations} iterations Response >> `, winGuard * minute);
})();
