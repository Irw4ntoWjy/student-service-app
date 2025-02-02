<script lang="ts">
	import MenuCard from '$lib/components/page/menu-card.svelte';
	import type { PageData } from './$types';
	import MenuDialog from '../../../lib/components/page/menu-dialog.svelte';

	let { data }: { data: PageData } = $props();

	let openMenuDialog: boolean = $state(false);
	let openOtherOptionDialog: boolean = $state(false);
</script>

<div class="mt-4 grid grid-cols-4 items-center justify-items-center gap-12 p-6">
	{#each data.loadPage as items}
		<MenuCard
			title={items.name}
			description={items.description}
			src={`uploads/${items.imagePath}`}
			onClick={() => (openMenuDialog = true)}
		/>
	{/each}
</div>

<MenuDialog bind:openMenuDialog bind:openOtherOptionDialog />
