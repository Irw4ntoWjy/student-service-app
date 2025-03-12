<script lang="ts">
	import { Info } from 'lucide-svelte';
	import type { AppointmentTime } from './config.svelte';

	let { appointmentTime, onclick }: { appointmentTime: AppointmentTime; onclick: () => void } =
		$props();

	// get timegap from user start waiting and be served
	const getTotalAppointmentTime = () => {
		if (!appointmentTime) return '-';
		if (!appointmentTime.scannedAt) return '-';

		const createdDate = new Date(appointmentTime.createdAt);
		const cancelDate = appointmentTime.cancelAt ? new Date(appointmentTime.cancelAt) : null;
		const scannedDate = appointmentTime.scannedAt ? new Date(appointmentTime.scannedAt) : null;
		const startDate = appointmentTime.appointmentStartAt
			? new Date(appointmentTime.appointmentStartAt)
			: null;
		const finishedDate = appointmentTime.appointmentFinishedAt
			? new Date(appointmentTime.appointmentFinishedAt)
			: null;

		let totalTimeDiff = 0;

		if (cancelDate && !finishedDate) {
			totalTimeDiff = Math.floor((cancelDate.getTime() - createdDate.getTime()) / 1000);
		} else if (startDate) {
			const effectiveStart = scannedDate || createdDate;
			const timeFromCreationToStart = Math.floor(
				(effectiveStart.getTime() - createdDate.getTime()) / 1000
			);
			totalTimeDiff += timeFromCreationToStart;

			const timeToStart = Math.floor((startDate.getTime() - effectiveStart.getTime()) / 1000);
			totalTimeDiff += timeToStart;

			if (finishedDate) {
				const timeToFinish = Math.floor((finishedDate.getTime() - startDate.getTime()) / 1000);
				totalTimeDiff += timeToFinish;
			}
		} else if (!startDate && !cancelDate) {
			totalTimeDiff = Math.floor((Date.now() - createdDate.getTime()) / 1000);
		}

		// Format the output

		if (totalTimeDiff < 60) {
			return `${totalTimeDiff} Detik`;
		} else if (totalTimeDiff < 3600) {
			return `${Math.floor(totalTimeDiff / 60)} Menit`;
		} else {
			return `${Math.floor(totalTimeDiff / 3600)} Jam`;
		}
	};
</script>

<div class="flex items-center gap-4">
	<span class="font-bold">
		{getTotalAppointmentTime()}
	</span>
	<Info class="size-4 cursor-pointer text-slate-600" {onclick} />
</div>
