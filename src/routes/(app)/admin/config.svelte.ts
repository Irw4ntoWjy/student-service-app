import { goto } from '$app/navigation';

import { dateTimeFormatString } from '$lib/utils';
import type { LoadMenuSchema } from '../menu-services/menu-schema';
import DataTableActionColumn from '$lib/components/page/data-table/data-table-action-column.svelte';
import { createTable, getCoreRowModel, getPaginationRowModel, renderComponent, type ColumnDef, type ColumnSort, type Table } from '$lib/components/page/tanstack-table';

export default function createTableState(pageUrl: string, data: LoadMenuSchema[]) {
	let results = $state(data);
	const currentUrl = $state(pageUrl);

	const sort: ColumnSort = $state({
		id: 'name',
		desc: false
	});

	const fullUrl = $derived(currentUrl);
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

	let openEditDialog: boolean = $state(false);
	const columns: ColumnDef<LoadMenuSchema>[] = [
		{
			id: 'name',
			accessorFn: (row) => row.name,
			header: () => 'Name',
			size: 150
		},
		{
			id: 'description',
			accessorFn: (row) => row.description,
			header: () => 'Description',
			size: 250
		},
		{
			id: 'imagePath',
			accessorFn: (row) => row.imagePath,
			header: () => 'Image Path',
			size: 100
		},
		{
			id: 'status',
			header: () => 'Status',
			cell: ({ row }) => {
				if (row.original.status) {
					return 'Aktif';
				} else {
					return 'Tidak Aktif';
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
			cell: () => {
				return renderComponent(DataTableActionColumn, {
					single: {
						Pencil: {
							onClick: () => {
								openEditDialog = true;
							}
						},
						Trash2: {
							onClick: () => {
							}
						}
					}
				});
			}
		}
	];

	const tableConfig: Table<LoadMenuSchema> = $derived(
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
		set updateTable({ data }: { data: LoadMenuSchema[] }) {
			results = data;
		},
		get toggleSorting() {
			return toggleSorting;
		},
		get openEditDialog() {
			return openEditDialog;
		},
		set openEditDialog(state) {
			openEditDialog = state;
		}
	};
}
