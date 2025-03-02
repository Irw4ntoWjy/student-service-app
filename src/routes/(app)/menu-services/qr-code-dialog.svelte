<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import QRCode from '@castlenine/svelte-qrcode';
	import { Realtime } from 'ably';

	let { openQrDialog, data }: { openQrDialog: boolean; data: string | undefined } = $props();

	let qrCodeUrl = $derived(`${page.url}/appointment/${data}`);

	// NOTES creds masih kena expose
	$effect.root(() => {
		const ably = new Realtime({ key: 'gqo0ug.eOzcSw:e6g093vBHe3phpt2f4nBviuRBeSLkTSfQ3RXN2fBpMI' });
		const channel = ably.channels.get('updates');

		channel.subscribe('update', () => {
			goto('/');
		});

		// Unsubscribe when the component is destroyed
		return () => {
			channel.unsubscribe();
			ably.close();
		};
	});
</script>

<Dialog.Root bind:open={openQrDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-lg font-bold">Scan QR Dibawah ini</Dialog.Title>
			<Dialog.Description class="text-sm text-gray-500">
				Berikut merupakan Nomor Antrian anda, Scan untuk mengambil nomor antrian anda !
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex w-full items-center justify-center">
			{#if data}
				<QRCode data={qrCodeUrl} />
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
