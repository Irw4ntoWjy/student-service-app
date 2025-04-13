import { goto } from '$app/navigation';
import { page } from '$app/state';
import DataTableActionColumn from '$lib/components/page/data-table/data-table-action-column.svelte';
import DataTableBadgeCell from '$lib/components/page/data-table/data-table-badge-cell.svelte';
import { createTable, renderComponent } from '$lib/components/page/tanstack-table';
import type { StaffSchema } from '$lib/server/sql/staff-list-query';
import { dateTimeFormatString } from '$lib/utils';
import {
	getCoreRowModel,
	getPaginationRowModel,
	type ColumnDef,
	type Table
} from '@tanstack/table-core';

export type StaffTableFilter = {
	filter: string | undefined;
	selectedDivision: number | undefined;
	selectedData: number | undefined;
};

export function staffTable(pageUrl: string, staffData: StaffSchema[]) {
	const currentUrl = $state(pageUrl);
	let tableData = $state(staffData);
	let filterValue: StaffTableFilter = $state({
		filter: undefined,
		selectedDivision: undefined,
		selectedData: undefined
	});

	const fullUrl = $derived.by(() => {
		let pageUrl = currentUrl;
		let isFirstParam = !pageUrl.includes('?');

		for (const key in filterValue) {
			const value = filterValue[key as keyof typeof filterValue];

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

	const showReset = $derived.by(() => {
		return Object.values(filterValue).some((value) => {
			return Array.isArray(value) ? value.length > 0 : value && value !== '';
		});
	});

	let staffDetail: StaffSchema | undefined = $state(undefined);
	let openStaffSheet: boolean = $state(false);

	const fetchStaff = async (id: number) => {
		const res = await fetch(`${page.url}/get-staff-detail?id=${id}`);
		const data = await res.json();
		staffDetail = data;

		openStaffSheet = true;
	};

	const columns: ColumnDef<StaffSchema>[] = [
		{
			id: 'name',
			accessorFn: (row) => row.name,
			header: () => 'Nama Staff'
		},
		{
			id: 'division',
			accessorFn: (row) => row.divisionName,
			header: () => 'Divisi'
		},
		{
			id: 'jobDesc',
			header: () => 'Jobdesc',
			cell: ({ row }) => {
				if (row.original.jobdesc && row.original.jobdesc !== 'undefined') {
					return row.original.jobdesc;
				}
			}
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
			}
		},
		{
			id: 'createdAt',
			header: () => 'Dibuat Pada',
			accessorFn: (row) => dateTimeFormatString(row.createdAt)
		},
		{
			id: 'lastUpdatedAt',
			header: () => 'Terakhir Diubah Pada',
			accessorFn: (row) => dateTimeFormatString(row.lastUpdatedAt)
		},
		{
			id: 'actionsColumn',
			header: ' ',
			cell: ({ row }) => {
				return renderComponent(DataTableActionColumn, {
					single: {
						Pencil: {
							onClick: async () => {
								if (row.original.id) {
									filterValue.selectedData = row.original.id;
									await fetchStaff(row.original.id);
								}
							}
						}
					}
				});
			}
		}
	];

	const tableConfig: Table<StaffSchema> = $derived(
		createTable({
			columns: columns,
			data: tableData,
			getCoreRowModel: getCoreRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			manualPagination: true,
			manualSorting: true
		})
	);

	return {
		get table() {
			return tableConfig;
		},
		set updateTable({ data }: { data: StaffSchema[] }) {
			tableData = data;
		},
		get filterValue() {
			return filterValue;
		},
		set filterValue(data) {
			filterValue = data;
		},
		get onPaginate() {
			return onPaginate;
		},
		get showReset() {
			return showReset;
		},
		get openStaffSheet() {
			return openStaffSheet;
		},
		set openStaffSheet(data) {
			openStaffSheet = data;
		},
		get staffDetail() {
			return staffDetail;
		}
	};
}
