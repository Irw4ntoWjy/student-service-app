import { goto } from '$app/navigation';
import {
	createTable,
	getCoreRowModel,
	getPaginationRowModel,
	type ColumnDef,
	type ColumnSort,
	type Table
} from '$lib/components/page/tanstack-table';
import { dateTimeFormatString } from '$lib/utils';
import type { AppointmentTicketSchema } from '../../queue-ticket/queue-ticket-schema';

const appointmentStatus = {
	active: 'Sedang Diproses',
	pending: 'Sedang Mengantri',
	waiting: 'Belum Terlayani',
	closed: 'Selesai',
	cancelled: 'Dibatalkan',
	created: 'Menunggu Nomor Antrian'
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
			size: 225
		},
		// {
		// 	id: 'menuName',
		// 	accessorFn: (row) => row.menuName,
		// 	header: () => 'Divisi Yang Dicari',
		// 	size: 200
		// },
		{
			id: 'status',
			accessorFn: (row) => appointmentStatus[row.status],
			header: () => 'Status Appointment',
			size: 225
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
			size: 275
		},
		{
			id: 'appointmentFinishedAt',
			accessorFn: (row) => dateTimeFormatString(row.appointmentFinishedAt),
			header: () => 'Appointment Selesai Pada',
			size: 275
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
