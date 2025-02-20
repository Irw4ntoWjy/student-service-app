import { goto } from '$app/navigation';
import DataTableBadgeCell from '$lib/components/page/data-table/data-table-badge-cell.svelte';
import MulitpleValueCell from '$lib/components/page/mulitple-value-cell.svelte';
import {
	createTable,
	getCoreRowModel,
	getPaginationRowModel,
	renderComponent,
	type ColumnDef,
	type ColumnSort,
	type Table
} from '$lib/components/page/tanstack-table';
import type { BadgeVariant } from '$lib/components/ui/badge';
import type { AppointmentTicketSchema, Status } from '../../queue-ticket/queue-ticket-schema';
import AppointmentActionTable from './appointment-action-table.svelte';

export const appointmentStatus = {
	active: 'Sedang Diproses',
	pending: 'Sedang Mengantri',
	waiting: 'Belum Terlayani',
	closed: 'Selesai',
	cancelled: 'Dibatalkan',
	created: 'Menunggu Nomor Antrian'
};

const userStatus = {
	ACTIVE: 'Mahasiswa Aktif',
	GENERAL: 'Tamu / Alumni',
	waiting: 'Belum Terlayani',
	closed: 'Selesai',
	cancelled: 'Dibatalkan',
	created: 'Menunggu Nomor Antrian'
};

export const appointmentStatusBadge: {
	[key in keyof typeof appointmentStatus]: BadgeVariant;
} = {
	active: 'green',
	pending: 'secondary',
	waiting: 'teal',
	closed: 'blue',
	cancelled: 'destructive',
	created: 'purple'
};

export type AppointmentTime = {
	createdAt: string;
	scannedAt: string | undefined;
	appointmentStartAt: string | undefined;
	appointmentFinishedAt: string | undefined;
	cancelAt: string | undefined;
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

	let isAppointmentTrackingSheetOpen: boolean = $state(false);
	let currentAppointmentStatus: Status = $state('pending');
	let appointmentTimeTracking: AppointmentTime = $state({
		createdAt: '',
		scannedAt: undefined,
		cancelAt: undefined,
		appointmentStartAt: undefined,
		appointmentFinishedAt: undefined
	});

	const columns: ColumnDef<AppointmentTicketSchema>[] = [
		{
			id: 'appointmentNo',
			accessorFn: (row) => row.appointmentNo,
			header: () => 'Nomor Appointment',
			size: 150
		},
		{
			id: 'fromAppointmentNo',
			accessorFn: (row) => row.fromAppointmentNo,
			header: () => 'Appointment Sebelumnya',
			size: 150
		},
		{
			id: 'userStatus',
			header: () => 'Status Tamu',
			accessorFn: (row) => userStatus[row.userStatus],
			size: 160
		},
		{
			id: 'userName',
			header: () => 'Data identitas',
			cell: ({ row }) => {
				return renderComponent(MulitpleValueCell, {
					object: [
						{
							title: 'Nama',
							titleClass: 'text-md font-bold text-indigo',
							value: row.original.userName,
							class: 'text-sm'
						}
					]
				});
			},
			size: 240
		},
		{
			id: 'status',
			header: () => 'Status',
			cell: ({ row }) => {
				return renderComponent(DataTableBadgeCell, {
					variant: appointmentStatusBadge[row.original.status],
					value: appointmentStatus[row.original.status]
				});
			},
			size: 180
		},
		{
			id: 'servedBy',
			accessorFn: (row) => row.servedBy,
			header: () => 'Dilayani Oleh',
			size: 150
		},
		{
			id: 'createdAt',
			header: () => 'Total Waktu Pelayanan',
			cell: ({ row }) => {
				return renderComponent(AppointmentActionTable, {
					appointmentTime: {
						createdAt: row.original.createdAt,
						scannedAt: row.original.scannedAt,
						cancelAt: row.original.cancelAt,
						appointmentStartAt: row.original.appointmentStartAt,
						appointmentFinishedAt: row.original.appointmentFinishedAt
					},
					onclick: () => {
						isAppointmentTrackingSheetOpen = true;
						currentAppointmentStatus = row.original.status;

						appointmentTimeTracking = {
							createdAt: row.original.createdAt,
							scannedAt: row.original.scannedAt,
							cancelAt: row.original.cancelAt,
							appointmentStartAt: row.original.appointmentStartAt,
							appointmentFinishedAt: row.original.appointmentFinishedAt
						};
					}
				});
			},
			size: 150
		},
		{
			id: 'reason',
			accessorFn: (row) => row.reason,
			header: () => 'Tujuan Appointment',
			size: 150
		},
		{
			id: 'cancelReason',
			accessorFn: (row) => row.cancelReason,
			header: () => 'Alasan Pembatalan',
			size: 150
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
		},
		get isAppointmentTrackingSheetOpen() {
			return isAppointmentTrackingSheetOpen;
		},
		set isAppointmentTrackingSheetOpen(data) {
			isAppointmentTrackingSheetOpen = data;
		},
		get currentAppointmentStatus() {
			return currentAppointmentStatus;
		},
		get appointmentTimeTracking() {
			return appointmentTimeTracking;
		}
	};
}
