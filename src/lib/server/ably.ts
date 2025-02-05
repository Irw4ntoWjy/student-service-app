import { Realtime } from 'ably';

// Initialize Ably Realtime
const ably = new Realtime({ key: 'gqo0ug.eOzcSw:e6g093vBHe3phpt2f4nBviuRBeSLkTSfQ3RXN2fBpMI' });
const channel = ably.channels.get('updates');

console.log('Ably initialized');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function broadcastUpdate(data: any) {
	// Function to broadcast updates using Ably
	console.log('Broadcasting update via Ably');
	channel.publish('update', data);
}
