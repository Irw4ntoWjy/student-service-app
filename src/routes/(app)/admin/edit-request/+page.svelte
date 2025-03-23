<script lang="ts">
	import type { PageProps } from './$types';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	// import type { MenuSchema } from '$lib/server/sql/menu-query';

	let { data }: PageProps = $props();

	const menuRequest = $derived.by(() => {
		return data.changeRequest
			.filter((items) => items.type === 'MENU')
			.map((items) => items.changeJson);
	});

	$inspect(menuRequest);
	// $inspect(data.changeRequest);
</script>

<Tabs.Root value="account" class="max-w-[300px]">
	<Tabs.List>
		<Tabs.Trigger value="account" class="w-[150px]">List Menu</Tabs.Trigger>
		<Tabs.Trigger value="password" class="w-[150px]">List Staff</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="account">Make changes to your account here.</Tabs.Content>
	<Tabs.Content value="password">Change your password here.</Tabs.Content>
</Tabs.Root>
