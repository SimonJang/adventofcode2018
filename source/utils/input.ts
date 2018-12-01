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
