<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	let { open = $bindable() }: { open: boolean } = $props();
	let value: string | undefined = $state('');
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-lg font-bold">Opsi lainnya</Dialog.Title>
			<Dialog.Description class="text-sm text-gray-500">
				Deskripsikan permasalahan yang anda alami
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-col p-0">
			<Textarea placeholder="Type your message here." bind:value />
			{#if value}
				<p class="mt-2 text-sm text-destructive">
					*Anda akan langsung melakukan appointment ketika selesai
				</p>
			{/if}
			<Button class="ml-auto mt-4 w-fit">Selanjutnya</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
