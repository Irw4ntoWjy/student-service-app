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
import type { StatusType } from '$lib/server/sql/appointment-query';
import AppointmentActionTable from './appointment-action-table.svelte';
import type { AppointmentListSchema } from './appointment-list-schema';

export const appointmentStatus = {
	CREATED: 'Terdaftar',
	SCANNED: 'Sedang Menunggu',
	PENDING: 'Belum Terlayani',
	ONGOING: 'Sedang Dilayani',
	COMPLETED: 'Selesai Dilayani',
	CANCELLED: 'Dibatalkan'
};

const userType = {
	STUDENT: 'Mahasiswa Aktif',
	EXTERNAL: 'Tamu / Alumni'
};

export const appointmentStatusBadge: {
	[key in keyof typeof appointmentStatus]: BadgeVariant;
} = {
	CREATED: 'purple',
	SCANNED: 'secondary',
	PENDING: 'teal',
	ONGOING: 'blue',
	COMPLETED: 'green',
	CANCELLED: 'destructive'
};

export type AppointmentTime = {
	createdAt: string;
	scannedAt: string | undefined;
	appointmentStartAt: string | undefined;
	appointmentFinishedAt: string | undefined;
	cancelAt: string | undefined;
};

export type AppointmentFilterValue = {
	filter: string | undefined;
	startDate: string | undefined;
	endDate: string | undefined;
};

export function createAppointmentTable(pageUrl: string, data: AppointmentListSchema[]) {
	let results = $state(data);
	const currentUrl = $state(pageUrl);

	let filterValues: AppointmentFilterValue = $state({
		filter: undefined,
		startDate: undefined,
		endDate: undefined
	});

	const showReset = $derived.by(() => {
		return Object.values(filterValues).some((value) => {
			return Array.isArray(value) ? value.length > 0 : value && value !== '';
		});
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

	let isAppointmentTrackingSheetOpen: boolean = $state(false);

	let currentAppointmentStatus: StatusType = $state('PENDING');

	let appointmentTimeTracking: AppointmentTime = $state({
		createdAt: '',
		scannedAt: undefined,
		cancelAt: undefined,
		appointmentStartAt: undefined,
		appointmentFinishedAt: undefined
	});

	const columns: ColumnDef<AppointmentListSchema>[] = [
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
			accessorFn: (row) => userType[row.userType],
			size: 160
		},
		{
			id: 'userName',
			header: () => 'Data identitas',
			cell: ({ row }) => {
				const data = [
					{
						title: 'Nama',
						titleClass: 'text-md font-bold text-indigo',
						value: row.original.userName,
						class: 'text-sm'
					}
				];

				if (row.original.userType === 'STUDENT') {
					data.push({
						title: 'NIM',
						titleClass: 'text-md font-bold text-indigo',
						value: row.original.userNim || undefined!,
						class: 'text-sm'
					});
				}

				return renderComponent(MulitpleValueCell, {
					object: data
				});
			},
			size: 240
		},
		{
			id: 'status',
			header: () => 'Status',
			cell: ({ row }) => {
				return renderComponent(DataTableBadgeCell, {
					variant: appointmentStatusBadge[row.original.statusType],
					value: appointmentStatus[row.original.statusType]
				});
			},
			size: 180
		},
		{
			id: 'servedBy',
			accessorFn: (row) => row.servedName,
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
						appointmentFinishedAt: row.original.appointmentEndAt
					},

					onclick: () => {
						isAppointmentTrackingSheetOpen = true;
						currentAppointmentStatus = row.original.statusType;

						appointmentTimeTracking = {
							createdAt: row.original.createdAt,
							scannedAt: row.original.scannedAt,
							cancelAt: row.original.cancelAt,
							appointmentStartAt: row.original.appointmentStartAt,
							appointmentFinishedAt: row.original.appointmentEndAt
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

	const tableConfig: Table<AppointmentListSchema> = $derived(
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
		set updateTable({ data }: { data: AppointmentListSchema[] }) {
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
		},
		get filterValues() {
			return filterValues;
		},
		set filterValues(data) {
			filterValues = data;
		},
		get showReset() {
			return showReset;
		},
		get onPaginate() {
			return onPaginate;
		}
	};
}
