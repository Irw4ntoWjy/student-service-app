import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket server started on port 8080');

wss.on('connection', (ws, req) => {
	console.log('New client connected');

	// Check the origin of the request (optional)
	const origin = req.headers.origin;
	if (origin !== 'http://localhost:5173') {
		console.log('Connection from unauthorized origin:', origin);
		ws.close(); // Close the connection if the origin is not allowed
		return;
	}

	ws.on('message', (message) => {
		console.log(`Received: ${message}`);
	});

	ws.on('close', () => {
		console.log('Client disconnected');
	});
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function broadcastUpdate(data: any) {
	console.log('Broadcasting update to clients');
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(data));
		}
	});
}
