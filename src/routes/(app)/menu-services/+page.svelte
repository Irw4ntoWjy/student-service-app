<script lang="ts">
	import MenuAction from '$lib/components/page/menu-action.svelte';
	import MenuCard from '$lib/components/page/menu-card.svelte';
	import type { PageProps } from './$types';
	import type { CurrentMenu, MenuActionSchema } from './menu-schema';

	let { data }: PageProps = $props();
	let isMenuActionOpen: boolean = $state(false);
	let isOtherOptionDialogOpen: boolean = $state(false);

	// handle menu action state
	let menuAction: MenuActionSchema[] = $state([]);
	const getMenuAction = async (id: number) => {
		const response = await fetch(`./admin/menu-list/get-menu-action?id=${id}`);
		const data = await response.json();
		menuAction = data;
	};

	let currentMenu: CurrentMenu = $state({
		id: undefined!,
		name: undefined!,
		code: undefined!
	});
</script>

<div class="mt-4 grid grid-cols-4 items-center justify-items-center gap-12 p-6">
	{#each data.menuList as menu}
		<MenuCard
			title={menu.name}
			description={menu.description}
			src={`uploads/${menu.imagePath}`}
			onClick={async () => {
				if (menu.id) {
					currentMenu = {
						id: menu.id,
						code: menu.code,
						name: menu.name
					};

					await getMenuAction(menu.id);
					isMenuActionOpen = true;
				}
			}}
		/>
	{/each}
</div>

<MenuAction
	data={menuAction}
	bind:openMenuAction={isMenuActionOpen}
	bind:openOtherOptionDialog={isOtherOptionDialogOpen}
	{currentMenu}
/>
