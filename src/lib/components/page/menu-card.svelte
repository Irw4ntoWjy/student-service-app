<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		title,
		description,
		src,
		onClick
	}: { title: string; description: string; src?: string | undefined; onClick?: () => void } =
		$props();
</script>

<!-- TODO change into button -->
<div
	class={cn(
		'group w-full rounded-2xl border border-neutral-500/10 hover:cursor-pointer dark:border-white/10',
		'dark:shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]',
		'transform-gpu transition-transform hover:scale-[1.01]',
		'relative h-[340px] bg-gray-50 dark:bg-neutral-800/80'
	)}
>
	<div class="relative z-0 h-48 text-center text-xl font-bold tracking-tighter text-neutral-500/20">
		<img alt="IMG" {src} class="h-[205px] w-full rounded-t-xl object-cover" />
	</div>

	<div class="relative z-10 h-auto bg-white/50 p-6 backdrop-blur-md dark:bg-neutral-800/50">
		<h6
			class="mb-2 origin-left transform-gpu text-xl font-semibold tracking-tighter text-gray-600 transition-all group-hover:scale-90 dark:text-gray-300"
		>
			{title}
		</h6>
		<div class="flex items-center justify-between transition-all">
			<p
				class={cn(
					'text-left text-sm tracking-tight dark:text-gray-400',
					'w-full flex-1 break-words transition-all duration-300',
					'group-hover:mr-2'
				)}
			>
				{description}
			</p>
		</div>
	</div>
</div>
