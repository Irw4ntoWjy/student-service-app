<script lang="ts">
	import type { ChangeRequestSchema } from '$lib/server/sql/change-request-query';
	import * as Card from '$lib/components/ui/card/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import MenuCard from '$lib/components/page/menu-card.svelte';

	let { item, role }: { item: ChangeRequestSchema; role: 'HEAD' | 'SADMIN' | 'ADMIN' } = $props();
</script>

<MenuCard
	title={item.changeJson.name}
	description={item.changeJson.description}
	src={`../uploads/${item.changeJson.imagePath}`}
/>

<!-- <Card.Root>
	<Card.Header>
		<Card.Title></Card.Title>
		<Card.Description></Card.Description>
	</Card.Header>

	<Card.Content></Card.Content>

	<Card.Footer></Card.Footer>
</Card.Root> -->
