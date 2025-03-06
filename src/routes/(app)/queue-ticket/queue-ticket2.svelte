<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { StatusType } from '$lib/server/sql/appointment-query';
	import { Check, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { AppointmentWithDetail } from './queue-ticket-schema';

	let { data }: { data: AppointmentWithDetail } = $props();

	const cardColor = {
		CREATED: '',
		SCANNED: 'bg-slate-50',
		PENDING: 'bg-slate-50',
		ONGOING: 'bg-sky-400 text-gray-50',
		COMPLETED: 'bg-green-600 text-gray-50',
		CANCELLED: 'bg-destructive text-gray-50 border-none'
	};

	const userType = {
		STUDENT: 'Mahasiswa',
		EXTERNAL: 'Umum'
	};

	const updateAppointmentStatus = async (id: number, status: StatusType) => {
		const formData = new FormData();
		formData.append('id', String(id));
		formData.append('status', status);

		const response = await fetch('?/updateAppointmentStatus', {
			method: 'POST',
			body: formData
		});

		console.log(response);

		if (response.status === 200) {
			toast.success('Berhasil Mengubah Status Tiket', {
				class: 'text-lg '
			});
			await invalidateAll();
		} else if (response.status === 400) {
			const errorData = await response.json();

			toast.error(errorData.message || 'Gagal Mengubah Status Tiket', {
				class: 'text-lg'
			});
		}
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
			updateAppointmentStatus(data.id, 'COMPLETED');
		}
	};
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Card.Root
			class="{data.statusType === 'CANCELLED'
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
							: 'text-green-500'}">{currentWaitingTime.waitingTime}</span
					>
				{/if}
			</Card.Content>
		</Card.Root>
	</Dialog.Trigger>
	<Dialog.Content>
		<div class="flex flex-col items-center gap-2">
			<span class="text-4xl font-bold">{data.appointmentNo}</span>
			<Separator class="h-0.5" />
			<span class="text-3xl"
				>Tipe Tamu:
				<span class="font-semibold">
					{userType[data.userType]}
				</span>
			</span>

			<span class="text-3xl"
				>Nama Tamu:
				<span class="font-semibold">
					{data.userName}
				</span>
			</span>

			{#if data.userType === 'STUDENT'}
				<span class="text-3xl"
					>NIM Mahsiswa:
					<span class="font-semibold">
						{data.userNim}
					</span>
				</span>
			{/if}

			<span class="text-3xl"
				>Alasan Appointment:
				<span class="font-semibold">
					{data.reason}
				</span>
			</span>
		</div>

		<div class="flex justify-end gap-4">
			{#if data.statusType !== 'CANCELLED' && data.statusType !== 'COMPLETED'}
				<Button variant="ghost" class="h-12 w-14 bg-destructive p-2 hover:bg-destructive">
					<X class="size-8 text-white" />
				</Button>

				<Button
					variant="ghost"
					class=" h-12 w-14 bg-green p-2 hover:bg-green"
					onclick={handleUpdateAppointment}
				>
					<Check class="size-8 text-white" />
				</Button>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
