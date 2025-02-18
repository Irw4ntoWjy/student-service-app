<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';

	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ComboboxType } from '$lib/components/ui/combobox';
	import Combobox from '$lib/components/ui/combobox/combobox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { Check, Undo2, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { QueueTicketSchema, Status } from './queue-ticket-schema';

	type QueueTicketProps = {
		queueTicket: QueueTicketSchema;
		staffList: ComboboxType[];
		menuList: ComboboxType[];
	};

	const cardColor = {
		active: 'bg-sky-400 text-gray-50',
		pending: '',
		waiting: '',
		closed: 'bg-green-600 text-gray-50',
		cancelled: 'bg-destructive text-gray-50'
	};

	let { queueTicket, staffList, menuList }: QueueTicketProps = $props();

	const finishedTicket = queueTicket.status === 'closed' || queueTicket.status === 'cancelled';

	let openCancelDialog: boolean = $state(false);
	let isHovered: boolean = $state(false);
	let cancelReason: string | undefined = $state(undefined);

	const updateTicketStatus = async (id: string, newStatus: Status) => {
		const formData = new FormData();
		formData.append('id', id);
		formData.append('status', newStatus);

		if (newStatus === 'cancelled') {
			formData.append('reason', String(cancelReason));
		}

		if (queueTicket.status === 'pending' && newStatus === 'active') {
			const fetchData = await fetch(`${page.url}/count-current-active-ticket`);
			const countActiveTicket = await fetchData.json();

			if (countActiveTicket > 0) {
				toast.error('Gagal untuk mengubah status ticket', {
					description: 'Terdapat appointment yang sedang berjalan !',
					class: 'text-lg '
				});
				return;
			}
		}

		const response = await fetch('?/updateStatusActive', {
			method: 'POST',
			body: formData
		});

		if (response.status === 200) {
			await invalidateAll();
			openCancelDialog = false;
			toast.success('Berhasil Mengubah Status Tiket', {
				class: 'text-lg '
			});
		}
	};

	let timeGap: string = $state('00 : 00');
	let isTimeLimitReached: boolean = $state(false);
	let totalSeconds: number = $state(0);

	$effect(() => {
		if (queueTicket.status === 'pending' || queueTicket.status === 'waiting') {
			const interval = setInterval(() => {
				const createdTime = new Date(queueTicket.scannedAt);
				createdTime.setHours(createdTime.getHours() + 7);

				const currentTime = new Date(
					new Date().toLocaleString('en-US', {
						timeZone: 'Asia/Jakarta'
					})
				);

				const timeDiff: number = currentTime.getTime() - createdTime.getTime();

				const seconds = Math.floor(timeDiff / 1000);
				const minutes = Math.floor(seconds / 60);

				timeGap = `${(minutes % 60).toString().padStart(2, '0')} : ${(seconds % 60).toString().padStart(2, '0')}`;
				totalSeconds = Math.floor(timeDiff / 1000);

				if (totalSeconds > 300 && queueTicket.status === 'pending') {
					isTimeLimitReached = true;
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	});

	$effect(() => {
		if (isTimeLimitReached) {
			updateTicketStatus(queueTicket.id.toString(), 'waiting');

			isTimeLimitReached = false;
			invalidateAll();
		}
	});

	$effect(() => {
		//auto cancel appointment if out of time limit
		if (totalSeconds > 5400) {
			updateTicketStatus(queueTicket.id.toString(), 'cancelled');

			totalSeconds = 0;
			invalidateAll();
		}
	});

	// re-create ticket logic
	let recrateTicket: boolean = $state(false);
	let menuCbxValue: string = $state('');
	let menuCbxData: ComboboxType | undefined = $state(undefined);

	const recreateTicket = async () => {
		let currentAppointmentNo: string = '';
		let nextAppointmentNo: string = '';
		const response = await fetch(
			`${page.url.origin}/menu-services/get-current-appointment-no`
		).then((res) => res.json());
		currentAppointmentNo = response;

		const now = new Date();
		const year = String(now.getFullYear()).slice(-2);
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');

		const match = currentAppointmentNo?.match(/(\d{3})$/);

		let sequence = 1;

		if (match) {
			sequence = Number(match[1]) + 1;
		}
		currentAppointmentNo = sequence.toString().padStart(3, '0');
		nextAppointmentNo = `${menuCbxData?.data}${year}${month}${day}${currentAppointmentNo}`;

		const formData = new FormData();
		formData.append('appointmentNo', nextAppointmentNo);
		formData.append('menuId', String(menuCbxValue));
		formData.append('reason', String(cancelReason));

		const res = await fetch(`?/insertAppointment`, {
			method: 'POST',
			body: formData
		});
		if (res.ok) {
			recrateTicket = false;
			await invalidateAll();
			toast.success('Berhasil membuat kembali appointment');
		}
	};

	// update appointment served staff
	let openAppointmentDetailDialog: boolean = $state(false);
	let staffCbxValue: string = $state('');
	let staffCbxData: ComboboxType | undefined = $state(undefined);

	const updateAppointmentDetail = async () => {
		if (staffCbxData) {
			const formData = new FormData();
			formData.append('id', queueTicket.id.toString());
			formData.append('servedBy', staffCbxData.label);
			formData.append('servedId', staffCbxData.value);

			await fetch(`?/updateAppointmentDetail`, {
				method: 'POST',
				body: formData
			});
		}

		await updateTicketStatus(queueTicket.id.toString(), 'closed');
		await invalidateAll();
		openAppointmentDetailDialog = false;
	};

	$inspect(cancelReason);
</script>

<Card.Root
	class="{queueTicket.status === 'closed' || queueTicket.status === 'cancelled'
		? 'h-auto'
		: 'h-[16.75rem]'}  w-[22.25rem]  {cardColor[
		queueTicket.status
	]} relative flex cursor-pointer items-center justify-center rounded-lg border-none shadow-xl transition-shadow duration-300 hover:shadow-2xl"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => {
		setTimeout(() => {
			isHovered = false;
		}, 200);
	}}
>
	<div class={finishedTicket ? 'flex items-center justify-evenly p-1' : ''}>
		<Card.Content
			class="flex flex-col {finishedTicket ? 'text-right' : 'items-center justify-center'} p-2"
		>
			{#if isHovered && (queueTicket.status === 'pending' || queueTicket.status === 'waiting' || queueTicket.status === 'active')}
				<div
					class="relative flex h-[16rem] w-[20.25rem] flex-col justify-between rounded-lg {cardColor[
						queueTicket.status
					]} p-6"
					onmouseleave={() => (isHovered = false)}
					role="dialog"
					aria-modal="true"
				>
					<div class="mb-2 flex h-[12rem] flex-col items-center justify-center text-center">
						<p
							class="w-full overflow-hidden text-ellipsis text-wrap break-words text-2xl font-medium leading-relaxed"
						>
							{queueTicket.reason || 'No description available'}
						</p>
					</div>

					<div class="flex justify-end gap-3">
						{#if queueTicket.status === 'pending' || queueTicket.status === 'waiting'}
							<Button variant="destructive" onclick={() => (openCancelDialog = true)}>
								<X />
							</Button>
						{/if}
						{#if queueTicket.status === 'active'}
							<Button
								variant="outline"
								class="border transition-colors duration-200 hover:bg-gray-300"
								onclick={() => (recrateTicket = true)}
							>
								<Undo2 class="size-8 text-black" />
							</Button>
						{/if}
						<Button
							class="bg-green-500 text-gray-50 hover:bg-green-600"
							onclick={async () => {
								if (queueTicket.status === 'pending' || queueTicket.status === 'waiting') {
									await updateTicketStatus(queueTicket.id.toString(), 'active');
								} else {
									openAppointmentDetailDialog = true;
								}
							}}
						>
							<Check />
						</Button>
					</div>
				</div>
			{:else}
				<span
					class=" {queueTicket.status === 'waiting' ? 'text-destructive' : ''} {finishedTicket
						? 'text-4xl font-semibold'
						: 'text-5xl font-bold'} tracking-wide">{queueTicket.appointmentNo}</span
				>
			{/if}
		</Card.Content>
	</div>

	{#if queueTicket.status === 'pending' || queueTicket.status === 'waiting'}
		<span
			class="absolute bottom-2 left-2 ml-2 text-2xl font-bold {totalSeconds > 300
				? 'text-destructive'
				: 'text-green-500'}">{timeGap}</span
		>
	{/if}
</Card.Root>

<Dialog.Root bind:open={openCancelDialog}>
	<Dialog.Content class="h-[14rem] max-w-[31rem]">
		<Dialog.Header>
			<Dialog.Title class="text-lg font-medium">Batalkan Appointment ini</Dialog.Title>

			<div class="flex flex-col gap-[12px]">
				<span>Isi Alasan Pembatalan Appointment dibawah ini</span>
				<Input bind:value={cancelReason} />
			</div>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				class="w-[88px]"
				onclick={() => {
					isHovered = false;
					openCancelDialog = false;
				}}>Kembali</Button
			>
			<Button
				class="w-[88px]"
				type="submit"
				variant="destructive"
				onclick={async () => {
					await updateTicketStatus(queueTicket.id.toString(), 'cancelled');
					isHovered = false;
					await invalidateAll();
				}}>Batalkan</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={recrateTicket}>
	<Dialog.Content class="h-auto max-w-[36rem]">
		<Dialog.Header>
			<Dialog.Title class="text-2xl font-medium">
				Membuka kembali Ticket {queueTicket.appointmentNo}
			</Dialog.Title>

			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-[12px]">
					<Label class="text-xl font-medium">Pilih Divisi yang melayani</Label>
					<Combobox
						items={menuList}
						placeholder="Pilih Divisi..."
						bind:value={menuCbxValue}
						bind:selectedData={menuCbxData}
					/>
				</div>

				<div class="flex flex-col gap-[12px]">
					<Label class="text-xl font-medium">Isi Alasan pembukaan ticket dibawah ini</Label>
					<Textarea
						oninput={(e) => {
							cancelReason = e.currentTarget.value;
						}}
					/>
				</div>
			</div>
		</Dialog.Header>

		<Dialog.Footer>
			<Button
				class="w-[88px] text-base"
				variant="outline"
				onclick={() => {
					recrateTicket = false;
				}}
				>Kembali
			</Button>
			<Button
				class="w-[88px] text-base"
				type="submit"
				onclick={async () => {
					await updateTicketStatus(queueTicket.id.toString(), 'cancelled');
					await recreateTicket();
				}}
				>Tambah
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={openAppointmentDetailDialog}>
	<Dialog.Content class="h-auto max-w-[36rem]">
		<Dialog.Header>
			<Dialog.Title class="text-2xl font-medium">
				Selesai melayani Ticket {queueTicket.appointmentNo}
			</Dialog.Title>

			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-[12px]">
					<Label class="text-xl font-medium">Pilih Staff yang melayani</Label>
					<Combobox
						items={staffList}
						placeholder="Pilih Staff..."
						bind:value={staffCbxValue}
						bind:selectedData={staffCbxData}
					/>
				</div>
			</div>
		</Dialog.Header>

		<Dialog.Footer>
			<Button
				class="w-[88px] text-base"
				variant="outline"
				onclick={() => {
					openAppointmentDetailDialog = false;
				}}
				>Kembali
			</Button>
			<Button
				class="w-[88px] text-base"
				type="submit"
				onclick={async () => {
					await updateAppointmentDetail();
				}}
				>Selesai
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
