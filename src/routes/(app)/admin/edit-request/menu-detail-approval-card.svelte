<script lang="ts">
	import MenuCard from '$lib/components/page/menu-card.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { ChangeRequestSchema } from '$lib/server/sql/change-request-query';
	import { ArrowRight, Check, X } from 'lucide-svelte';
	import type { MenuActionSchema, MenuAndMenuDetailSchema } from '../../menu-services/menu-schema';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { ChangeRequestStatus } from './change-request-schema';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

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
	const requestType: 'EDIT' | 'ADD' = item.changeJson.id ? 'EDIT' : 'ADD';

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

	const changes = $derived.by(() => {
		if (requestType === 'EDIT' && item.changeJson.id) {
			const removedMenu = menuAction.find((menu) => menu.id === item.changeJson.id);
			if (removedMenu) {
				return [
					{
						fieldName: 'Menu Action',
						currentValue: removedMenu.name,
						updatedValue: '-'
					}
				];
			}
		} else if (requestType === 'ADD' && !item.changeJson.id && item.changeJson.name) {
			return [
				{
					fieldName: 'Menu Action',
					currentValue: '-',
					updatedValue: item.changeJson.name
				}
			];
		}
		return [];
	});

	const updateChangeRequest = async (status: ChangeRequestStatus) => {
		const formData = new FormData();

		if (item.id) {
			formData.append('id', item.id.toString());
		}
		formData.append('type', item.type);
		formData.append('status', status);
		formData.append('requestType', requestType);
		formData.append('changeJson', JSON.stringify(item.changeJson));

		const response = await fetch('?/submitChangeRequest', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			toast.success('Berhasil update request ini !');
			await invalidateAll();
		}
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
				{requestType === 'EDIT' ? 'Delete' : 'Add'} Menu Request
			</Dialog.Title>
		</Dialog.Header>

		<div class="flex items-center justify-center gap-4">
			{#if currentMenuData && currentMenuData.id}
				<div class="flex flex-col gap-2 rounded-md bg-orange-100 p-4">
					<div class="flex gap-2">
						{#each menuAction as menu}
							<Button variant="outline" class="relative max-w-full flex-grow px-4 py-2">
								{menu.name}
							</Button>
						{/each}
						{#if !item.changeJson.id}
							<Button variant="outline" class="relative max-w-full flex-grow px-4 py-2">
								{item.changeJson.name}
							</Button>
						{/if}
					</div>
				</div>
			{/if}

			{#if item.changeJson.id}
				<ArrowRight />
			{/if}

			{#if currentMenuData && currentMenuData.id && item.changeJson.id}
				<div class="flex flex-col gap-2 rounded-md bg-orange-100 p-4">
					<div class="flex max-w-md gap-2">
						{#each menuAction.filter((menu) => menu.id !== item.changeJson.id) as menu}
							<Button variant="outline" class="relative max-w-full flex-grow px-4 py-2">
								{menu.name}
							</Button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<div class="flex w-full flex-col gap-1 rounded-md border p-4">
			<span class="font-medium">Changes Summary</span>
			<Separator class="my-2" />
			<div class="w-full overflow-hidden rounded-md border">
				<div class="max-h-[300px] overflow-auto">
					<table class="w-full table-fixed">
						<thead class="bg-muted/50">
							<tr class="text-left">
								<th class="w-1/4 p-3 text-sm font-medium text-muted-foreground">Field</th>
								<th class="w-[37.5%] p-3 text-sm font-medium text-muted-foreground">Current Data</th
								>
								<th class="w-[37.5%] p-3 text-sm font-medium text-muted-foreground">Updated Data</th
								>
							</tr>
						</thead>
						<tbody class="divide-y">
							{#each changes as change}
								{@const hasChanged = change.currentValue !== change.updatedValue}
								<tr class={hasChanged ? 'bg-amber-50' : ''}>
									<td class="p-3 text-sm font-medium">{change.fieldName}</td>
									<td class="break-words p-3 text-sm">
										<div class="max-h-[80px] overflow-auto">{change.currentValue || '-'}</div>
									</td>
									<td
										class={hasChanged
											? 'break-words p-3 text-sm font-medium text-amber-900'
											: 'break-words p-3 text-sm'}
									>
										<div class="max-h-[80px] overflow-auto">{change.updatedValue || '-'}</div>
									</td>
								</tr>
							{/each}
							{#if changes.length === 0}
								<tr>
									<td colspan="3" class="p-3 text-center text-sm text-muted-foreground">
										No changes to display
									</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		{#if role === 'HEAD'}
			<Dialog.Footer>
				<Button
					variant="outline"
					size="sm"
					class="flex items-center border-reject-red bg-reject-red/10 text-destructive hover:bg-reject-red/20 hover:text-destructive"
					onclick={() => updateChangeRequest('REJECTED')}
				>
					<X class="mr-1 h-4 w-4" />
					Reject
				</Button>

				<Button
					size="sm"
					class="flex items-center bg-approval-green hover:bg-approval-green/90"
					onclick={() => updateChangeRequest('ACCEPTED')}
				>
					<Check class="mr-1 h-4 w-4" />
					Approve
				</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
