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
import type { LoadMenuSchema, MenuDialogSchema } from '../menu-services/menu-schema';
import type { AppointmentTicketSchema } from '../queue-ticket/queue-ticket-schema';

export function createMenuTable(pageUrl: string, data: LoadMenuSchema[]) {
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

	let currentMenuId: number | undefined = $state(undefined);

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
								currentMenuId = row.original.id;
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
		get currentMenuId() {
			return currentMenuId;
		}
	};
}

const appointmentStatus = {
	active: 'Sedang Diproses',
	pending: 'Sedang Mengantri',
	waiting: 'Belum Terlayani',
	closed: 'Selesai',
	cancelled: 'Dibatalkan'
};

export function createAppointmentTable(pageUrl: string, data: AppointmentTicketSchema[]) {
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

	const columns: ColumnDef<AppointmentTicketSchema>[] = [
		{
			id: 'appointmentNo',
			accessorFn: (row) => row.appointmentNo,
			header: () => 'Nomor Appointment',
			size: 250
		},
		{
			id: 'status',
			accessorFn: (row) => appointmentStatus[row.status],
			header: () => 'Status Appointment',
			size: 250
		},
		{
			id: 'reason',
			accessorFn: (row) => row.reason,
			header: () => 'Tujuan Appointment',
			size: 250
		},
		{
			id: 'createdAt',
			accessorFn: (row) => dateTimeFormatString(row.createdAt),
			header: () => 'Dibuat Pada',
			size: 250
		},
		{
			id: 'scannedAt',
			accessorFn: (row) => dateTimeFormatString(row.scannedAt),
			header: () => 'Antrian Dimulai Pada',
			size: 250
		},
		{
			id: 'appointmentStartAt',
			accessorFn: (row) => dateTimeFormatString(row.appointmentStartAt),
			header: () => 'Appointment Dimulai Pada',
			size: 250
		},
		{
			id: 'appointmentFinishedAt',
			accessorFn: (row) => dateTimeFormatString(row.appointmentFinishedAt),
			header: () => 'Appointment Selesai Pada',
			size: 250
		},
		{
			id: 'cancelAt',
			accessorFn: (row) => dateTimeFormatString(row.cancelAt),
			header: () => 'Appointment Dibatalkan Pada',
			size: 300
		},
		{
			id: 'cancelReason',
			accessorFn: (row) => row.cancelReason,
			header: () => 'Alasan Pembatalan',
			size: 250
		}
	];

	const tableConfig: Table<AppointmentTicketSchema> = $derived(
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
		set updateTable({ data }: { data: AppointmentTicketSchema[] }) {
			results = data;
		},
		get toggleSorting() {
			return toggleSorting;
		}
	};
}
