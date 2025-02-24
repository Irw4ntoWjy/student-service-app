<script lang="ts">
	import { page } from '$app/state';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';
	import DatePickerRange from '$lib/components/page/date-picker-range.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { dateFormatString, debounce, timeFormatString } from '$lib/utils';
	import { CalendarDate } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import { Ban, BookCheck, Check, Download, Play, UserSearch, X } from 'lucide-svelte';
	import * as XLSX from 'xlsx';
	import type { PageProps } from './$types';
	import {
		appointmentStatus,
		appointmentStatusBadge,
		createAppointmentTable
	} from './config.svelte';

	let { data }: PageProps = $props();

	const appointmentTableState = createAppointmentTable(page.url.pathname, data.appointmentList);
	$effect(() => {
		appointmentTableState.updateTable = {
			data: data.appointmentList
		};
	});

	//count the gap time for each status
	const getGapTime = (fromTime: string, toTime: string) => {
		const fromDate = new Date(fromTime);
		const toDate = new Date(toTime);

		const timeDiff = Math.floor((toDate.getTime() - fromDate.getTime()) / 1000);

		if (timeDiff < 60) {
			return `${timeDiff} Detik`;
		} else if (timeDiff < 3600) {
			return `${Math.floor(timeDiff / 60)} Menit`;
		} else {
			return `${Math.floor(timeDiff / 3600)} Jam`;
		}
	};

	let datePickerValue: DateRange | undefined = $state(undefined);

	const stringToDateValueConverter = (dateString: string | undefined) => {
		const convertDateString = dateString && dateString !== '' ? new Date(dateString) : undefined;

		return convertDateString
			? new CalendarDate(
					convertDateString.getFullYear(),
					convertDateString.getMonth() + 1,
					convertDateString.getDate()
				)
			: undefined;
	};

	$effect.root(() => {
		const filter = page.url.searchParams.get('filter') || undefined;
		const startDateParam = page.url.searchParams.get('startDate') || undefined;
		const endDateParam = page.url.searchParams.get('endDate') || undefined;

		datePickerValue = {
			start: stringToDateValueConverter(startDateParam),
			end: stringToDateValueConverter(endDateParam)
		};

		appointmentTableState.filterValues.filter = filter || '';
		appointmentTableState.filterValues.startDate = datePickerValue.start?.toString();
		appointmentTableState.filterValues.endDate = datePickerValue.end?.toString();
	});

	const adjustAndFormatDate = (dateValue?: string) => {
		if (!dateValue) return '';
		const date = new Date(dateValue);
		date.setHours(date.getHours() + 7);
		return date.toLocaleString('en-GB', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});
	};

	const exportToExcel = () => {
		if (data.appointmentList) {
			const rowData = appointmentTableState.table.getRowModel().rows.map((row) => {
				const original = row.original;
				return {
					...original,
					createdAt: adjustAndFormatDate(original.createdAt),
					scannedAt: original.scannedAt ? adjustAndFormatDate(original.scannedAt) : '',
					appointmentStartAt: original.appointmentStartAt
						? adjustAndFormatDate(original.appointmentStartAt)
						: '',
					appointmentFinishedAt: original.appointmentFinishedAt
						? adjustAndFormatDate(original.appointmentFinishedAt)
						: '',
					cancelAt: original.cancelAt ? adjustAndFormatDate(original.cancelAt) : ''
				};
			});

			const ws = XLSX.utils.json_to_sheet(rowData);
			const wb = XLSX.utils.book_new();

			XLSX.utils.book_append_sheet(wb, ws, 'Appointments');
			XLSX.writeFile(wb, 'Appointments.xlsx');
		}
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-between">
		<div class="flex items-center gap-4">
			<Input
				class="w-fit"
				placeholder="Cari menu"
				oninput={() => debounce(() => appointmentTableState.onPaginate())}
				bind:value={appointmentTableState.filterValues.filter}
			/>

			<DatePickerRange
				bind:value={datePickerValue}
				onValueChange={() => {
					appointmentTableState.filterValues.startDate = datePickerValue?.start?.toString();
					appointmentTableState.filterValues.endDate = datePickerValue?.end?.toString();
					debounce(() => appointmentTableState.onPaginate());
				}}
			/>

			{#if appointmentTableState.showReset}
				<Button
					onclick={() => {
						appointmentTableState.filterValues.filter = '';
						appointmentTableState.filterValues.startDate = undefined;
						appointmentTableState.filterValues.endDate = undefined;

						datePickerValue = undefined;
						debounce(() => appointmentTableState.onPaginate());
					}}
					variant="ghost"
					class="h-8 px-2 lg:px-3"
				>
					Reset Filter
					<X class="ml-2 h-4 w-4" />
				</Button>
			{/if}
		</div>
		<Button onclick={exportToExcel}>
			<Download class="size-4" />
			Export to Excel
		</Button>
	</div>
	<DataTable
		table={appointmentTableState.table}
		toggleSorting={appointmentTableState.toggleSorting}
	/>
</div>

<Sheet.Root bind:open={appointmentTableState.isAppointmentTrackingSheetOpen}>
	<Sheet.Content class="flex h-full flex-col">
		<Sheet.Header>
			<Sheet.Title>Lacak Waktu Pelayanan</Sheet.Title>
			<Sheet.Description>Berikut merupakan informasi terkini status pelayanan</Sheet.Description>
		</Sheet.Header>
		<Separator class="my-2" />
		<div class="flex items-center justify-between">
			<span class="font-semibold text-primary">Status Terkini</span>
			<Badge
				class="rounded-sm p-2"
				variant={appointmentStatusBadge[appointmentTableState.currentAppointmentStatus]}
				>{appointmentStatus[appointmentTableState.currentAppointmentStatus]}</Badge
			>
		</div>

		<div class="relative flex flex-col items-center">
			<div class="relative flex w-full items-center justify-between gap-4">
				<div class="w-[45%] items-center text-left">
					<span class="text-base text-primary">
						{dateFormatString(appointmentTableState.appointmentTimeTracking.createdAt)}
					</span>
					<span class=" text-base text-primary">
						{timeFormatString(appointmentTableState.appointmentTimeTracking.createdAt)}
					</span>
				</div>

				<div class="flex h-full w-[10%] items-center justify-center">
					<div
						class="rounded-full border p-2 {appointmentTableState.appointmentTimeTracking
							.createdAt &&
						!appointmentTableState.appointmentTimeTracking.scannedAt &&
						!appointmentTableState.appointmentTimeTracking.cancelAt
							? 'bg-green-100'
							: ''}"
					>
						<BookCheck class="size-4" />
					</div>
				</div>

				<div class="mt-1 h-full w-[45%] text-right">
					<span
						class="text-sm font-semibold {appointmentTableState.appointmentTimeTracking.createdAt &&
						!appointmentTableState.appointmentTimeTracking.scannedAt &&
						!appointmentTableState.appointmentTimeTracking.cancelAt
							? 'text-green-500'
							: ''}">Appointment Dibuat</span
					>
				</div>
			</div>

			{#if appointmentTableState.appointmentTimeTracking.scannedAt}
				<div class="flex items-center">
					<div class="h-14 w-[1px] bg-gray-300"></div>
					<div class="absolute translate-x-4 text-center font-bold text-primary">
						{getGapTime(
							appointmentTableState.appointmentTimeTracking.createdAt,
							appointmentTableState.appointmentTimeTracking.scannedAt
						)}
					</div>
				</div>

				<div class="relative flex w-full items-center justify-between gap-4">
					<div class="w-[45%] items-center text-left">
						<span class="text-base text-primary">
							{dateFormatString(appointmentTableState.appointmentTimeTracking.scannedAt)}
						</span>
						<span class=" text-base text-primary">
							{timeFormatString(appointmentTableState.appointmentTimeTracking.scannedAt)}
						</span>
					</div>

					<div class="flex h-full w-[10%] items-center justify-center">
						<div
							class="rounded-full border p-2 {appointmentTableState.appointmentTimeTracking
								.scannedAt &&
							!appointmentTableState.appointmentTimeTracking.appointmentStartAt &&
							!appointmentTableState.appointmentTimeTracking.cancelAt
								? 'bg-green-100'
								: ''}"
						>
							<UserSearch class="size-4" />
						</div>
					</div>

					<div class="mt-1 h-full w-[45%] text-right">
						<span
							class="text-sm font-semibold {appointmentTableState.appointmentTimeTracking
								.scannedAt &&
							!appointmentTableState.appointmentTimeTracking.appointmentStartAt &&
							!appointmentTableState.appointmentTimeTracking.cancelAt
								? 'text-green-500'
								: ''}">Tamu Menunggu</span
						>
					</div>
				</div>
			{/if}

			{#if appointmentTableState.appointmentTimeTracking.appointmentStartAt && appointmentTableState.appointmentTimeTracking.scannedAt}
				<div class="flex items-center">
					<div class="h-14 w-[1px] bg-gray-300"></div>
					<div class="absolute translate-x-4 text-center font-bold text-primary">
						{getGapTime(
							appointmentTableState.appointmentTimeTracking.scannedAt,
							appointmentTableState.appointmentTimeTracking.appointmentStartAt
						)}
					</div>
				</div>

				<div class="relative flex w-full items-center justify-between gap-4">
					<div class="w-[45%] items-center text-left">
						<span class="text-base text-primary">
							{dateFormatString(appointmentTableState.appointmentTimeTracking.appointmentStartAt)}
						</span>
						<span class=" text-base text-primary">
							{timeFormatString(appointmentTableState.appointmentTimeTracking.appointmentStartAt)}
						</span>
					</div>

					<div class="flex h-full w-[10%] items-center justify-center">
						<div
							class="rounded-full border p-2 {appointmentTableState.appointmentTimeTracking
								.appointmentStartAt &&
							!appointmentTableState.appointmentTimeTracking.appointmentFinishedAt &&
							!appointmentTableState.appointmentTimeTracking.cancelAt
								? 'bg-green-100'
								: ''}"
						>
							<Play class="size-4" />
						</div>
					</div>

					<div class="mt-1 h-full w-[45%] text-right">
						<span
							class="text-sm font-semibold {appointmentTableState.appointmentTimeTracking
								.appointmentStartAt &&
							!appointmentTableState.appointmentTimeTracking.appointmentFinishedAt &&
							!appointmentTableState.appointmentTimeTracking.cancelAt
								? 'text-green-500'
								: ''}">Appointment Dimulai</span
						>
					</div>
				</div>
			{/if}

			{#if appointmentTableState.appointmentTimeTracking.appointmentFinishedAt && appointmentTableState.appointmentTimeTracking.appointmentStartAt}
				<div class="flex items-center">
					<div class="h-14 w-[1px] bg-gray-300"></div>
					<div class="absolute translate-x-4 text-center font-bold text-primary">
						{getGapTime(
							appointmentTableState.appointmentTimeTracking.appointmentStartAt,
							appointmentTableState.appointmentTimeTracking.appointmentFinishedAt
						)}
					</div>
				</div>

				<div class="relative flex w-full items-center justify-between gap-4">
					<div class="w-[45%] items-center text-left">
						<span class="text-base text-primary">
							{dateFormatString(
								appointmentTableState.appointmentTimeTracking.appointmentFinishedAt
							)}
						</span>
						<span class=" text-base text-primary">
							{timeFormatString(
								appointmentTableState.appointmentTimeTracking.appointmentFinishedAt
							)}
						</span>
					</div>

					<div class="flex h-full w-[10%] items-center justify-center">
						<div
							class="rounded-full border p-2 {appointmentTableState.appointmentTimeTracking
								.appointmentFinishedAt && !appointmentTableState.appointmentTimeTracking.cancelAt
								? 'bg-green-100'
								: ''}"
						>
							<Check class="size-4" />
						</div>
					</div>

					<div class="mt-1 h-full w-[45%] text-right">
						<span
							class="text-sm font-semibold {appointmentTableState.appointmentTimeTracking
								.appointmentFinishedAt && !appointmentTableState.appointmentTimeTracking.cancelAt
								? 'text-green-500'
								: ''}">Appointment Selesai</span
						>
					</div>
				</div>
			{/if}

			{#if appointmentTableState.appointmentTimeTracking.cancelAt && appointmentTableState.appointmentTimeTracking.scannedAt}
				<div class="flex items-center">
					<div class="h-14 w-[1px] bg-gray-300"></div>
					<div class="absolute translate-x-4 text-center font-bold text-primary">
						{getGapTime(
							appointmentTableState.appointmentTimeTracking.scannedAt,
							appointmentTableState.appointmentTimeTracking.cancelAt
						)}
					</div>
				</div>

				<div class="relative flex w-full items-center justify-between gap-4">
					<div class="w-[45%] items-center text-left">
						<span class=" text-base text-destructive">
							{dateFormatString(appointmentTableState.appointmentTimeTracking.cancelAt)}
						</span>
						<span class=" text-base text-destructive">
							{timeFormatString(appointmentTableState.appointmentTimeTracking.cancelAt)}
						</span>
					</div>
					<div class="flex h-full w-[10%] items-center justify-center">
						<div class="rounded-full border bg-destructive-foreground p-2">
							<Ban class="size-4 text-destructive" />
						</div>
					</div>

					<div class=" w-[45%] text-right">
						<span class="text-sm font-semibold text-destructive">Appointment Dibatalkan</span>
					</div>
				</div>
			{/if}
		</div>
	</Sheet.Content>
</Sheet.Root>
