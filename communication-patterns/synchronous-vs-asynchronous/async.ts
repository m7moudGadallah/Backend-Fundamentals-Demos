import { readFile } from 'fs';

console.log('start');

readFile('./data.txt', 'utf-8', (err, data) => {
  console.log(data);
});

console.log('end');
