<script lang="ts">
	import MenuCard from '$lib/components/page/menu-card.svelte';
	import MenuDialog from '../../../lib/components/page/menu-dialog.svelte';
	import type { PageData } from './$types';
	import type { MenuDialogSchema } from './menu-schema';

	let { data }: { data: PageData } = $props();

	let openMenuDialog: boolean = $state(false);
	let openOtherOptionDialog: boolean = $state(false);

	let menuAction: MenuDialogSchema[] = $state([]);

	const fetchMenuDialog = async (id: number) => {
		const response = await fetch(`./admin/get-menu-action?id=${id}`);
		const data = await response.json();
		menuAction = data;
	};
</script>

<div class="mt-4 grid grid-cols-4 items-center justify-items-center gap-12 p-6">
	{#each data.loadPage as items}
		<MenuCard
			title={items.name}
			description={items.description}
			src={`uploads/${items.imagePath}`}
			onClick={() => {
				fetchMenuDialog(items.id);
				openMenuDialog = true;
			}}
		/>
	{/each}
</div>

<MenuDialog bind:openMenuDialog bind:openOtherOptionDialog bind:menuDialog={menuAction} />
