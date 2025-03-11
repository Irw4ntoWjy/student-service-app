<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ComboboxType } from '$lib/components/ui/combobox';
	import Combobox from '$lib/components/ui/combobox/combobox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { debounce } from '$lib/utils';
	import { CirclePlus, Pencil, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';
	import { staffTable } from './config.svelte';
	import type { StaffList } from './staff-list-schema';

	let { data }: PageProps = $props();

	let tableState = staffTable(page.url.pathname, data.staffList);
	$effect(() => {
		tableState.updateTable = {
			data: data.staffList
		};
	});

	let staffModel: StaffList = $state({
		id: undefined!,
		name: undefined!,
		divisionId: undefined!,
		jobdesc: undefined!,
		status: true
	});
	let selectedDivision: ComboboxType | undefined = $state(undefined);
	let selectedCbxFilter: ComboboxType | undefined = $state(undefined);

	const submitStaffData = async () => {
		if (selectedDivision) {
			const formData = new FormData();
			formData.append('id', String(staffModel.id));
			formData.append('name', String(staffModel.name));
			formData.append('divisionId', String(selectedDivision.value));
			formData.append('jobdesc', String(staffModel.jobdesc));
			formData.append('status', String(staffModel.status));

			const response = await fetch('?/submitStaffData', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();

			if (result.status === 400) {
				toast.error('Gagal menambahkan data staff', {
					class: 'text-base',
					description: 'Mohon periksa kembali data yang anda masukkan!'
				});
			} else {
				toast.success('Berhasil Menambahkan data Staff!', {
					class: 'text-base '
				});
			}

			tableState.openStaffSheet = false;
			await invalidateAll();
		}
	};

	$effect.root(() => {
		const filter = page.url.searchParams.get('filter');
		tableState.filterValue.filter = filter || undefined;

		const selectedDivision = page.url.searchParams.get('selectedDivision');
		tableState.filterValue.selectedDivision = Number(selectedDivision) || undefined;

		console.log(data.menuList);
		if (selectedDivision) {
			const selectedItem = data.menuList.find((val) => {
				return val.value.toString() === selectedDivision;
			});

			selectedCbxFilter = selectedItem;
		}
	});

	$effect(() => {
		if (tableState.staffDetail) {
			staffModel = {
				id: tableState.staffDetail.id,
				name: tableState.staffDetail.name,
				divisionId: tableState.staffDetail.divisionId,
				jobdesc: tableState.staffDetail.jobdesc,
				status: tableState.staffDetail.status
			};

			if (tableState.staffDetail.divisionName && tableState.staffDetail.divisionId) {
				selectedDivision = {
					label: tableState.staffDetail.divisionName,
					value: tableState.staffDetail.divisionId.toString()
				};
			}
		}
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

			<Combobox
				items={data.menuList}
				placeholder="Cari Divisi..."
				bind:selectedData={selectedCbxFilter}
				onchange={() =>
					debounce(() => {
						if (selectedCbxFilter) {
							tableState.filterValue.selectedDivision = Number(selectedCbxFilter.value);
							tableState.onPaginate();
						}
					})}
			/>

			<!-- NOTES Add Divisi Filter -->
			{#if tableState.showReset}
				<Button
					onclick={() => {
						tableState.filterValue.filter = undefined;
						tableState.filterValue.selectedDivision = undefined;
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
		<Button
			variant="outline"
			class="bg-slate-200"
			onclick={() => (tableState.openStaffSheet = true)}
		>
			<CirclePlus />
			Tambah Staff
		</Button>
	</div>

	<DataTable table={tableState.table} />
</div>

<Sheet.Root bind:open={tableState.openStaffSheet}>
	<Sheet.Content class="flex h-full flex-col">
		<Sheet.Header>
			<Sheet.Title>
				{tableState.staffDetail ? 'Ubah Data Staff' : 'Tambah Data Staff'}</Sheet.Title
			>
			<Sheet.Description
				>{tableState.staffDetail
					? 'Isi inputan dibawah untuk mengubah data staff.'
					: 'Isi inputan dibawah untuk menambahkan data staff.'}
			</Sheet.Description>
		</Sheet.Header>

		<Separator class="my-2" />

		<div class="flex flex-grow flex-col gap-4">
			<div class="flex flex-col space-y-2">
				<div class="flex items-center gap-1">
					<Label>Nama Staff</Label>
					<span class="text-destructive">*</span>
				</div>
				<Input bind:value={staffModel.name} placeholder="Isi Nama Staff" />
			</div>
			<div class="flex flex-col space-y-2">
				<div class="flex items-center gap-1">
					<Label>Divisi</Label>
					<span class="text-destructive">*</span>
				</div>
				<Combobox
					items={data.menuList}
					placeholder="Pilih Divisi..."
					bind:selectedData={selectedDivision}
				/>
			</div>
			<div class="flex flex-col space-y-2">
				<div class="flex items-center gap-1">
					<Label>Job Desc</Label>
					<span class="text-destructive">*</span>
				</div>
				<Input bind:value={staffModel.jobdesc} placeholder="Isi jobdesc Staff" />
			</div>
			<div class="flex flex-col space-y-2">
				<div class="flex items-center gap-1">
					<Label>Aktif</Label>
					<span class="text-destructive">*</span>
				</div>
				<Switch bind:checked={staffModel.status} />
			</div>
		</div>

		<Button
			variant="default"
			class="mt-auto"
			onclick={submitStaffData}
			disabled={!selectedDivision || !staffModel.jobdesc || !staffModel.name}
		>
			{#if tableState.staffDetail}
				<Pencil class="mr-2 h-4 w-4" /> Ubah data
			{:else}
				<CirclePlus class="mr-2 h-4 w-4" /> Tambah
			{/if}
		</Button>
	</Sheet.Content>
</Sheet.Root>
