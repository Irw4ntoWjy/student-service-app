<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	import { HandCoins, Home, User } from 'lucide-svelte';

	const iconMap = {
		HandCoins,
		Home,
		User
	};

	type QueueTicketProps = {
		status: 'active' | 'pending' | 'closed' | 'cancelled';
		ticketNo: string | undefined;
		title?: string | undefined;
		icons?: 'HandCoins' | 'Home' | 'User';
		description?: string | undefined;
		id: string;
	};

	const cardColor = {
		active: 'bg-green-700 text-white',
		pending: '',
		closed: 'bg-green-600 text-white',
		cancelled: 'bg-destructive text-white'
	};

	let { status, ticketNo, title, icons, description, id }: QueueTicketProps = $props();

	const statusClosedAndCancelled = status === 'closed' || status === 'cancelled';

	const updateStatusActive = async (id: string) => {
		console.log('clicked');

		const formData = new FormData();
		formData.append('id', id);
		formData.append('status', 'ON_GOING');

		console.log(formData);
		const response = await fetch('?/updateStatusActive', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			await invalidateAll();
			toast.success('Berhasil Mengubah Data Menu');
		}
	};

	$inspect(id);
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<Card.Root
			class="w-[21.625rem] {cardColor[
				status
			]} cursor-pointer rounded-lg border-none shadow-xl transition-shadow duration-300 hover:shadow-2xl"
		>
			<div class={statusClosedAndCancelled ? 'flex items-center justify-evenly' : ''}>
				{#if icons && title}
					<Card.Header class=" items-center  {statusClosedAndCancelled ? '' : 'p-4'}">
						<Card.Title class="flex items-center gap-4 text-xl font-bold">
							{@const Icons = iconMap[icons]}
							<div class="rounded-full bg-gray-100 p-2">
								<Icons class="size-6 text-gray-700" />
							</div>
							<span>{title}</span>
						</Card.Title>
					</Card.Header>
				{/if}
				<Card.Content
					class="flex flex-col {statusClosedAndCancelled ? 'text-right' : ' items-center'}  p-2"
				>
					<span
						class="{statusClosedAndCancelled
							? 'text-4xl font-semibold'
							: ' text-6xl font-bold'}  tracking-wide">{ticketNo}</span
					>
				</Card.Content>
			</div>
			{#if description}
				<div class="p-4">
					<Card.Footer
						class="break-words rounded-lg border  p-4 text-center font-medium leading-relaxed {status ===
						'pending'
							? 'border-black text-lg'
							: 'border-gray-200 text-2xl'}"
					>
						{description}
					</Card.Footer>
				</div>
			{/if}
		</Card.Root>
	</ContextMenu.Trigger>
	<ContextMenu.Content class="w-[12rem]">
		<ContextMenu.Item class="text-lg" onclick={() => updateStatusActive(id)}>
			Accept
		</ContextMenu.Item>
		<ContextMenu.Item class="text-lg" onclick={() => {}}>Cancel</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
