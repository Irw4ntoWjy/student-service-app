<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { CirclePlus, Pencil, X } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { staffTable } from './config.svelte';
	import { page } from '$app/state';
	import { debounce } from '$lib/utils';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { StaffList } from './staff-list-schema';
	import Switch from '$lib/components/ui/switch/switch.svelte';

	let { data }: PageProps = $props();

	let tableState = staffTable(page.url.pathname, data.staffList);
	$effect(() => {
		tableState.updateTable = {
			data: data.staffList
		};
	});

	let openSheet: boolean = $state(false);
	const selectedData = $derived(page.url.searchParams.get('selectedData'));

	const staffModel: StaffList = $state({
		name: undefined!,
		divisionId: undefined!,
		jobdesc: undefined!,
		status: true
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-between">
		<div class="flex items-center gap-4">
			<Input
				class="w-auto"
				bind:value={tableState.filterValue.filter}
				oninput={() => debounce(() => tableState.onPaginate())}
				placeholder="Cari Staff..."
			/>

			<!-- NOTES Add Divisi Filter -->
			{#if tableState.showReset}
				<Button
					onclick={() => {
						tableState.filterValue.filter = undefined;
						debounce(() => tableState.onPaginate());
					}}
					variant="ghost"
					class="h-8 px-2 lg:px-3"
				>
					Reset Filter
					<X class="ml-2 h-4 w-4" />
				</Button>
			{/if}
		</div>
		<Button variant="outline" class="bg-slate-200">
			<CirclePlus />
			Tambah Staff
		</Button>
	</div>

	<DataTable table={tableState.table} />
</div>

<Sheet.Root bind:open={openSheet}>
	<Sheet.Content class="flex h-full flex-col">
		<Sheet.Header>
			<Sheet.Title>
				{selectedData ? 'Ubah Data Staff' : 'Tambah Data Staff'}</Sheet.Title
			>
			<Sheet.Description
				>{selectedData
					? 'Isi inputan dibawah untuk mengubah data staff.'
					: 'Isi inputan dibawah untuk menambahkan data staff.'}
			</Sheet.Description>
		</Sheet.Header>

		<Separator class="my-2" />

		<div class="flex flex-grow flex-col gap-4">
			<div class="flex flex-col space-y-2">
				<Label>Nama Staff</Label>
				<Input bind:value={staffModel.name} placeholder="Isi Nama Staff" />
			</div>
			<div class="flex flex-col space-y-2">
				<Label>Divisi</Label>
				<Input bind:value={staffModel.divisionId} placeholder="Isi Divisi Staff" />
			</div>
			<div class="flex flex-col space-y-2">
				<Label>Job Desc</Label>
				<Input bind:value={staffModel.jobdesc} placeholder="Isi jobdesc Staff" />
			</div>
			<div class="flex flex-col space-y-2">
				<Label>Aktif</Label>
				<Switch bind:checked={staffModel.status} />
			</div>
		</div>

		<Button
			variant="default"
			class="mt-auto"
			onclick={() => {
				if (selectedData) {
					// updateStaffList();
				} else {
					// createStaffList();
				}
			}}
		>
			{#if selectedData}
				<Pencil class="mr-2 h-4 w-4" /> Ubah data
			{:else}
				<CirclePlus class="mr-2 h-4 w-4" /> Tambah
			{/if}
		</Button>
	</Sheet.Content>
</Sheet.Root>
