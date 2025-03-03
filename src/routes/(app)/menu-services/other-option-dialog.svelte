<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { toast } from 'svelte-sonner';
	import type { CurrentMenu, UserData } from './menu-schema';
	import QrCodeDialog from './qr-code-dialog.svelte';

	let {
		open = $bindable(),
		currentMenu,
		userData
	}: { open: boolean; currentMenu: CurrentMenu; userData: UserData } = $props();

	// handle other option dialog state
	let appointmentReason: string | undefined = $state(undefined);

	let openQrDialog: boolean = $state(false);
	let nextAppointmentNo: string | undefined = $state(undefined);

	const generateAppointmentNo = async () => {
		let currentTodayNo: string = '';
		await fetch(`${page.url}/get-current-appointment-no`).then(
			async (res) => (currentTodayNo = await res.json())
		);

		// appointment no logic
		const year = String(new Date().getFullYear()).slice(-2);
		const month = String(new Date().getMonth() + 1).padStart(2, '0');
		const day = String(new Date().getDate()).padStart(2, '0');

		const match = currentTodayNo?.match(/(\d{3})$/);

		let sequence = 1;
		if (match) {
			sequence = Number(match[1]) + 1;
		}
		currentTodayNo = sequence.toString().padStart(3, '0');
		nextAppointmentNo = `${currentMenu.code.toUpperCase()}${year}${month}${day}${currentTodayNo}`;
	};

	const createAppointment = async () => {
		const formData = new FormData();
		formData.append('appointmentNo', String(nextAppointmentNo));
		formData.append('menuId', String(currentMenu.id));
		formData.append('reason', String(appointmentReason));
		formData.append('userType', String(userData.type));
		formData.append('userName', String(userData.name));
		formData.append('userNim', String(userData.nim));

		const response = await fetch(`?/createAppointment`, {
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
			<Textarea placeholder="Type your reason here." bind:value={appointmentReason} />

			{#if appointmentReason}
				<p class="mt-2 text-sm text-destructive">
					*Anda akan langsung membuat appointment ketika menekan tombol selanjutnya
				</p>
			{/if}

			<Button
				class="ml-auto mt-4 w-fit"
				onclick={async () => {
					await generateAppointmentNo();
					createAppointment();
				}}>Selanjutnya</Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>

<QrCodeDialog {openQrDialog} data={nextAppointmentNo} />
