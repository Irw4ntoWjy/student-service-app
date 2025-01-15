<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import MenuCard from './menu-card.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="mt-4 grid grid-cols-4 items-center justify-items-center gap-8">
	{#each data.loadPage as items}
		<MenuCard
			title={items.name}
			description={items.description}
			src={items.imageUrl}
			onClick={() => goto(`${page.url}/student-finance`)}
		/>
	{/each}
</div>
