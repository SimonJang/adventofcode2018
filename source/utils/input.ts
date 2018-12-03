import * as fs from 'fs';
import * as path from 'path';

export const readInput = (day: number) => {
	const filePath = path.join(__dirname, '..', 'data', `day${day}.txt`);

	return fs.readFileSync(filePath);
};

export const parseOutput = (parser: Function, data: Buffer) => {
	return parser(data);
};

export const parseTextToArray = (data: Buffer) => {
	return data.toString()
		.split('\n')
		.filter(row => row.trim());
};

export const parseOutputDay3 = (data: Buffer) => {
	const rows = parseTextToArray(data);

	return rows.map(row => {
		return row.split(' ')
			.filter(item => item.indexOf(',') !== -1 || item.indexOf('x') !== -1)
			.reduce((_, __, ___, arr) => {
				const [start, size] = arr;

				const [xStart, yStart] = start.replace(':', '').split(',');
				const [xSize, ySize] = size.split('x');

				return {
					start: {
						x: Number(xStart),
						y: Number(yStart)
					},
					size: {
						x: Number(xSize),
						y: Number(ySize)
					}
				};
			}, {});
	});
};
