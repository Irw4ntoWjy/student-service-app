<script lang="ts">
	import type { AppointmentWithDetail } from './queue-ticket-schema';

	import * as Card from '$lib/components/ui/card';

	let { data }: { data: AppointmentWithDetail } = $props();

	const cardColor = {
		SCANNED: 'bg-slate-100',
		PENDING: 'bg-slate-100',
		ONGOING: 'bg-sky-400 text-gray-50',
		COMPLETED: 'bg-green-600 text-gray-50',
		CANCELLED: 'bg-destructive text-gray-50'
	};

	let currentTime = $state(new Date());
	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	const currentWaitingTime = $derived.by(() => {
		const scannedAt = new Date(data.scannedAt);

		const diffMs = currentTime.getTime() - scannedAt.getTime();

		const totalSeconds = Math.floor(diffMs / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	});
</script>

<Card.Root class="h-[16rem] w-[22rem] cursor-pointer rounded-lg ">
	<Card.Content class="flex h-full items-center justify-center p-4">
		<span class="text-4xl font-bold">{data.appointmentNo}</span>
		<span>{currentWaitingTime}</span>
	</Card.Content>
</Card.Root>
