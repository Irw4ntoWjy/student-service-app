<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import type { DateRange } from 'bits-ui';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	let {
		value = $bindable(),
		onValueChange
	}: { value: DateRange | undefined; onValueChange: () => void } = $props();
	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});
</script>

<div class="grid gap-2">
	<Popover.Root>
		<Popover.Trigger
			class={cn(buttonVariants({ variant: 'outline' }), !value && 'text-muted-foreground')}
		>
			<CalendarIcon class="mr-2 size-4" />
			{#if value && value.start}
				{#if value.end}
					{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
						value.end.toDate(getLocalTimeZone())
					)}
				{:else}
					{df.format(value.start.toDate(getLocalTimeZone()))}
				{/if}
			{:else}
				Pilih Tanggal
			{/if}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<RangeCalendar bind:value numberOfMonths={2} {onValueChange} />
		</Popover.Content>
	</Popover.Root>
</div>
