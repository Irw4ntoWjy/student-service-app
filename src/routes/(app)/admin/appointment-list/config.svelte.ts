import { goto } from '$app/navigation';
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
		{
			id: 'createdAt',
			header: () => 'Waktu Appointment',
			size: 300,
			cell: ({ row }) => {
				const defaultEntry = {
					title: 'DIBUAT',
					titleClass: 'text-md font-bold text-orange-400',
					value: dateTimeFormatString(row.original.createdAt),
					class: 'text-sm font-bold text-orange-400'
				};

				const optionalFields = [
					{
						title: 'MENUNGGU',
						titleClass: 'text-md font-bold text-sky-400',
						value: row.original.scannedAt,
						class: 'text-sm font-bold text-sky-400'
					},
					{
						title: 'DIMULAI',
						titleClass: 'text-md font-bold text-cyan-600',
						value: row.original.appointmentStartAt,
						class: 'text-sm font-bold text-cyan-600'
					},
					{
						title: 'SELESAI',
						titleClass: 'text-md font-bold text-green-600',
						value: row.original.appointmentFinishedAt,
						class: 'text-sm font-bold text-green-600'
					},
					{
						title: 'DIBATALKAN',
						titleClass: 'text-md font-bold text-destructive',
						value: row.original.cancelAt,
						class: 'text-sm font-bold text-destructive'
					}
				];

				const validOptionalFields = optionalFields
					.filter((item) => item.value)
					.map((item) => ({ ...item, value: dateTimeFormatString(item.value) }));

				const object = [defaultEntry, ...validOptionalFields];
				return renderComponent(MulitpleValueCell, { object });
			}
		},
		{
			id: 'status',
			accessorFn: (row) => appointmentStatus[row.status],
			header: () => 'Status Appointment',
			size: 225
		},
		{
			id: 'servedBy',
			accessorFn: (row) => row.servedBy,
			header: () => 'Dilayani Oleh',
			size: 225
		},
		{
			id: 'reason',
			accessorFn: (row) => row.reason,
			header: () => 'Tujuan Appointment',
			size: 250
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
