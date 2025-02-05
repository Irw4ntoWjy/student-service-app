<script lang="ts">
	import { page } from '$app/state';

	const appointmentNo = page.params.id;
</script>

<span class="text-lg">{appointmentNo}</span>
