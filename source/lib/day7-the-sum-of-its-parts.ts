import {readInput, parseOutput, parseOutputDay7} from '../utils';
import {Step, Job} from '../entities';

// Solution 1
(() => {
	const raw = readInput(7);
	const input: Step[] = parseOutput(parseOutputDay7, raw);

	console.log(input.length);

	const [start] = input.filter(i => i.cost.length === 0)
		.sort((a, b) => a.step.localeCompare(b.step));

	let end = false;
	const done = new Set<string>([start.step]);

	do {
		const [nextStep] = input.reduce((container, current) => {
			if (done.has(current.step)) {
				return container;
			}

			if (current.cost.length === 0) {
				container.push(current);

				return container;
			}

			let missingCost = false;

			for (const costItem of current.cost) {
				if (!done.has(costItem)) {
					missingCost = true;
				}
			}

			if (!missingCost) {
				container.push(current);
			}

			return container;
		}, [] as Step[])
		.sort((a, b) => a.step.localeCompare(b.step));

		done.add(nextStep.step);

		if (nextStep.end) {
			end = true;
		}
	} while (!end);

	console.log('path', [...done.values()].join(''));
})();

// Solution 2
(() => {
	const raw = readInput(7);
	const input: Step[] = parseOutput(parseOutputDay7, raw);

	let timer = 0;
	let freeWorkers = 5;
	const done = new Set<string>();
	const workersMap = new Map<string, Job>();

	do {
		const jobs = new Set([...workersMap.keys()]);

		for (const key of [...workersMap.keys()]) {
			const job = workersMap.get(key) as Job;

			if (job.time !== timer) {
				continue;
			}

			freeWorkers++;
			done.add(key);
			workersMap.delete(key);
			jobs.delete(key);
		}

		const nextSteps = input.reduce((container, current) => {
			if (done.has(current.step)) {
				return container;
			}

			if (current.cost.length === 0) {
				container.push(current);

				return container;
			}

			let missingCost = false;

			for (const costItem of current.cost) {
				if (!done.has(costItem)) {
					missingCost = true;
				}
			}

			if (!missingCost) {
				container.push(current);
			}

			return container;
		}, [] as Step[])
		.sort((a, b) => a.step.localeCompare(b.step));

		if (freeWorkers === 0) {
			timer++;
			continue;
		}

		for (const nxtStep of nextSteps) {
			if (jobs.has(nxtStep.step)) {
				continue;
			}

			if (freeWorkers === 0) {
				continue;
			}

			const nextStepCost = (nxtStep.step.charCodeAt(0) - 36);

			workersMap.set(nxtStep.step, {time: timer + nextStepCost});
			freeWorkers--;
		}

		// Let time pass
		timer++;
	} while (done.size !== 26);

	console.log(timer - 1);
})();
