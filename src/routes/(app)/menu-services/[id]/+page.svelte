<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import MenuDialog from './menu-dialog.svelte';

	let openMenuDialog: boolean = $state(false);
	let openOtherOptionDialog: boolean = $state(false);
</script>

<Button
	onclick={() => {
		openMenuDialog = true;
	}}>Open Me</Button
>
<MenuDialog bind:openMenuDialog bind:openOtherOptionDialog />
