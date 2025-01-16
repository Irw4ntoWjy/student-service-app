<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLTdAttributes> = $props();
</script>

<td
	bind:this={ref}
	class={cn(
		'overflow-hidden text-ellipsis p-4 align-middle [&:has([role=checkbox])]:pr-0',
		className
	)}
	{...restProps}
>
	<span class="text-sm font-normal">{@render children?.()}</span>
</td>
