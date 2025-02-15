import { goto } from '$app/navigation';
import {
	createTable,
	getCoreRowModel,
	getPaginationRowModel
} from '$lib/components/page/tanstack-table';
import { dateTimeFormatString } from '$lib/utils';
import type { ColumnDef, ColumnSort, Table } from '@tanstack/table-core';
import type { StaffList } from './staff-list-schema';

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
			size: 250
		},
		{
			id: 'jobDesc',
			accessorFn: (row) => row.jobDesc,
			header: () => 'Jobdesc',
			size: 100
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
		}
	};
}
