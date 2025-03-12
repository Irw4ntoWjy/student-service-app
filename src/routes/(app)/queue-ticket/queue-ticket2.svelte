<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { StatusType } from '$lib/server/sql/appointment-query';
	import { Calendar, Check, RotateCw, Sheet, User, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { AppointmentWithDetail } from './queue-ticket-schema';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Combobox from '$lib/components/ui/combobox/combobox.svelte';
	import type { ComboboxType } from '$lib/components/ui/combobox';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { page } from '$app/state';

	let {
		data,
		staffList,
		menuList
	}: { data: AppointmentWithDetail; staffList?: ComboboxType[]; menuList?: ComboboxType[] } =
		$props();

	const cardColor = {
		CREATED: '',
		SCANNED: 'bg-slate-50',
		PENDING: 'bg-slate-50',
		ONGOING: 'bg-sky-400 text-gray-50',
		COMPLETED: 'bg-green-600 text-gray-50',
		CANCELLED: 'bg-destructive text-gray-50 border-none'
	};

	const statusTranslation = {
		CREATED: 'Terdaftar',
		SCANNED: 'Sedang Menunggu',
		PENDING: 'Belum Terlayani',
		ONGOING: 'Sedang Dilayani',
		COMPLETED: 'Selesai Dilayani',
		CANCELLED: 'Dibatalkan'
	};

	const userType = {
		STUDENT: 'Mahasiswa',
		EXTERNAL: 'Umum'
	};

	const updateAppointmentStatus = async (id: number, status: StatusType) => {
		const formData = new FormData();
		formData.append('id', String(id));
		formData.append('status', status);
		if (status === 'CANCELLED') formData.append('cancelReason', String(cancelReason));
		if (status === 'COMPLETED') formData.append('servedBy', String(staffCbxData?.value));

		const response = await fetch('?/updateAppointmentStatus', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();

		if (result.status === 400) {
			toast.error(result.data.message || 'Gagal Mengubah Status Tiket', {
				class: 'text-lg',
				description: 'Mohon pastikan tidak ada appointment yang sedang berjalan'
			});
		} else {
			toast.success('Berhasil Mengubah Status Tiket', {
				class: 'text-lg '
			});
		}

		openDetailDialog = false;
		openCancelDialog = false;
		cancelReason = undefined;
		cancelReason = undefined;

		await invalidateAll();
	};

	let timeElapsed = $state(0);
	let currentTime = $state(new Date());
	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
			timeElapsed += 1;

			//NOTES perlu adjust interval lagi
			if (data.statusType === 'SCANNED' && timeElapsed >= 20) {
				clearInterval(interval);
				updateAppointmentStatus(data.id, 'PENDING');
			}

			if (data.statusType === 'PENDING' && timeElapsed >= 30) {
				clearInterval(interval);
				cancelReason = 'Dibatalkan oleh sistem';
				updateAppointmentStatus(data.id, 'CANCELLED');
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	const currentWaitingTime = $derived.by(() => {
		const scannedAt = new Date(data.scannedAt);
		const timezoneOffsetHours = currentTime.getTimezoneOffset() / -60;
		scannedAt.setHours(scannedAt.getHours() + timezoneOffsetHours);

		const diffMs = currentTime.getTime() - scannedAt.getTime();

		const totalSeconds = Math.floor(diffMs / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		return {
			get waitingTime() {
				return `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
			},
			get totalWaitingTime() {
				return totalSeconds;
			}
		};
	});

	const handleUpdateAppointment = async () => {
		//update to ongoing appointment
		if (data.statusType === 'SCANNED' || data.statusType === 'PENDING') {
			updateAppointmentStatus(data.id, 'ONGOING');
		}
		if (data.statusType === 'ONGOING') {
			openServedFormDialog = true;
			openDetailDialog = false;
		}
	};

	let openDetailDialog: boolean = $state(false);
	let openCancelDialog: boolean = $state(false);
	let openServedFormDialog: boolean = $state(false);
	let openRecreateTicketDialog: boolean = $state(false);

	let cancelReason: string | undefined = $state(undefined);
	let staffCbxData: ComboboxType | undefined = $state(undefined);
	let menuCbxData: ComboboxType | undefined = $state(undefined);

	const recreateNewAppointment = async () => {
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
		formData.append('id', String(data.id));
		formData.append('appointmentNo', nextAppointmentNo);
		formData.append('menuId', String(menuCbxData?.value));
		formData.append('reason', String(cancelReason));

		const res = await fetch(`?/insertAppointment`, {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			await updateAppointmentStatus(data.id, 'CANCELLED');

			toast.success('Berhasil membuat kembali appointment');
			await invalidateAll();
		}
	};
</script>

<Dialog.Root bind:open={openDetailDialog}>
	<Dialog.Trigger>
		<Card.Root
			class="{data.statusType === 'CANCELLED' || data.statusType === 'COMPLETED'
				? 'h-[4rem]'
				: 'h-[16rem]'} w-[22rem] cursor-pointer rounded-lg border-none"
		>
			<Card.Content
				class="relative flex h-full items-center justify-center rounded-lg p-4 {cardColor[
					data.statusType
				]}"
			>
				<span class="text-4xl font-bold">{data.appointmentNo}</span>
				{#if data.statusType === 'PENDING' || data.statusType === 'SCANNED'}
					<span
						class="absolute bottom-4 right-4 text-[28px] font-semibold {data.statusType ===
							'SCANNED' && currentWaitingTime.totalWaitingTime > 300
							? 'text-destructive'
							: data.statusType === 'PENDING'
								? 'text-black'
								: 'text-green-500'}">{currentWaitingTime.waitingTime}</span
					>
				{/if}
			</Card.Content>
		</Card.Root>
	</Dialog.Trigger>
	<Dialog.Content>
		<div class="inline-flex flex-col items-center justify-center">
			<div class="flex items-center gap-2 rounded-lg border border-slate-300 p-2">
				<User class="size-4" />
				<span class="font-semibold">{statusTranslation[data.statusType]}</span>
			</div>
		</div>

		<div class="flex flex-col items-center gap-1">
			<span class="text-4xl font-bold">{data.appointmentNo}</span>
			<span class="text-slate-400">Nomor Antrian</span>
			<Separator class="mt-3 h-0.5" />
		</div>

		<div class="">
			<div class="flex items-center gap-2 text-slate-500">
				<User class="size-4" />
				<span class="text-lg font-medium text-slate-500">Tipe Tamu</span>
			</div>
			<span class="text-xl font-semibold">{userType[data.userType]}</span>
		</div>

		<div class="">
			<div class="flex w-full items-center">
				<div class="flex w-[50%] flex-col gap-2">
					<div class="flex items-center gap-2">
						<Calendar class="size-4" />
						<span class="text-lg font-medium text-slate-500">Nama Tamu</span>
					</div>
					<span class="text-xl font-semibold">{data.userName}</span>
				</div>

				{#if data.userNim}
					<div class="flex w-[50%] flex-col gap-2">
						<div class="flex items-center gap-2">
							<Sheet class="size-4" />
							<span class="text-lg font-medium text-slate-500">NIM Tamu</span>
						</div>
						<span class="text-xl font-semibold">{data.userNim}</span>
					</div>
				{/if}
			</div>
		</div>

		<div class="">
			<div class="flex items-center gap-2 text-slate-500">
				<Sheet class="size-4" />
				<span class="text-lg font-medium text-slate-500">Alasan Appointment</span>
			</div>
			<span class="text-xl font-semibold">{data.reason}</span>
		</div>

		<div class="flex justify-end gap-4">
			{#if data.statusType !== 'CANCELLED' && data.statusType !== 'COMPLETED'}
				{#if data.statusType !== 'ONGOING'}
					<Button
						variant="ghost"
						class="flex items-center gap-2 bg-destructive p-4 hover:bg-destructive"
						onclick={() => (openCancelDialog = true)}
					>
						<X class="font-bold text-white" />
						<span class="text-lg text-white">Dibatalkan</span>
					</Button>
				{:else}
					<Button
						variant="outline"
						onclick={() => {
							openRecreateTicketDialog = true;
							openDetailDialog = false;
						}}
					>
						<RotateCw class="font-bold text-black" />
						<span class="text-lg text-black">Dibuka Kembali</span>
					</Button>
				{/if}

				<Button
					variant="ghost"
					class=" bg-green p-4 hover:bg-green"
					onclick={async () => {
						await handleUpdateAppointment();
					}}
				>
					<Check class="size-8 text-white" />
					<span class="text-lg text-white"
						>{data.statusType === 'SCANNED' || data.statusType === 'PENDING'
							? 'Dilayani'
							: 'Selesai'}</span
					>
				</Button>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>

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
					openCancelDialog = false;
				}}>Kembali</Button
			>
			<Button
				class="w-[88px]"
				type="submit"
				variant="destructive"
				disabled={!cancelReason}
				onclick={async () => {
					updateAppointmentStatus(data.id, 'CANCELLED');
				}}>Batalkan</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={openServedFormDialog}>
	<Dialog.Content class="h-[14rem] max-w-[36rem]">
		<Dialog.Header>
			<Dialog.Title class="text-2xl font-medium">
				Selesai melayani Ticket
				<span class="font-semibold">{data.appointmentNo}</span>
			</Dialog.Title>

			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-[12px]">
					<Label class="text-lg font-normal">Pilih Staff yang melayani</Label>
					<Combobox
						items={staffList || []}
						placeholder="Pilih Staff..."
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
					openServedFormDialog = false;
					openDetailDialog = true;
				}}>Kembali</Button
			>
			<Button
				class="w-[88px] text-base"
				type="submit"
				onclick={() => {
					updateAppointmentStatus(data.id, 'COMPLETED');
				}}>Selesai</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={openRecreateTicketDialog}>
	<Dialog.Content class="h-auto max-w-[36rem]">
		<Dialog.Header>
			<Dialog.Title class="text-2xl font-medium">Membuka kembali Ticket</Dialog.Title>
			<Dialog.Description>Mohon untuk menambahkan data dibawah</Dialog.Description>
			<Separator />
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-[12px]">
					<div class="flex gap-1">
						<Label class="text-xl font-medium">Pilih Divisi yang melayani</Label>
						<div class="text-destructive">*</div>
					</div>
					<Combobox
						items={menuList || []}
						placeholder="Pilih Divisi..."
						bind:selectedData={menuCbxData}
					/>
				</div>

				<div class="flex flex-col gap-[12px]">
					<div class="flex gap-1">
						<Label class="text-xl font-medium">Isi Alasan pembukaan ticket dibawah ini</Label>
						<div class="text-destructive">*</div>
					</div>
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
					openDetailDialog = true;
					openRecreateTicketDialog = false;
				}}>Kembali</Button
			>
			<Button
				class="w-[88px] text-base"
				type="submit"
				disabled={!menuCbxData?.value || !cancelReason}
				onclick={async () => {
					await recreateNewAppointment();
				}}
				>Tambah
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
