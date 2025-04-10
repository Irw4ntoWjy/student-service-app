<script lang="ts">
	import MenuCard from '$lib/components/page/menu-card.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { ChangeRequestSchema } from '$lib/server/sql/change-request-query';
	import { ArrowRight, Check, X } from 'lucide-svelte';
	import type { MenuActionSchema, MenuAndMenuDetailSchema } from '../../menu-services/menu-schema';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	let {
		item,
		menuDetail,
		role
	}: {
		item: ChangeRequestSchema;
		menuDetail: MenuAndMenuDetailSchema[];
		role: 'HEAD' | 'SADMIN' | 'ADMIN';
	} = $props();

	let isDialogOpen: boolean = $state(false);
	const requestType: 'DELETE' | 'ADD' = item.changeJson.id ? 'DELETE' : 'ADD';

	const currentMenuData: MenuAndMenuDetailSchema | undefined = $derived.by(() => {
		return menuDetail.find((val) => {
			if (item.changeJson.menuId) {
				return val.id === item.changeJson.menuId;
			}
		});
	});

	let menuAction: MenuActionSchema[] = $state([]);
	const getMenuAction = async (id: number) => {
		const response = await fetch(`${page.url.origin}/menu-services/get-menu-action?id=${id}`);
		const data = await response.json();
		menuAction = data;
	};
</script>

{#if currentMenuData && currentMenuData.id}
	<MenuCard
		title={currentMenuData.name}
		description={currentMenuData.description}
		src={`../uploads/${currentMenuData.imagePath}`}
		onClick={async () => {
			await getMenuAction(item.changeJson.menuId);
			isDialogOpen = true;
		}}
	/>
{/if}

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content class="max-h-[80vh] max-w-fit overflow-y-auto p-6">
		<Dialog.Header>
			<Dialog.Title class="text-lg font-medium">
				{requestType === 'DELETE' ? 'Delete' : 'Add'} Menu Request
			</Dialog.Title>
		</Dialog.Header>

		<div class="flex items-center justify-center gap-4">
			{#if currentMenuData && currentMenuData.id}
				<div class="flex flex-col gap-2">
					<div class="flex max-w-md gap-2">
						{#each menuAction as menu}
							<Button class="relative max-w-full flex-grow bg-primary px-4 py-2">
								{menu.name}
							</Button>
						{/each}
					</div>
				</div>
			{/if}

			{#if item.changeJson.id}
				<ArrowRight />
			{/if}

			{#if item.changeJson}
				<div class="flex flex-col gap-2">
					{#each menuAction as menu}
						<Button class="relative max-w-full flex-grow bg-primary px-4 py-2">
							{menu.name}
						</Button>
					{/each}
				</div>
			{/if}
		</div>

		<div class="flex w-full flex-col gap-1 rounded-md border p-4">
			<span class=" font-medium">Changes Summary</span>
			<Separator class="my-2" />
			<div class="w-full overflow-hidden rounded-md border">
				<div class="max-h-[300px] overflow-auto"></div>
			</div>
		</div>

		{#if role === 'HEAD'}
			<Dialog.Footer>
				<Button
					variant="outline"
					size="sm"
					class="flex items-center border-reject-red bg-reject-red/10 text-destructive hover:bg-reject-red/20 hover:text-destructive"
					onclick={() => {}}
				>
					<X class="mr-1 h-4 w-4" />
					Reject
				</Button>

				<Button
					size="sm"
					class="flex items-center bg-approval-green hover:bg-approval-green/90"
					onclick={() => {}}
				>
					<Check class="mr-1 h-4 w-4" />
					Approve
				</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
