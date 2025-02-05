<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import src from '$lib/assets/UPH-White.png';
	import type { PageData } from './$types';
	import QueueTicket from './queue-ticket.svelte';
	let { data }: { data: PageData } = $props();
	import { Realtime } from 'ably';

	let currentTime: string = $state('');
	let currentDate: string = $state('');
	let currentDay: string = $state('');

	let appointmentTicket = $derived(data.appointmentTicket);

	// Function to format time
	function formatTime(date: Date): string {
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	}

	// Function to format date
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

	// Function to get the day of the week
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

	$effect.root(() => {
		const ably = new Realtime({ key: 'gqo0ug.eOzcSw:e6g093vBHe3phpt2f4nBviuRBeSLkTSfQ3RXN2fBpMI' });
		const channel = ably.channels.get('updates');

		channel.subscribe('update', (message) => {
			console.log('Received update via Ably:', message.data);
			invalidateAll();
		});

		ably.connection.on('connected', () => {
			console.log('Connected to Ably');
		});

		// Unsubscribe when the component is destroyed
		return () => {
			channel.unsubscribe();
			ably.close();
		};
	});
</script>

<div class="mb-8 flex justify-between">
	<img {src} alt="uph-white" class="mt-4 w-72" />
	<div class="flex flex-col gap-2 text-white shadow-lg">
		<span class="text-right text-6xl">{currentTime}</span>
		<span class="text-4xl">{`${currentDay}, ${currentDate}`}</span>
	</div>
</div>

<div class="flex max-h-screen gap-4">
	<div class="flex flex-col gap-6">
		<div
			class="flex h-[25rem] w-[30rem] flex-col items-center justify-start gap-8 rounded-lg bg-blue-900 p-8 shadow-lg"
		>
			<span class="text-2xl font-medium text-white">Nomor Antrian yang Sedang dilayani</span>
			{#each appointmentTicket as activeTicket}
				{#if activeTicket.status === 'active'}
					<QueueTicket icons="HandCoins" queueTicket={activeTicket} />
				{/if}
			{/each}
		</div>

		<div
			class="flex h-[22rem] w-[30rem] flex-col items-center justify-start gap-2 rounded-lg bg-blue-900 p-8 shadow-lg"
		>
			<span class="-translate-y-3 text-2xl font-medium text-white"
				>Nomor Antrian yang Sebelumnya</span
			>
			<div class="flex w-full flex-col items-center gap-3 overflow-y-auto">
				{#each appointmentTicket as finishedAppointment}
					{#if finishedAppointment.status === 'closed' || finishedAppointment.status === 'cancelled'}
						<QueueTicket icons="HandCoins" queueTicket={finishedAppointment} />
					{/if}
				{/each}
			</div>
		</div>
	</div>
	<div
		class=" flex max-h-screen w-full flex-col items-center justify-start rounded-lg bg-blue-900 px-6 py-4 shadow-lg"
	>
		<div class="mt-4 h-1/2">
			<span class=" flex justify-center text-2xl font-medium text-white"
				>Nomor Antrian Selanjutnya</span
			>
			<div class="mt-8 grid grid-cols-4 place-items-center gap-8">
				{#each appointmentTicket as pendingTicket}
					{#if pendingTicket.status === 'pending'}
						<QueueTicket queueTicket={pendingTicket} icons="HandCoins" />
					{/if}
				{/each}
			</div>
		</div>
		<div class="mt-8 h-1/2">
			<span class="flex justify-center text-2xl font-medium text-white"
				>Nomor Antrian Yang Belum Dilayani</span
			>
			<div class="mt-6 grid grid-cols-4 place-items-center gap-8">
				{#each appointmentTicket as waitingTicket}
					{#if waitingTicket.status === 'waiting'}
						<QueueTicket queueTicket={waitingTicket} icons="HandCoins" />
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
