<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import QRCode from '@castlenine/svelte-qrcode';

	let { openQrDialog, data }: { openQrDialog: boolean; data: string | undefined } = $props();

	let ws: WebSocket | null = $state(null);

	$effect.root(() => {
		if (openQrDialog && data) {
			// Connect to WebSocket server
			ws = new WebSocket('ws://localhost:8080');

			ws.onopen = () => {
				if (ws) {
					console.log('WebSocket connection established');
					ws.send(data);
				}
			};

			ws.onmessage = (event) => {
				console.log('Message from server:', event.data);
				alert(event.data);
			};

			ws.onclose = () => {
				console.log('WebSocket connection closed');
			};

			ws.onerror = (error) => {
				console.error('WebSocket error:', error);
			};
		}

		return () => {
			if (ws) {
				ws.close();
			}
		};
	});
</script>

<Dialog.Root bind:open={openQrDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-lg font-bold">Scan QR Dibawah ini</Dialog.Title>
			<Dialog.Description class="text-sm text-gray-500">
				Scan untuk mengambil nomor antrian anda !
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex w-full items-center justify-center">
			{#if data}
				<QRCode {data} />
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
