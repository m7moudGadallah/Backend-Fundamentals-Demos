import { readFileSync } from 'fs';

console.log('start');

const data = readFileSync('./data.txt', 'utf-8');

console.log(data);

console.log('end');