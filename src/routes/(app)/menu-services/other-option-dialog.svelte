<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { toast } from 'svelte-sonner';
	import QrCodeDialog from './qr-code-dialog.svelte';

	let { open = $bindable() }: { open: boolean } = $props();
	let value: string | undefined = $state(undefined);

	let currentAppointmentNo: string | undefined = $state(undefined);
	let openQrDialog: boolean = $state(false);
	const generateQrCode = async () => {
		const res = await fetch(`${page.url}/get-current-appointment-no`);
		const data = await res.json();
		currentAppointmentNo = data;

		const appointmentNo = (Number(currentAppointmentNo) + 1).toString().padStart(3, '0');

		const formData = new FormData();
		formData.append('appointmentNo', String(appointmentNo));
		formData.append('menuId', page.params.id);
		formData.append('reason', String(value));

		const response = await fetch(`?/insertAppointment`, {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			openQrDialog = true;
			toast.success('Berhasil membuat appointment');
		}
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-lg font-bold">Opsi lainnya</Dialog.Title>
			<Dialog.Description class="text-sm text-gray-500">
				Deskripsikan permasalahan yang anda alami
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-col p-0">
			<Textarea placeholder="Type your message here." bind:value />
			{#if value}
				<p class="mt-2 text-sm text-destructive">
					*Anda akan langsung melakukan appointment ketika selesai
				</p>
			{/if}
			<Button class="ml-auto mt-4 w-fit" onclick={() => generateQrCode()}>Selanjutnya</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>

<QrCodeDialog {openQrDialog} data={currentAppointmentNo} />
