<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';

	let { open = $bindable(false) }: { open: boolean } = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="">
		<Dialog.Header>
			<Dialog.Title></Dialog.Title>
			<Dialog.Description></Dialog.Description>
		</Dialog.Header>
		<InputOTP.Root maxlength={6}>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 3) as cell}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(3, 6) as cell}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	</Dialog.Content>
</Dialog.Root>
