import {readInput, parseOutput, parseTextToArray} from '../utils';

interface Node {
	value: number;
	entries: number;
	metaCount: number;
	meta: any[];
	children: any[];
	parent?: Node;
}

const enum Action {
	HEADER_CHILD_NODES = 'HEADER_CHILD_NODES',
	HEADER_METADATA_ENTRIES = 'HEADER_METADATA_ENTRIES',
	METADATA_ENTRY = 'METADATA_ENTRY',
	NO_ACTION = 'NO_ACTION'
}

// Solution 1
(() => {
	const raw = readInput(8);
	const [input]: String[] = parseOutput(parseTextToArray, raw);
	const stream = input.split(' ')
		.filter(inputItem => inputItem.trim())
		.map(inputItem => Number(inputItem));

	const child: number[] = [];
	const entries: number[] = [];
	const metadata: number[] = [];

	const lastEntry = () => entries[entries.length - 1];
	const lastChild = () => child[child.length - 1];
	const subtractEntry = () => entries[entries.length - 1]--;
	const subtractChild = () => child[child.length - 1]--;

	stream.reduce((step, current) => {
		switch (step) {
			case Action.HEADER_CHILD_NODES:
				child.push(current);

				return Action.HEADER_METADATA_ENTRIES;
			case Action.HEADER_METADATA_ENTRIES: {
				entries.push(current);

				return lastChild() === 0
					? Action.METADATA_ENTRY
					: Action.HEADER_CHILD_NODES;

			}
			case Action.METADATA_ENTRY:
				metadata.push(current);
				subtractEntry();

				// No more metadata
				if (lastEntry() === 0) {
					entries.pop();

					// Only child
					if (lastChild() === 0) {
						child.pop();
						subtractChild();

						if (lastChild() === 0) {
							return Action.METADATA_ENTRY;
						}

						return Action.HEADER_CHILD_NODES;
					}

					subtractChild();

					return Action.HEADER_CHILD_NODES;
				}

				// Meta data remaining
				return Action.METADATA_ENTRY;

			default:
				return Action.NO_ACTION;
		}
	}, Action.HEADER_CHILD_NODES);

	console.log(metadata.reduce((current, previous) => current + previous, 0));
})();

// Solution 2
(() => {
	const raw = readInput(8);
	const [input]: String[] = parseOutput(parseTextToArray, raw);
	const stream = input.split(' ')
		.filter(inputItem => inputItem.trim())
		.map(inputItem => Number(inputItem));

	const calcValue = (node: Node): Node => {
		if (!node.children.length) {
			node.value = node.meta.reduce((a, b) => a + b);

			return node;
		}

		if (node.children.length) {
			for (const metaItem of node.meta) {
				if (metaItem > 0 && node.children.length >= metaItem) {
					node.value += (node.children[metaItem - 1] as Node).value;
				}
			}
		}

		return node;
	};

	const root: Node = {value: 0, entries: stream.shift() as number, metaCount: stream.shift() as number, meta: [] as any, children: []};
	let current: Node = root;

	while (stream.length) {
		if (current.entries > 0) {
			current.entries--;

			const newNode = {value: 0, entries: stream.shift() as number, metaCount: stream.shift() as number, meta: [], children: [], parent: current};
			current.children.push(newNode);

			current = newNode;
		} else if (current.metaCount > 0) {
			current.metaCount--;

			current.meta.push(stream.shift());
		} else {
			calcValue(current);

			current = current.parent as Node;
		}
	}

	const rootNode = calcValue(root);
	console.log(rootNode.value);
})();
