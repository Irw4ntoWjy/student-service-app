<script lang="ts">
	import DataTableBadgeCell from '$lib/components/page/data-table/data-table-badge-cell.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { ChangeRequestSchema } from '$lib/server/sql/change-request-query';
	import type { StaffSchema } from '$lib/server/sql/staff-list-query';
	import { cn } from '$lib/utils';
	import { ArrowRight, Check, Eye, EyeClosed, X } from 'lucide-svelte';

	let { item, staffList }: { item: ChangeRequestSchema; staffList: StaffSchema[] } = $props();

	let isEdit: boolean = $derived(!!item.changeJson.id);
	let isExpanded: boolean = $state(false);

	const currentStaffData: StaffSchema | undefined = $derived.by(() => {
		return staffList.find((val) => {
			if (item.changeJson.id) {
				return val.id === item.changeJson.id;
			}
		});
	});
</script>

<Card.Root
	class={cn(
		'w-[425px] animate-fade-in-up overflow-hidden p-6 transition-all duration-500 hover:shadow-md',
		isExpanded ? '' : 'h-[200px]'
	)}
>
	<Card.Header class="pb-2">
		<div class="flex items-center justify-between">
			<Badge
				variant="outline"
				class={cn(
					'change-indicator',
					isEdit ? 'bg-soft-blue text-primary' : 'bg-primary/10 text-primary'
				)}
			>
				{isEdit ? 'Edit Data' : 'New Data'}
			</Badge>
		</div>
		<div class="flex items-center justify-between">
			<div>
				<Card.Title class="mt-2 text-xl font-medium">{item.changeJson.name}</Card.Title>
				<Card.Description class="line-clamp-2">
					{item.menuName || '-'}
				</Card.Description>
			</div>
			<Button
				variant="ghost"
				size="sm"
				onclick={() => (isExpanded = !isExpanded)}
				class="hover:bg-transparent hover:text-primary"
			>
				{#if isExpanded}
					<EyeClosed class=" h-4 w-4" />
				{:else}
					<Eye class="h-4 w-4" />
				{/if}
			</Button>
		</div>
	</Card.Header>

	<Card.Content class="p-0 pb-4">
		{#if isExpanded}
			<div class="animate-fade-in space-y-4">
				{#if isEdit}
					<div class="grid gap-4">
						<div class="rounded-lg border bg-secondary/40 px-6 py-2">
							<div class="flex flex-col gap-2">
								{#if currentStaffData?.name !== item.changeJson.name}
									<div class="flex items-center justify-between">
										<span class="text-sm">Nama</span>
										<div class="flex flex-col gap-2 text-right">
											<span class="text-sm line-through">{currentStaffData?.name}</span>
											<span class="text-sm">{item.changeJson.name}</span>
										</div>
									</div>
									<Separator />
								{/if}

								{#if currentStaffData?.divisionName !== item.menuName}
									<div class="flex items-center justify-between">
										<span class="text-sm">Divisi</span>
										<div class="flex flex-col gap-2 text-right">
											<span class="text-sm line-through">{currentStaffData?.divisionName}</span>
											<span class="text-sm">{item.menuName}</span>
										</div>
									</div>
									<Separator />
								{/if}

								{#if currentStaffData?.jobdesc !== item.changeJson.jobdesc}
									<div class="flex items-center justify-between">
										<span class="text-sm">Job Desc</span>
										<div class="flex flex-col gap-2 text-right">
											<span class="text-sm line-through">{currentStaffData?.jobdesc}</span>
											<span class="text-sm">{item.changeJson.jobdesc}</span>
										</div>
									</div>
									<Separator />
								{/if}

								{#if currentStaffData?.status !== item.changeJson.status}
									<div class="flex items-center justify-between py-2">
										<span class="text-sm">Status</span>
										<div class="flex items-center gap-2 text-right">
											<DataTableBadgeCell
												variant={currentStaffData?.status ? 'green' : 'destructive'}
												value={currentStaffData?.status ? 'Aktif' : 'Tidak Aktif'}
											/>
											<ArrowRight class="size-4" />

											<DataTableBadgeCell
												variant={item.changeJson.status === 'Aktif' ? 'green' : 'destructive'}
												value={item.changeJson.status ? 'Aktif' : 'Tidak Aktif'}
											/>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{:else}
					<div class="rounded-lg border border-primary/20 bg-primary/5 px-6 py-2">
						<div class="flex flex-col gap-2">
							<div class="flex justify-between gap-2 py-2">
								<span class="text-sm">Name</span>
								<span class="text-sm">{item.changeJson.name}</span>
							</div>
							<Separator />
							<div class="flex justify-between gap-2 py-2">
								<span class="text-sm">Divisi</span>
								<span class="text-sm">{item.menuName}</span>
							</div>
							<Separator />
							<div class="flex justify-between gap-2 py-2">
								<span class="text-sm">Job Desc</span>
								<span class="text-sm">{item.changeJson.jobdesc}</span>
							</div>
							<Separator />
							<div class="flex justify-between gap-2 py-2">
								<span class="text-sm">Status</span>
								<DataTableBadgeCell variant="green" value="Aktif" />
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</Card.Content>

	<Separator />
	<Card.Footer class="flex w-full justify-between p-0 pt-4">
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
	</Card.Footer>
</Card.Root>
