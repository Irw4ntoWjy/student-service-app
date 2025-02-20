<script lang="ts">
	import { page } from '$app/state';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';
	import type { PageProps } from './$types';
	import {
		appointmentStatus,
		appointmentStatusBadge,
		createAppointmentTable
	} from './config.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { BookCheck } from 'lucide-svelte';
	import { dateFormatString, dateTimeFormatString } from '$lib/utils';

	let { data }: PageProps = $props();

	const appointmentTableState = createAppointmentTable(page.url.pathname, data.appointmentList);
	$effect(() => {
		appointmentTableState.updateTable = {
			data: data.appointmentList
		};
	});
</script>

<DataTable
	table={appointmentTableState.table}
	toggleSorting={appointmentTableState.toggleSorting}
/>

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
				<span class="text-sm"
					>{dateFormatString(appointmentTableState.appointmentTimeTracking.createdAt)}</span
				>
				<div
					class="relative z-10 flex items-center justify-center rounded-full border bg-green-foreground p-2"
				>
					<BookCheck class="size-4" />
				</div>
				<span class="text-sm font-semibold">Appointment Dibuat</span>
			</div>

			<div class="mr-[25px] h-12 w-[1px] bg-gray-300"></div>

			<div class="relative flex w-full items-center justify-between gap-4">
				<span class="text-sm"
					>{dateFormatString(appointmentTableState.appointmentTimeTracking.createdAt)}</span
				>
				<div
					class="relative z-10 flex items-center justify-center rounded-full border bg-green-foreground p-2"
				>
					<BookCheck class="size-4" />
				</div>
				<span class="text-sm font-semibold text-green">Tamu Menunggu</span>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
