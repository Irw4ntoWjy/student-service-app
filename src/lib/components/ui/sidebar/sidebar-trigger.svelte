<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { ComponentProps } from 'svelte';
	import { useSidebar } from './context.svelte.js';
	import { Menu } from 'lucide-svelte';

	let {
		ref = $bindable(null),
		class: className,
		onclick,
		...restProps
	}: ComponentProps<typeof Button> & {
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const sidebar = useSidebar();
</script>

<Button
	type="button"
	onclick={(e) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	data-sidebar="trigger"
	variant="ghost"
	size="icon"
	class={cn(
		'ml-4 size-6 transition-all duration-200 hover:scale-110 hover:bg-transparent',
		className
	)}
	{...restProps}
>
	<Menu class="!size-6 text-white transition-all duration-200 hover:text-gray-300" />
	<span class="sr-only">Toggle Sidebar</span>
</Button>
