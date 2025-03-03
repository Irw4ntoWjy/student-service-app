<script lang="ts">
	import src from '$lib/assets/UPH-White.png';
	import type { AppointmentSchema } from '$lib/server/sql/appointment-query';
	import { formatDate, formatTime, getDayOfWeek } from '$lib/utils';
	import { Realtime } from 'ably';

	// queue ticket page state
	let currentTime: string = $state('');
	let currentDate: string = $state('');
	let currentDay: string = $state('');

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

	// NOTES creds masih kena expose
	$effect.root(() => {
		const ably = new Realtime({ key: 'gqo0ug.eOzcSw:e6g093vBHe3phpt2f4nBviuRBeSLkTSfQ3RXN2fBpMI' });
		const channel = ably.channels.get('updates');

		channel.subscribe('update', (message) => {
			const updatedAppointment: AppointmentSchema = message.data.data;

			//Add Text to speech logic
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

	<!-- status color indicator -->
	<div class="flex gap-4">
		<div class="flex items-center gap-4">
			<div class="size-8 rounded-full bg-sky-400"></div>
			<div class="text-xl font-bold text-white">Sedang Diproses</div>
		</div>
		<div class="flex items-center gap-4">
			<div class="size-8 rounded-full bg-green-600"></div>
			<div class="text-xl font-bold text-white">Selesai Diproses</div>
		</div>
		<div class="flex items-center gap-4">
			<div class="size-8 rounded-full bg-destructive"></div>
			<div class="text-xl font-bold text-white">Dibatalkan</div>
		</div>
	</div>

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
			<!-- {#each appointmentTicket as activeTicket}
				{#if activeTicket.status === 'active'}
					<QueueTicket
						staffList={data.staffList}
						menuList={data.menuList}
						queueTicket={activeTicket}
					/>
				{/if}
			{/each} -->
		</div>

		<div
			class="flex h-[22rem] w-[30rem] flex-col items-center justify-start gap-2 rounded-lg bg-blue-900 p-8 shadow-lg"
		>
			<span class="-translate-y-3 text-2xl font-medium text-white"
				>Nomor Antrian yang Telah Selesai</span
			>
			<!-- {#each appointmentTicket as finishedAppointment}
				{#if finishedAppointment.status === 'closed' || finishedAppointment.status === 'cancelled'}
					<QueueTicket
						staffList={data.staffList}
						menuList={data.menuList}
						queueTicket={finishedAppointment}
					/>
				{/if}
			{/each} -->
		</div>
	</div>

	<div
		class=" flex max-h-screen w-full flex-col items-center justify-start rounded-lg bg-blue-900 px-6 py-4 shadow-lg"
	>
		<div class="mt-4 h-1/2">
			<span class=" flex justify-center text-2xl font-medium text-white"
				>Nomor Antrian Selanjutnya</span
			>
			<!-- {#each appointmentTicket as pendingTicket}
				{#if pendingTicket.status === 'pending'}
					<QueueTicket
						queueTicket={pendingTicket}
						menuList={data.menuList}
						staffList={data.staffList}
					/>
				{/if}
			{/each} -->
		</div>

		<div class="mt-4 h-1/2">
			<span class=" flex justify-center text-2xl font-medium text-white"
				>Nomor Antrian Yang Belum Terlayani</span
			>
			<!-- {#each appointmentTicket as pendingTicket}
				{#if pendingTicket.status === 'pending'}
					<QueueTicket
						queueTicket={pendingTicket}
						menuList={data.menuList}
						staffList={data.staffList}
					/>
				{/if}
			{/each} -->
		</div>
	</div>
</div>
