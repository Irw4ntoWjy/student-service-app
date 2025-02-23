<script lang="ts">
	import { Info } from 'lucide-svelte';
	import type { AppointmentTime } from './config.svelte';

	let { appointmentTime, onclick }: { appointmentTime: AppointmentTime; onclick: () => void } =
		$props();

	// get timegap from user start waiting and be served
	const getTotalAppointmentTime = () => {
		if (appointmentTime.scannedAt && appointmentTime.appointmentStartAt) {
			const scannedDate = new Date(appointmentTime.scannedAt);
			const startDate = new Date(appointmentTime.appointmentStartAt);

			let totalTimeDiff: number = 0;
			const timeDiff = Math.floor((startDate.getTime() - scannedDate.getTime()) / 1000);
			totalTimeDiff = timeDiff;

			//check if this appoinment has been finished
			if (appointmentTime.appointmentFinishedAt) {
				const finishedTime = new Date(appointmentTime.appointmentFinishedAt);
				const timeDiff = Math.floor((finishedTime.getTime() - startDate.getTime()) / 1000);
				totalTimeDiff += timeDiff;
			}

			if (totalTimeDiff < 60) {
				return `${totalTimeDiff} Detik`;
			} else if (totalTimeDiff < 3600) {
				return `${Math.floor(totalTimeDiff / 60)} Menit`;
			} else {
				return `${Math.floor(totalTimeDiff / 3600)} Jam`;
			}
		}
	};
</script>

<div class="flex items-center gap-4">
	<span class="font-bold">
		{getTotalAppointmentTime()}
	</span>
	<Info class="size-4 cursor-pointer text-slate-600" {onclick} />
</div>
