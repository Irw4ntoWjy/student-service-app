import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket server started on port 8080');

wss.on('connection', (ws) => {
	console.log('New client connected');

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
