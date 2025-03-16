<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import src from '$lib/assets/UPH-White.png';
	import type { AppointmentSchema } from '$lib/server/sql/appointment-query';
	import type { MenuSchema } from '$lib/server/sql/menu-query';
	import { formatDate, formatTime, getDayOfWeek } from '$lib/utils';
	import { Realtime } from 'ably';
	import type { PageProps } from './$types';
	import type { AppointmentWithDetail } from './queue-ticket-schema';
	import QueueTicket2 from './queue-ticket.svelte';

	let { data }: PageProps = $props();

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

	let spokenTexts: string[] = $state([]);

	const speakText = async (text: string) => {
		if (spokenTexts.includes(text)) return;
		spokenTexts = [...spokenTexts, text];

		const utterance1 = new SpeechSynthesisUtterance(text);
		utterance1.pitch = 2;
		utterance1.rate = 0.3;

		const shortText = text.replace('New Queue Number', 'Queue Number');
		const utterance2 = new SpeechSynthesisUtterance(shortText);
		utterance2.pitch = 2;
		utterance2.rate = 0.3;

		utterance1.onend = () => {
			window.speechSynthesis.speak(utterance2);
		};
		window.speechSynthesis.speak(utterance1);
	};

	// NOTES creds masih kena expose
	$effect.root(() => {
		const ably = new Realtime({ key: 'gqo0ug.eOzcSw:e6g093vBHe3phpt2f4nBviuRBeSLkTSfQ3RXN2fBpMI' });
		const channel = ably.channels.get('updates');

		channel.subscribe('update', async (message) => {
			const updatedAppointment: AppointmentSchema = message.data.data;

			const response: MenuSchema = await fetch(
				`${page.url.pathname}/get-menu-by-id?id=${updatedAppointment.menuId}`
			).then(async (response) => await response.json());

			const regex = /(\d{3})$/;
			const match = updatedAppointment.appointmentNo.match(regex);
			const queueNo = match ? match[1] : updatedAppointment.appointmentNo;

			await speakText(
				`New Queue Number, ${queueNo}, ${queueNo} for ${response.name}, ${response.name}`
			);
			await invalidateAll();
		});

		// Unsubscribe when the component is destroyed
		return () => {
			channel.unsubscribe();
			ably.close();
		};
	});

	const scannedAppointment: AppointmentWithDetail[] = $derived(
		data.todayTicket.filter((val) => val.statusType === 'SCANNED')
	);
	const pendingAppointment: AppointmentWithDetail[] = $derived(
		data.todayTicket.filter((val) => val.statusType === 'PENDING')
	);
	const ongoingAppointment: AppointmentWithDetail[] = $derived(
		data.todayTicket.filter((val) => val.statusType === 'ONGOING')
	);
	const finishedAppoinment: AppointmentWithDetail[] = $derived(
		data.todayTicket.filter(
			(val) => val.statusType === 'COMPLETED' || val.statusType === 'CANCELLED'
		)
	);
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

<div class="flex gap-4">
	<div class="flex max-h-screen gap-4">
		<div class="flex flex-col gap-6">
			<div
				class="flex h-[25rem] w-[30rem] flex-col items-center justify-start gap-8 rounded-lg bg-blue-900 p-8 shadow-lg"
			>
				<span class="text-2xl font-medium text-white">Nomor Antrian yang Sedang dilayani</span>
				{#each ongoingAppointment as ticket}
					<QueueTicket2 data={ticket} staffList={data.staffList} menuList={data.menuList} />
				{/each}
			</div>
			<div
				class="flex h-[25rem] w-[30rem] flex-col items-center justify-start gap-2 overflow-y-auto rounded-lg bg-blue-900 p-8 shadow-lg"
			>
				<span
					class="flex h-20 w-full -translate-y-5 items-center bg-blue-900 py-2 text-2xl font-medium text-white"
					>Nomor Antrian yang Telah Selesai</span
				>
				{#each finishedAppoinment as ticket}
					<QueueTicket2 data={ticket} />
				{/each}
			</div>
		</div>
	</div>

	<div class="flex max-h-screen w-full gap-4">
		<div class="flex w-full flex-col gap-6">
			<div
				class="flex h-[25rem] w-[95rem] flex-col items-center justify-start gap-2 overflow-x-auto rounded-lg bg-blue-900 p-8 shadow-lg"
			>
				<span class="text-2xl font-medium text-white">Nomor Antrian Selanjutnya</span>
				<div class="flex w-full justify-start gap-8">
					{#each scannedAppointment as tickcet}
						<QueueTicket2 data={tickcet} />
					{/each}
				</div>
			</div>

			<div
				class="flex h-[25rem] w-[95rem] flex-col items-center justify-start gap-2 overflow-x-auto rounded-lg bg-blue-900 p-8 shadow-lg"
			>
				<span class="-translate-y-3 text-2xl font-medium text-white"
					>Nomor Antrian Yang Belum Terlayani</span
				>
				<div class="flex w-full justify-start gap-8">
					{#each pendingAppointment as ticket}
						<QueueTicket2 data={ticket} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
