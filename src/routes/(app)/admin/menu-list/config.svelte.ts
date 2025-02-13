import { goto } from '$app/navigation';
import { page } from '$app/state';

import DataTableActionColumn from '$lib/components/page/data-table/data-table-action-column.svelte';
import DataTableBadgeCell from '$lib/components/page/data-table/data-table-badge-cell.svelte';
import {
	createTable,
	getCoreRowModel,
	getPaginationRowModel,
	renderComponent,
	type ColumnDef,
	type ColumnSort,
	type Table
} from '$lib/components/page/tanstack-table';
import { dateTimeFormatString } from '$lib/utils';
import type { LoadMenuSchema, MenuDialogSchema } from '../../menu-services/menu-schema';

export type MenuFilterValue = {
	filter: string;
};

export function createMenuTable(pageUrl: string, data: LoadMenuSchema[]) {
	let results = $state(data);
	const currentUrl = $state(pageUrl);

	let filterValues: MenuFilterValue = $state({
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

	let openEditDialog: boolean = $state(false);

	// model to contains menu data when click edit button
	type EditMenuType = {
		id: number | undefined;
		menuName: string | undefined;
		menuDescription: string | undefined;
		imageName: string | undefined;
		status: boolean;
	};

	let editMenuData: EditMenuType = $state({
		id: undefined,
		menuName: undefined,
		menuDescription: undefined,
		imageName: undefined,
		status: true
	});

	let openMenuDialog: boolean = $state(false);
	let menuDialog: MenuDialogSchema[] | undefined = $state(undefined);

	const fetchMenuAction = async (id: number) => {
		const res = await fetch(`${page.url}/get-menu-action?id=${id}`);
		const data = await res.json();
		menuDialog = data;
	};

	let currentMenu: { id: number | undefined; name: string | undefined; code: string | undefined } =
		$state({
			id: undefined,
			name: undefined,
			code: undefined
		});

	const columns: ColumnDef<LoadMenuSchema>[] = [
		{
			id: 'name',
			accessorFn: (row) => row.name,
			header: () => 'Nama Menu',
			size: 150
		},
		{
			id: 'description',
			accessorFn: (row) => row.description,
			header: () => 'Deskripsi Menu',
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
							onClick: () => {
								editMenuData = {
									id: row.original.id,
									menuName: row.original.name,
									menuDescription: row.original.description,
									imageName: row.original.imagePath,
									status: row.original.status
								};
								openEditDialog = true;
							}
						},
						Eye: {
							onClick: async () => {
								fetchMenuAction(row.original.id);
								currentMenu = {
									id: row.original.id,
									name: row.original.name,
									code: row.original.code
								};
								openMenuDialog = true;
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
		},
		get editMenuData() {
			return editMenuData;
		},
		set editMenuData(data) {
			editMenuData = data;
		},
		get openMenuDialog() {
			return openMenuDialog;
		},
		set openMenuDialog(data) {
			openMenuDialog = data;
		},
		get menuDialog() {
			return menuDialog;
		},
		get currentMenu() {
			return currentMenu;
		},
		get filterValues() {
			return filterValues;
		},
		set filterValues(data) {
			filterValues = data;
		},
		get onPaginate() {
			return onPaginate;
		}
	};
}
