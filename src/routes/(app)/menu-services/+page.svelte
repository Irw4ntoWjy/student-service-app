<script lang="ts">
	import { goto } from '$app/navigation';
	import MenuCard from '$lib/components/page/menu-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mt-4 grid grid-cols-4 items-center justify-items-center gap-12 p-6">
	{#each data.loadPage as items}
		<MenuCard
			title={items.name}
			description={items.description}
			src={`uploads/${items.imagePath}`}
			onClick={() => goto('/')}
		/>
	{/each}
</div>
