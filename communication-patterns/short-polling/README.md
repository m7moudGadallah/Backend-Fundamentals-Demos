# Short Polling Communication Pattern

## Overview

Short polling is a communication pattern where a client repeatedly polls a server for updates. The client sends a request to the server, and the server responds with the latest data. The client then waits for a short period of time before sending another request. This process is repeated at regular intervals to keep the client up to date with the latest information.

## Demo

This demo shows a simple an example of short polling in action. By building a simple image resizing service, we can see how short polling can be used to check if images have been resized and download them when they are ready.

To run the demo, follow these steps:

**1. Clone the repository:**

```bash
git clone
```

**2. Navigate to the `short-polling` folder:**

```bash
cd communication-patterns/short-polling
```

**3. Install the dependencies:**

```bash
yarn install
```

**4. Run the server:**

```bash
yarn start
```

**5. Follow postman collection to test the API:**

- [Image Resizer API Postman Docs](https://documenter.getpostman.com/view/27682136/2sA3BuUoJm)

Enjoy Demo!🎉
