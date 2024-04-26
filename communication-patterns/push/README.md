# Push communication pattern

## Overview

The push communication pattern is a pattern where a server sends data to a client without the client requesting it. This is useful when the server has data that the client needs to know about, but the client doesn't know when the data will be available.

## Demo Overview

Demo for this pattern is a simple chat application. that when client send a message to the server, the server will broadcast the message to all connected clients.

## Getting started

**1. Clone the repository:**

```bash
git clone <repository-url>
```

**2. Navigate to the `push` folder:**

```bash
cd communication-patterns/push
```

**3. Install the dependencies:**

```bash
yarn install
```

**4. Run the server:**

```bash
yarn start
```

**5. Connect to the server:**

- Open the browser and open console from developer tools.
- create websocket connection to `ws://localhost:3000` using the following code:

```javascript
const ws = new WebSocket('ws://localhost:3000');

// log incoming messages
ws.onmessage = (message) => {
  console.log(`> ${message.data}`);
};

// send message to the server
ws.send('Hi!');
```

- open another tabs and repeat the same steps to create another client.
- send a message from one of the clients and see the message is broadcasted to all connected clients.

Enjoy Demo! 🎉
