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
		userData,
		menuAction
	}: {
		open: boolean;
		currentMenu: CurrentMenu;
		userData: UserData;
		menuAction: string | undefined;
	} = $props();

	// handle other option dialog state
	let appointmentReason: string | undefined = $state(undefined);

	let openQrDialog: boolean = $state(false);
	let nextAppointmentNo: string | undefined = $state(undefined);

	const generateAppointmentNo = async () => {
		let currentTodayNo: string = '';
		await fetch(`${page.url}/get-current-appointment-no`).then(
			async (res) => (currentTodayNo = await res.json())
		);

		console.log(currentTodayNo);
		// appointment no logic
		const now = new Date();
		const year = String(now.getUTCFullYear()).slice(-2);
		const month = String(now.getUTCMonth() + 1).padStart(2, '0');
		const day = String(now.getUTCDate()).padStart(2, '0');
		const todayPrefix = `${year}${month}${day}`;

		const match = currentTodayNo?.match(/(\d{3})$/);
		let sequence = 1;
		if (match) {
			sequence = Number(match[1]) + 1;
		}

		nextAppointmentNo = `${currentMenu.code?.toUpperCase()}${todayPrefix}${sequence
			.toString()
			.padStart(3, '0')}`;
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
			<Dialog.Title class="text-lg font-bold"
				>{menuAction ? menuAction : 'Appointment'}
			</Dialog.Title>
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
