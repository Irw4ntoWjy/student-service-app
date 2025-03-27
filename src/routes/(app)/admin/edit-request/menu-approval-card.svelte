<script lang="ts">
	import MenuCard from '$lib/components/page/menu-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { ChangeRequestSchema } from '$lib/server/sql/change-request-query';
	import type { MenuSchema } from '$lib/server/sql/menu-query';
	import { ArrowRight, Check, X } from 'lucide-svelte';

	let {
		item,
		menuList,
		role
	}: { item: ChangeRequestSchema; menuList: MenuSchema[]; role: 'HEAD' | 'SADMIN' | 'ADMIN' } =
		$props();

	let isDialogOpen: boolean = $state(false);
	const requestType: 'EDIT' | 'ADD' = item.changeJson.id ? 'EDIT' : 'ADD';

	const currentMenuData: MenuSchema | undefined = $derived.by(() => {
		return menuList.find((val) => {
			if (item.changeJson.id) {
				return val.id === item.changeJson.id;
			}
		});
	});

	$inspect(currentMenuData);
</script>

{#if currentMenuData && currentMenuData.id}
	<MenuCard
		title={currentMenuData.name}
		description={currentMenuData.description}
		src={`../uploads/${currentMenuData.imagePath}`}
		onClick={() => (isDialogOpen = true)}
	/>
{:else}
	<MenuCard
		title={item.changeJson.name}
		description={item.changeJson.description}
		src={`../uploads/${item.changeJson.imagepath}`}
		onClick={() => (isDialogOpen = true)}
	/>
{/if}

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content class="w-auto max-w-[60vw]">
		<Dialog.Header>
			<Dialog.Title class="text-lg font-medium">
				{requestType === 'EDIT' ? 'Edit' : 'Add'} Menu Request
			</Dialog.Title>
		</Dialog.Header>

		<div class="flex items-center gap-4">
			<div class="flex flex-col gap-2">
				<MenuCard
					badge={{ title: 'Current Data', variant: 'secondary' }}
					title={currentMenuData?.name || ''}
					description={currentMenuData?.description || ''}
					src={`../uploads/${currentMenuData?.imagePath || ''}`}
				/>
			</div>

			{#if item.changeJson.id}
				<ArrowRight />
				<div class="flex flex-col gap-2">
					<MenuCard
						badge={{ title: 'Updated Data', variant: 'amber' }}
						title={item.changeJson.name}
						description={item.changeJson.description}
						src={`../uploads/${item.changeJson.imagePath}`}
					/>
				</div>
			{/if}
		</div>
		{#if role === 'HEAD'}
			<Dialog.Footer>
				<Button
					variant="outline"
					size="sm"
					class="flex items-center border-reject-red bg-reject-red/10 text-destructive hover:bg-reject-red/20 hover:text-destructive"
				>
					<X class="mr-1 h-4 w-4" />
					Reject
				</Button>

				<Button size="sm" class="flex items-center bg-approval-green hover:bg-approval-green/90">
					<Check class="mr-1 h-4 w-4" />
					Approve
				</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>

<!-- <Card.Root>
	<Card.Header> 
		<Card.Title></Card.Title>
		<Card.Description></Card.Description>
	</Card.Header>

	<Card.Content></Card.Content>

	<Card.Footer></Card.Footer>
</Card.Root> -->
