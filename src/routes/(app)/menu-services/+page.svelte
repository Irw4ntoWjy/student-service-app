<script lang="ts">
	import { page } from '$app/state';
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
		const response = await fetch(`${page.url.pathname}/get-menu-action?id=${id}`);
		const data = await response.json();
		menuAction = data;
	};

	let currentMenu: CurrentMenu = $state({
		id: undefined!,
		name: undefined!,
		code: undefined!
	});
</script>

<div
	class="mt-4 grid items-center justify-items-center gap-12 p-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
>
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
