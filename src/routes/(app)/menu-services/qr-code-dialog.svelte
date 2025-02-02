<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import QRCode from '@castlenine/svelte-qrcode';

	let { openQrDialog, data }: { openQrDialog: boolean; data: string | undefined } = $props();
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
