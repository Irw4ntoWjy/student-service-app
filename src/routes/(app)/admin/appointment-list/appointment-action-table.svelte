<script lang="ts">
	import { Info } from 'lucide-svelte';
	import type { AppointmentTime } from './config.svelte';

	let { appointmentTime, onclick }: { appointmentTime: AppointmentTime; onclick: () => void } =
		$props();

	// get timegap when user start waiting and be served
	let timeDiff: number = $state(0);
	if (appointmentTime.scannedAt && appointmentTime.appointmentStartAt) {
		const scannedDate = new Date(appointmentTime.scannedAt);
		const startDate = new Date(appointmentTime.appointmentStartAt);

		const timeDifferenceMs = startDate.getTime() - scannedDate.getTime();
		timeDiff = timeDifferenceMs / 60000;
	}
</script>

<div class="flex items-center gap-4">
	<span>
		{timeDiff.toFixed(0)} Menit
	</span>
	<Info class="size-4 cursor-pointer" {onclick} />
</div>
