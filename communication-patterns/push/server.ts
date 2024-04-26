import http from 'http';
import { connection, server as WebSocket } from 'websocket';

const connections: connection[] = [];

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  res.end('Hello World!\n');
});

server.listen(8080, () => {
  console.log(new Date() + ' Server is listening on port 8080');
});

const webSocketServer = new WebSocket({
  httpServer: server,
});

webSocketServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);

  console.log(
    `${new Date()} | Peer ${connection.remoteAddress}:${
      connection.socket.remotePort
    } connected.`
  );

  connection.sendUTF(`You are connected.`);
  connections.forEach((conn) => {
    conn.sendUTF(`Peer(${conn.socket.remotePort}) connected.`);
  });

  connections.push(connection);

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log(
        `${new Date()} | Peer ${connection.remoteAddress}:${
          connection.socket.remotePort
        } | Received Message: ${message.utf8Data}`
      );

      connections.forEach((conn) => {
        if (conn === connection) conn.sendUTF(`You: ${message.utf8Data}`);
        else
          conn.sendUTF(`Peer(${conn.socket.remotePort}): ${message.utf8Data}`);
      });
    }
  });

  connection.on('close', function (reasonCode, description) {
    const connectionIndex = connections.findIndex(
      (conn) => conn === connection
    );
    connections.splice(connectionIndex, 1);
    connections.forEach((conn) => {
      conn.sendUTF(`Peer(${conn.socket.remotePort}) disconnected.`);
    });
    console.log(
      `${new Date()} | Peer ${connection.remoteAddress}:${
        connection.socket.remotePort
      } disconnected.`
    );
  });
});
