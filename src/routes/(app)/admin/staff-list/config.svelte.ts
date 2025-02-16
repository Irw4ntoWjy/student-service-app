import { goto } from '$app/navigation';
import {
	createTable,
	getCoreRowModel,
	getPaginationRowModel,
	renderComponent
} from '$lib/components/page/tanstack-table';
import { dateTimeFormatString } from '$lib/utils';
import type { ColumnDef, ColumnSort, Table } from '@tanstack/table-core';
import type { StaffList } from './staff-list-schema';
import DataTableBadgeCell from '$lib/components/page/data-table/data-table-badge-cell.svelte';
import DataTableActionColumn from '$lib/components/page/data-table/data-table-action-column.svelte';
import { page } from '$app/state';

export type StaffFilterValue = {
	filter: string;
};

export function createStaffTable(pageUrl: string, data: StaffList[]) {
	let results = $state(data);
	const currentUrl = $state(pageUrl);

	let filterValues: StaffFilterValue = $state({
		filter: ''
	});

	const sort: ColumnSort = $state({
		id: 'name',
		desc: false
	});

	const fullUrl = $derived.by(() => {
		let pageUrl = currentUrl;
		let isFirstParam = !pageUrl.includes('?');

		for (const key in filterValues) {
			const value = filterValues[key as keyof typeof filterValues];

			if (Array.isArray(value) ? value.length > 0 : value) {
				pageUrl += `${isFirstParam ? '?' : '&'}${key}=${value}`;
				isFirstParam = false;
			}
		}

		return pageUrl;
	});

	const onPaginate = async () => {
		await goto(`${fullUrl}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	};

	const toggleSorting = (id: string) => {
		if (sort.id === id) {
			sort.desc = !sort.desc;
		} else {
			sort.id = id;
			sort.desc = false;
		}
		onPaginate();
	};

	const showReset = $derived.by(() => {
		return Object.values(filterValues).some((value) => {
			return Array.isArray(value) ? value.length > 0 : value && value !== '';
		});
	});

	let openStaffSheet: boolean = $state(false);
	let staffDetail: StaffList[] = $state([]);
	let currentSelectedStaff: number = $state(0);
	const fetchStaff = async (id: number) => {
		const res = await fetch(`${page.url}/get-staff-detail?id=${id}`);
		const data = await res.json();
		staffDetail = data;

		openStaffSheet = true;
	};

	const columns: ColumnDef<StaffList>[] = [
		{
			id: 'name',
			accessorFn: (row) => row.name,
			header: () => 'Nama Staff',
			size: 150
		},
		{
			id: 'division',
			accessorFn: (row) => row.division,
			header: () => 'Divisi',
			size: 150
		},
		{
			id: 'jobDesc',
			accessorFn: (row) => row.jobDesc,
			header: () => 'Jobdesc',
			size: 100
		},
		{
			id: 'status',
			header: () => 'Status',
			cell: ({ row }) => {
				if (row.original.status) {
					return renderComponent(DataTableBadgeCell, {
						variant: 'green',
						value: 'Aktif'
					});
				} else {
					return renderComponent(DataTableBadgeCell, {
						variant: 'destructive',
						value: 'Tidak Aktif'
					});
				}
			},
			size: 75
		},
		{
			id: 'createdAt',
			header: () => 'Dibuat Pada',
			accessorFn: (row) => dateTimeFormatString(row.createdAt),
			size: 150
		},
		{
			id: 'lastUpdatedAt',
			header: () => 'Terakhir Diubah Pada',
			accessorFn: (row) => dateTimeFormatString(row.lastUpdatedAt),
			size: 150
		},
		{
			id: 'actionsColumn',
			header: ' ',
			size: 100,
			cell: ({ row }) => {
				return renderComponent(DataTableActionColumn, {
					single: {
						Pencil: {
							onClick: async () => {
								if (row.original.id) {
									currentSelectedStaff = row.original.id;
									await fetchStaff(row.original.id);
								}
							}
						}
					}
				});
			}
		}
	];

	const tableConfig: Table<StaffList> = $derived(
		createTable({
			columns: columns,
			data: results,
			getCoreRowModel: getCoreRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			manualPagination: true,
			manualSorting: true,
			state: {
				sorting: [sort]
			}
		})
	);

	return {
		get table() {
			return tableConfig;
		},
		set updateTable({ data }: { data: StaffList[] }) {
			results = data;
		},
		get toggleSorting() {
			return toggleSorting;
		},
		get filterValues() {
			return filterValues;
		},
		set filterValues(data) {
			filterValues = data;
		},
		get onPaginate() {
			return onPaginate;
		},
		get showReset() {
			return showReset;
		},
		get staffDetail() {
			return staffDetail;
		},
		get openStaffSheet() {
			return openStaffSheet;
		},
		set openStaffSheet(data) {
			openStaffSheet = data;
		},
		get currentSelectedStaff() {
			return currentSelectedStaff;
		}
	};
}
