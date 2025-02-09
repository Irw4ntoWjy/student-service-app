<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { toast } from 'svelte-sonner';
	import QrCodeDialog from './qr-code-dialog.svelte';

	let { open = $bindable(), menuId = $bindable() }: { open: boolean; menuId: number } = $props();
	let value: string | undefined = $state(undefined);

	let nextAppointmentNo: string | undefined = $state(undefined);
	let openQrDialog: boolean = $state(false);

	const generateQrCode = async () => {
		let currentAppointmentNo: string | undefined = undefined;
		const res = await fetch(`${page.url}/get-current-appointment-no`).then((res) => res.json());
		currentAppointmentNo = res;

		// Extract the sequence number (XXX), month letter (M), and year (YY)
		const match = currentAppointmentNo?.match(/^(\d{3})([A-L])(\d{2})$/);

		if (match) {
			let sequence = Number(match[1]) + 1; // Increment sequence number
			const monthLetter = match[2];
			const year = match[3];

			nextAppointmentNo = `${sequence.toString().padStart(3, '0')}${monthLetter}${year}`;
		} else {
			// If no previous ticket exists, start from 001 with current month/year
			const currentYear = new Date().getFullYear() % 100;
			const currentMonthLetter = String.fromCharCode(65 + new Date().getMonth());

			nextAppointmentNo = `001${currentMonthLetter}${currentYear}`;
		}

		// Send the new appointment number
		const formData = new FormData();
		formData.append('appointmentNo', nextAppointmentNo);
		formData.append('menuId', String(1));
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

<QrCodeDialog {openQrDialog} data={nextAppointmentNo} />
