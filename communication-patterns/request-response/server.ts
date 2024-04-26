import http from 'http';
import { AddressInfo } from 'net';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  res.end('Hello World!\n');
});

const PORT = 3000;

server.listen(PORT, () => {
  const address = server.address() as AddressInfo;
  console.log(`Server running at http://${address.address}:${address.port}!`);
});
