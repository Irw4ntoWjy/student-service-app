<script lang="ts">
	import src from '$lib/assets/UPH-Blue.svg';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
</script>

<div class="background flex h-screen w-full flex-col items-center justify-center">
	<div class="h-[36rem] w-[24rem] rounded-md bg-white p-[30px]">
		<div class="flex h-full w-full flex-col items-center">
			<div class="p-4">
				<img {src} alt="uph-blue" class="h-[5rem] w-[16.5rem]" />
			</div>
			<div class="flex flex-col items-center space-y-2">
				<span class="text-center text-xl font-bold"
					>Welcome to Student Service Admin UPH Medan !</span
				>
				<span class="text-md text-center font-normal"
					>If you dont have account before, please click on 'Sign Up' button below to make account</span
				>
			</div>
			<Label />
			<Input />

			<Label />
			<Input />
		</div>
	</div>
</div>

<style>
	.background {
		position: relative;
		background-image: url('$lib/assets/login-cover.jpg');
		background-size: cover;
	}
</style>
