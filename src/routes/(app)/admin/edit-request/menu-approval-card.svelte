<script lang="ts">
	import MenuCard from '$lib/components/page/menu-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { ChangeRequestSchema } from '$lib/server/sql/change-request-query';
	import type { MenuSchema } from '$lib/server/sql/menu-query';
	import { ArrowRight, Check, X } from 'lucide-svelte';
	import type { ChangeRequestStatus } from './change-request-schema';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

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

	const changes = $derived.by(() => {
		const allChanges = [
			{
				fieldName: 'Nama Menu',
				currentValue: currentMenuData?.name || '',
				updatedValue: item.changeJson.name
			},
			{
				fieldName: 'Kode Menu',
				currentValue: currentMenuData?.code || '',
				updatedValue: item.changeJson.code
			},
			{
				fieldName: 'Image Path',
				currentValue: currentMenuData?.imagePath || '',
				updatedValue: item.changeJson.imagePath
			},
			{
				fieldName: 'Description',
				currentValue: currentMenuData?.description || '',
				updatedValue: item.changeJson.description
			},
			{
				fieldName: 'Status',
				currentValue: currentMenuData?.status,
				updatedValue: item.changeJson.status
			}
		];

		return allChanges.filter((change) => change.currentValue !== change.updatedValue);
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
		onClick={() => (isDialogOpen = true)}
	/>
{:else}
	<MenuCard
		title={item.changeJson.name}
		description={item.changeJson.description}
		src={`../uploads/${item.changeJson.imagePath}`}
		onClick={() => (isDialogOpen = true)}
	/>
{/if}

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content class="max-h-[80vh] max-w-fit overflow-y-auto p-6">
		<Dialog.Header>
			<Dialog.Title class="text-lg font-medium">
				{requestType === 'EDIT' ? 'Edit' : 'Add'} Menu Request
			</Dialog.Title>
		</Dialog.Header>

		<div class="flex items-center justify-center gap-4">
			{#if currentMenuData && currentMenuData.id}
				<div class="flex flex-col gap-2">
					<MenuCard
						badge={{ title: 'Current Data', variant: 'secondary' }}
						title={currentMenuData?.name || ''}
						description={currentMenuData?.description || ''}
						src={`../uploads/${currentMenuData?.imagePath || ''}`}
					/>
				</div>
			{/if}

			{#if item.changeJson.id}
				<ArrowRight />
			{/if}

			{#if item.changeJson}
				<div class="flex flex-col gap-2">
					<MenuCard
						badge={{
							title: `${item.changeJson.id ? 'Updated Data' : 'New Data'}`,
							variant: `${item.changeJson.id ? 'amber' : 'emerald'}`
						}}
						title={item.changeJson.name}
						description={item.changeJson.description}
						src={`../uploads/${item.changeJson.imagePath}`}
					/>
				</div>
			{/if}
		</div>

		<div class="flex w-full flex-col gap-1 rounded-md border p-4">
			<span class=" font-medium">Changes Summary</span>
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
