<script lang="ts">
	import src from '$lib/assets/UPH-Blue.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Eye, EyeOff, KeyRound, User } from 'lucide-svelte';

	let showPassword: boolean = $state(false);
</script>

<div class="background flex h-screen w-full flex-col items-center justify-center">
	<div class="h-[42rem] w-[24rem] rounded-md bg-white p-[30px]">
		<div class="flex h-full w-full flex-col items-center gap-4">
			<div class="p-4">
				<img {src} alt="uph-blue" class="h-[5rem] w-[16.5rem]" />
			</div>
			<div class="flex flex-col items-center">
				<span class="p-2 text-center text-xl font-bold"
					>Welcome to Student Service Admin UPH Medan !</span
				>
				<span class="text-md text-center font-normal"
					>If you dont have account before, please click on 'Sign Up' button below to make account</span
				>
			</div>

			<form class="relative w-full rounded-md border bg-white p-1 shadow-md">
				<label class="flex h-10 w-full items-center">
					<Input
						required
						placeholder="Username"
						type="text"
						class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none"
					/>
					<div class="absolute left-3 text-gray-500 transition-transform duration-300 ease-in-out">
						<User class="size-4" />
					</div>
				</label>
			</form>

			<form class="relative w-full rounded-md border bg-white p-1 shadow-md">
				<label class="relative flex h-10 w-full items-center">
					<Input
						required
						placeholder="Password"
						type={showPassword ? 'text' : 'password'}
						class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none"
					/>
					<div class="absolute left-3 text-gray-500">
						<KeyRound class="size-4" />
					</div>

					<Button
						type="button"
						variant="ghost"
						class="absolute right-3 text-gray-500 focus:outline-none"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<EyeOff class="size-4" />
						{:else}
							<Eye class="size-4" />
						{/if}
					</Button>
				</label>
			</form>
			<span class="ml-auto cursor-pointer self-end text-sm font-medium text-primary">Sign up</span>
			<Button type="button" class="w-full">Log in</Button>
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
