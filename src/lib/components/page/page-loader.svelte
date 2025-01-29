<script lang="ts">
	import { onMount } from 'svelte';
	import Progress from '../ui/progress/progress.svelte';
	import src from '$lib/assets/UPH-Blue.svg';

	let progressBarValue: number = $state(0);
	let { isLoading = $bindable() }: { isLoading: boolean } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			if (progressBarValue < 100) {
				progressBarValue += 10;
			} else {
				clearInterval(interval);
				isLoading = true;
			}
		}, 400);

		return () => clearInterval(interval);
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<img {src} alt="uph-blue" class="h-18 w-56" />
</div>

<div class="fixed bottom-0 left-0 right-0">
	<Progress value={progressBarValue} max={100} class="h-2 rounded-none " />
</div>
