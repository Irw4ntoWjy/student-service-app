<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Briefcase, ChevronRight, PersonStanding, SquareMenu } from 'lucide-svelte';
	import src from '$lib/assets/UPH-Blue.svg';

	// Menu items.
	const items = [
		{
			title: 'List Menu',
			url: '/admin/menu-list',
			icon: SquareMenu
		},
		{
			title: 'List Appointment',
			url: '/admin/appointment-list',
			icon: PersonStanding
		},
		{
			title: 'List Staff',
			url: '/admin/staff-list',
			icon: Briefcase
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<div class="flex items-center p-4">
					<img {src} alt="uph-blue" class="w-54 h-16" />
				</div>
				<div class="p-2">
					<Sidebar.Menu class="mt-4 rounded-md bg-white p-2">
						{#each items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a
											href={item.url}
											{...props}
											class="flex items-center justify-between rounded-md p-2 transition-all
											{page.url.pathname === item.url ? 'bg-indigo-50 text-blue-700' : 'hover:bg-gray-100'}"
										>
											<div class="flex items-center gap-4">
												<item.icon />
												<span class="font-semibold">{item.title}</span>
											</div>
											{#if page.url.pathname === item.url}
												<ChevronRight class="size-4" />
											{/if}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</div>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
