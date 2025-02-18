<script lang="ts" generics="T">
	import { browser } from '$app/environment';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DataTable from '$lib/components/ui/table';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { Table } from '../tanstack-table';
	import FlexRender from '../tanstack-table/flex-render.svelte';

	let {
		table,
		tableHeader,
		tableRow,
		class: className,
		toggleSorting,
		columnGroup
	}: {
		//eslint-disable-next-line no-undef
		table: Table<T>;
		//eslint-disable-next-line no-undef
		tableHeader?: Snippet<[Table<T>]>;
		//eslint-disable-next-line no-undef
		tableRow?: Snippet<[Table<T>]>;
		class?: HTMLTableAttributes['class'];
		toggleSorting: (id: string) => void;
		columnGroup?: Snippet;
	} = $props();
</script>

{#snippet defaultTableHeader()}
	{#each table.getHeaderGroups() as headerGroup}
		<DataTable.Row>
			{#each headerGroup.headers as header}
				{@const isPinned = header.column.getIsPinned()
					? `sticky ${header.column.getIsPinned()}-0`
					: ''}
				<DataTable.Head
					class={cn(isPinned, 'overflow-hidden')}
					style="width: {header.column.getSize()}px;"
				>
					{#if !header.isPlaceholder}
						{#if header.column.getCanSort()}
							<Button
								variant="ghost"
								class="my-2 -ml-4 h-full justify-start font-semibold capitalize data-[state=open]:bg-accent w-[{header.column.getSize()}px] text-wrap text-left"
								onclick={() => {
									toggleSorting(header.column.id);
								}}
							>
								<FlexRender context={header.getContext()} content={header.column.columnDef.header}
								></FlexRender>
							</Button>
						{:else}
							<FlexRender context={header.getContext()} content={header.column.columnDef.header}
							></FlexRender>
						{/if}
					{:else}
						""
					{/if}
				</DataTable.Head>
			{/each}
		</DataTable.Row>
	{/each}
{/snippet}

{#snippet defaultTableRow()}
	{#each table.getRowModel().rows as row}
		<DataTable.Row>
			{#each row.getVisibleCells() as cell}
				{@const isPinned = cell.column.getIsPinned()
					? `sticky bg-background ${cell.column.getIsPinned()}-0`
					: ''}
				<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
				<DataTable.Cell
					class={cn('break-words', 'font-light', isPinned)}
					style="width: {cell.column.getSize()}px;"
				>
					<FlexRender context={cell.getContext()} content={cell.column.columnDef.cell} />
				</DataTable.Cell>
			{/each}
		</DataTable.Row>
	{/each}
{/snippet}

<div class="rounded-md" id="table-container">
	<DataTable.Root class={cn(className)}>
		{#if columnGroup && browser}
			{@render columnGroup()}
		{/if}
		<DataTable.Header>
			{#if tableHeader && browser}
				{@render tableHeader(table)}
			{:else}
				{@render defaultTableHeader()}
			{/if}
		</DataTable.Header>
		<DataTable.Body>
			{#if tableRow && browser}
				{@render tableRow(table)}
			{:else}
				{@render defaultTableRow()}
			{/if}
		</DataTable.Body>
	</DataTable.Root>
</div>
