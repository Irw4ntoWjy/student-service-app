<script lang="ts">
	import type { PageData } from './$types';
	import QueueTicket from './queue-ticket.svelte';
	import src from '$lib/assets/UPH-White.png';

	let { data }: { data: PageData } = $props();

	let currentTime: string = $state('');
	let currentDate: string = $state('');
	let currentDay: string = $state('');

	function formatTime(date: Date): string {
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	}

	function formatDate(date: Date): string {
		const year = date.getFullYear();
		const months = [
			'Januari',
			'Februari',
			'Maret',
			'April',
			'Mei',
			'Juni',
			'Juli',
			'Agustus',
			'September',
			'Oktober',
			'November',
			'Desember'
		];
		const month = months[date.getMonth()];
		const day = String(date.getDate()).padStart(2, '0');
		return `${day} ${month} ${year}`;
	}

	function getDayOfWeek(date: Date): string {
		const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
		return days[date.getDay()];
	}

	$effect(() => {
		const updateDateTime = () => {
			const now = new Date();
			currentTime = formatTime(now);
			currentDate = formatDate(now);
			currentDay = getDayOfWeek(now);
		};

		updateDateTime();
		const interval = setInterval(updateDateTime, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="mb-8 flex justify-between">
	<img {src} alt="uph-white" class=" mt-4 w-72" />
	<div class="flex flex-col gap-2 text-white shadow-lg">
		<span class="text-right text-6xl">{currentTime}</span>
		<span class="text-4xl">{`${currentDay}, ${currentDate}`}</span>
	</div>
</div>

<div class="flex max-h-screen gap-4">
	<div class="flex flex-col gap-6">
		<div
			class="flex h-[22rem] w-[30rem] flex-col items-center justify-start gap-2 rounded-lg bg-blue-900 p-8 shadow-lg"
		>
			<span class="text-2xl font-medium text-white">Nomor Antrian yang Sedang dilayani</span>
			{#each data.appointmentTicket as appointment}
				{#if appointment.status === 'ON_GOING'}
					<QueueTicket
						icons="HandCoins"
						title={appointment.name}
						ticketNo={appointment.appointmentNo}
						status="active"
						description={appointment.reason}
						id={appointment.id.toString()}
					/>
				{/if}
			{/each}
		</div>

		<div
			class="flex h-[16rem] w-[30rem] flex-col items-center justify-start gap-2 rounded-lg bg-blue-900 p-8 shadow-lg"
		>
			<span class="-translate-y-3 text-2xl font-medium text-white"
				>Nomor Antrian yang Sebelumnya</span
			>
			{#each data.appointmentTicket as appointment}
				{#if appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED'}
					<QueueTicket
						ticketNo={appointment.appointmentNo}
						status="closed"
						icons="HandCoins"
						title={appointment.name}
						id={appointment.id.toString()}
					/>
				{/if}
			{/each}
		</div>
	</div>
	<div
		class="flex max-h-screen w-full flex-col items-center justify-start rounded-lg bg-blue-900 px-6 py-4 shadow-lg"
	>
		<span class="ml-8 text-2xl font-medium text-white">Nomor Antrian Selanjutnya</span>
		<div class="grid grid-cols-3 place-items-center gap-12 p-6">
			{#each data.appointmentTicket as appointment}
				{#if appointment.status === 'DRAFT'}
					<QueueTicket
						icons="HandCoins"
						title={appointment.name}
						ticketNo={appointment.appointmentNo}
						status="pending"
						description={appointment.reason}
						id={appointment.id.toString()}
					/>
				{/if}
			{/each}
		</div>
	</div>
</div>
