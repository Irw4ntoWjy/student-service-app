<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { debounce } from '$lib/utils';
	import { CirclePlus, X } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { createStaffTable } from './config.svelte';

	let { data }: PageProps = $props();
	const staffTableState = createStaffTable(page.url.pathname, data.staffList);
	$effect(() => {
		staffTableState.updateTable = {
			data: data.staffList
		};
	});
</script>

<Input
	class="w-fit"
	placeholder="Cari menu"
	oninput={() => debounce(() => staffTableState.onPaginate())}
	bind:value={staffTableState.filterValues.filter}
/>

{#if staffTableState.showReset}
	<Button
		onclick={() => {
			staffTableState.filterValues.filter = '';
			debounce(() => staffTableState.onPaginate());
		}}
		variant="ghost"
		class="h-8 px-2 lg:px-3"
	>
		Reset Filter
		<X class="ml-2 h-4 w-4" />
	</Button>
{/if}

<Sheet.Root>
	<Sheet.Trigger
		><Button class="h-10 items-center border md:w-auto" variant="ghost" onclick={() => {}}>
			<CirclePlus class="mr-2 h-4 w-4" /> Tambah
		</Button>
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Are you sure absolutely sure?</Sheet.Title>
			<Sheet.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</Sheet.Description>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
