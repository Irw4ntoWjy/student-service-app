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
	type Table
} from '$lib/components/page/tanstack-table';
import type { MenuSchema } from '$lib/server/sql/menu-query';
import { dateTimeFormatString } from '$lib/utils';
import type { MenuActionSchema } from '../../menu-services/menu-schema';

export type MenuTableFilter = {
	filter: string | undefined;
	selectedData: number | undefined;
};

export function menuTable(pageUrl: string, menuData: MenuSchema[]) {
	const currentUrl = $state(pageUrl);
	let tableData = $state(menuData);

	let filterValue: MenuTableFilter = $state({
		filter: undefined,
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

	// model to contains menu data when click edit button
	let openEditDialog: boolean = $state(false);

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

	let openMenuAction: boolean = $state(false);
	let menuAction: MenuActionSchema[] | undefined = $state(undefined);

	const fetchMenuAction = async (id: number) => {
		const res = await fetch(`${page.url}/get-menu-action?id=${id}`);
		const data = await res.json();
		menuAction = data;
	};

	let currentMenu: { id: number | undefined; name: string | undefined; code: string | undefined } =
		$state({
			id: undefined,
			name: undefined,
			code: undefined
		});

	const showReset = $derived.by(() => {
		return Object.values(filterValue).some((value) => {
			return Array.isArray(value) ? value.length > 0 : value && value !== '';
		});
	});

	const columns: ColumnDef<MenuSchema>[] = [
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
								if (row.original.id) {
									await fetchMenuAction(row.original.id);
									currentMenu = {
										id: row.original.id,
										name: row.original.name,
										code: row.original.code
									};
									openMenuAction = true;
								}
							}
						}
					}
				});
			}
		}
	];

	const tableConfig: Table<MenuSchema> = $derived(
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
		set updateTable({ data }: { data: MenuSchema[] }) {
			tableData = data;
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
		get openMenuAction() {
			return openMenuAction;
		},
		set openMenuAction(data) {
			openMenuAction = data;
		},
		get menuAction() {
			return menuAction;
		},
		get currentMenu() {
			return currentMenu;
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
		}
	};
}
