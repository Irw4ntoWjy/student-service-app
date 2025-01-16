<script lang="ts">
	import type { BadgeVariant } from "$lib/components/ui/badge";
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import { cn } from "$lib/utils";

	type Prop = {
		variant?: BadgeVariant;
		value: string;
        className?: string;
	};

	let {
		variant = "outline",
		value,
        className
	}: Prop = $props();
</script>

<Badge
    {variant}
    class={cn("whitespace-nowrap rounded-md px-4 py-2 text-xs", className)}
    
>
{value}
</Badge>