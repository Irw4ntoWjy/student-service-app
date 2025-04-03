<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import { goto } from '$app/navigation';
</script>

<div class="background-container">
	<div class="z-20 flex h-full flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8">
		<div class="flex flex-col items-center text-center font-medium text-white drop-shadow-2xl">
			<span class="text-2xl sm:text-3xl md:text-4xl">Welcome to </span>
			<span class="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-[54px]">
				Student Service Center UPH Medan
			</span>
		</div>
		<p
			class="w-full max-w-[800px] text-center text-sm leading-relaxed text-white sm:text-base md:text-lg"
		>
			Student Service Center (SSC) UPH Medan adalah pusat layanan bagi mahasiswa yang menyediakan
			layanan akademik, administrasi, dan keuangan. Kami berkomitmen untuk memberikan layanan
			terbaik bagi mahasiswa UPH Medan.
		</p>
		<Button
			class="mt-6 flex items-center gap-2 rounded bg-white px-3 py-2 text-primary hover:bg-primary hover:text-white sm:mt-8 sm:px-4 sm:py-3 md:mt-12"
			onclick={() => goto('/menu-services')}
		>
			<span class="text-base font-medium sm:text-lg">Telusuri</span>
			<ChevronRight class="h-4 w-4 sm:h-5 sm:w-5" />
		</Button>
	</div>
	<p class="z-20 w-full text-right text-xs text-white sm:text-sm">
		Copyright © 2025 Yayasan Universitas Pelita Harapan. All rights reserved. Terms of use. Privacy
		statement.
	</p>
</div>

<style>
	.background-container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: 100vh;
		min-height: 100vh;
		width: 100%;
		padding: 1rem;
		background-image: url('$lib/assets/campus-medan.jpg');
		background-size: auto 100%;
		background-position: center center;
		background-repeat: no-repeat;
	}

	.background-container::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 10;
		background-color: rgba(0, 0, 0, 0.75);
	}

	.background-container > * {
		flex-shrink: 0;
	}

	@media (min-width: 640px) {
		.background-container {
			padding: 1.5rem;
			background-size: auto 100%;
			background-position: center center;
		}
	}

	@media (min-width: 768px) {
		.background-container {
			padding: 2rem;
			background-size: cover;
			background-position: center center;
		}
	}

	@media (min-width: 1024px) {
		.background-container {
			background-size: cover;
			background-position: center 30%;
		}
	}
</style>
