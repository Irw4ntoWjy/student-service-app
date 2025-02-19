<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const badgeVariants = tv({
		base: 'focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
		variants: {
			variant: {
				default: 'bg-primary hover:bg-primary/80 border-transparent text-primary-foreground',
				secondary:
					'bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground',
				destructive:
					'bg-destructive-foreground hover:bg-destructive-foreground/80 border-destructive-border text-destructive',
				outline: 'text-foreground',
				purple:
					'bg-purple-foreground hover:bg-purple-foreground/50 border-purple-border text-purple',
				violet:
					'bg-violet-foreground hover:bg-violet-foreground/50 border-violet-border text-violet',
				yellow:
					'bg-yellow-foreground hover:bg-yellow-foreground/50 border-yellow-border text-yellow',
				orange:
					'bg-orange-foreground hover:bg-orange-foreground/50 border-orange-border text-orange',
				amber: 'bg-amber-foreground hover:bg-amber-foreground/50 border-amber-border text-amber',
				green: 'bg-green-foreground hover:bg-green-foreground/50 border-green-border text-green',
				lime: 'bg-lime-foreground hover:bg-lime-foreground/50 border-lime-border text-lime',
				teal: 'bg-teal-foreground hover:bg-teal-foreground/50 border-teal-border text-teal',
				blue: 'bg-blue-foreground hover:bg-blue-foreground/50 border-blue-border text-blue',
				cyan: 'bg-cyan-foreground hover:bg-cyan-foreground/50 border-cyan-border text-cyan',
				pink: 'bg-pink-foreground hover:bg-pink-foreground/50 border-pink-border text-pink',
				gray: 'bg-gray-foreground hover:bg-gray-foreground/50 border-gray-border text-gray',
				fuchsia:
					'bg-fuchsia-foreground hover:bg-fuchsia-foreground/50 border-fuchsia-border text-fuchsia',
				indigo:
					'bg-indigo-foreground hover:bg-indigo-foreground/50 border-indigo-border text-indigo',
				emerald:
					'bg-emerald-foreground hover:bg-emerald-foreground/50 border-emerald-border text-emerald'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
	} = $props();
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	bind:this={ref}
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
