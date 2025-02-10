<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { toast } from 'svelte-sonner';
	import QrCodeDialog from './qr-code-dialog.svelte';

	let {
		open = $bindable(),
		menu
	}: {
		open: boolean;
		menu: { id: number | undefined; name: string | undefined; code: string | undefined };
	} = $props();
	let value: string | undefined = $state(undefined);

	let nextAppointmentNo: string | undefined = $state(undefined);
	let openQrDialog: boolean = $state(false);

	const generateQrCode = async () => {
		let currentAppointmentNo: string | undefined = undefined;
		const response = await fetch(`${page.url}/get-current-appointment-no`).then((res) =>
			res.json()
		);
		currentAppointmentNo = response;

		if (menu.name && menu.code) {
			const now = new Date();
			const year = String(now.getFullYear()).slice(-2);
			const day = String(now.getDate()).padStart(2, '0');

			// Extract and increment the appointment number
			const match = currentAppointmentNo?.match(/(\d{3})$/);
			let sequence = 1;

			if (match) {
				sequence = Number(match[1]) + 1;
			}
			currentAppointmentNo = sequence.toString().padStart(3, '0');
			nextAppointmentNo = `${menu.code}${year}${day}${currentAppointmentNo}`;

			// Send the new appointment number
			const formData = new FormData();
			formData.append('appointmentNo', nextAppointmentNo);
			formData.append('menuId', String(menu.id));
			formData.append('reason', String(value));

			const response = await fetch(`?/insertAppointment`, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				openQrDialog = true;
				toast.success('Berhasil membuat appointment');
			}
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
					*Anda akan langsung melakukan appointment ketika menekan tombol selanjutnya
				</p>
			{/if}
			<Button class="ml-auto mt-4 w-fit" onclick={() => generateQrCode()}>Selanjutnya</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>

<QrCodeDialog {openQrDialog} data={nextAppointmentNo} />
