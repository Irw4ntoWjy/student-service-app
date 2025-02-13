<script lang="ts">
	import { page } from '$app/state';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';
	import type { PageProps } from './$types';
	import { createAppointmentTable } from './config.svelte';

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
