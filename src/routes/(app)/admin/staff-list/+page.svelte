<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { debounce } from '$lib/utils';
	import { CirclePlus, Pencil, X } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { createStaffTable } from './config.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { StaffList } from './staff-list-schema';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';

	let { data }: PageProps = $props();
	const staffTableState = createStaffTable(page.url.pathname, data.staffList);
	$effect(() => {
		staffTableState.updateTable = {
			data: data.staffList
		};
	});

	let staffData: StaffList = $state({
		name: '',
		division: '',
		jobDesc: '',
		status: true
	});

	const createStaffList = async () => {
		const formData = new FormData();
		formData.append('name', staffData.name);
		formData.append('division', staffData.division);
		formData.append('jobDesc', staffData.jobDesc);

		const response = await fetch(`?/insertStaffList`, {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			toast.success('Berhasil Menambahkan data staff Baru');
			staffTableState.openStaffSheet = false;
			await invalidateAll();
		} else {
			toast.error('Gagal untuk Menambahkan data staff Baru');
		}
	};

	const updateStaffList = async (id: number) => {
		const formData = new FormData();
		formData.append('id', String(id));
		formData.append('name', staffData.name);
		formData.append('division', staffData.division);
		formData.append('jobDesc', staffData.jobDesc);
		formData.append('status', String(staffData.status));

		const response = await fetch(`?/updateStaffList`, {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			toast.success('Berhasil Mengubah data staff');
			staffTableState.openStaffSheet = false;
			await invalidateAll();
		} else {
			toast.error('Gagal untuk Mengubah data staff');
		}
	};

	const isDisabled = $derived(
		Object.entries(staffData).some(([key, value]) => key !== 'status' && value === '')
	);

	$effect(() => {
		if (staffTableState.openStaffSheet && staffTableState.staffDetail.length > 0) {
			staffData.name = staffTableState.staffDetail[0].name;
			staffData.division = staffTableState.staffDetail[0].division;
			staffData.jobDesc = staffTableState.staffDetail[0].jobDesc;
			staffData.status = staffTableState.staffDetail[0].status;
		}
	});

	$effect.root(() => {
		const filter = page.url.searchParams.get('filter') || undefined;
		staffTableState.filterValues.filter = filter || '';
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-between">
		<div class="flex items-center gap-4">
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
		</div>

		<Sheet.Root bind:open={staffTableState.openStaffSheet}>
			<Sheet.Trigger>
				<Button
					class="h-10 items-center border md:w-auto"
					variant="ghost"
					onclick={() => (staffTableState.openStaffSheet = true)}
				>
					<CirclePlus class="mr-2 h-4 w-4" /> Tambah
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="flex h-full flex-col">
				<Sheet.Header>
					<Sheet.Title
						>{staffTableState.staffDetail.length > 0
							? 'Ubah Data Staff'
							: 'Tambah Data Staff'}</Sheet.Title
					>
					<Sheet.Description
						>{staffTableState.staffDetail.length > 0
							? 'Isi inputan dibawah untuk mengubah data staff.'
							: 'Isi inputan dibawah untuk menambahkan data staff.'}
					</Sheet.Description>
				</Sheet.Header>

				<Separator class="my-2" />

				<div class="flex flex-grow flex-col gap-4">
					<div class="flex flex-col space-y-2">
						<Label>Nama Staff</Label>
						<Input bind:value={staffData.name} placeholder="Isi Nama Staff" />
					</div>
					<div class="flex flex-col space-y-2">
						<Label>Divisi</Label>
						<Input bind:value={staffData.division} placeholder="Isi Divisi Staff" />
					</div>
					<div class="flex flex-col space-y-2">
						<Label>Job Desc</Label>
						<Input bind:value={staffData.jobDesc} placeholder="Isi jobdesc Staff" />
					</div>
					<div class="flex flex-col space-y-2">
						<Label>Aktif</Label>
						<Switch bind:checked={staffData.status} />
					</div>
				</div>

				<Button
					variant="default"
					class="mt-auto"
					disabled={isDisabled}
					onclick={() => {
						if (staffTableState.staffDetail.length > 0) {
							updateStaffList(staffTableState.currentSelectedStaff);
						} else {
							createStaffList();
						}
					}}
				>
					{#if staffTableState.staffDetail.length > 0}
						<Pencil class="mr-2 h-4 w-4" /> Ubah data
					{:else}
						<CirclePlus class="mr-2 h-4 w-4" /> Tambah
					{/if}
				</Button>
			</Sheet.Content>
		</Sheet.Root>
	</div>
	<DataTable table={staffTableState.table} toggleSorting={staffTableState.toggleSorting} />
</div>
