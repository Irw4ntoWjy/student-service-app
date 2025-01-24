<script lang="ts">
	import { goto } from '$app/navigation';
	// import src from '$lib/assets/UPH-Blue.svg';
	import src from '$lib/assets/header-uph.png';
	import { ChevronRight } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
</script>

<div class="background flex h-screen w-full flex-col items-center justify-center p-8">
	<div class="flex h-full flex-col items-center justify-center gap-2">
		<img {src} alt="uph-white" class="h-28 w-[32rem]" />
		<!-- <div class="mb-12 flex h-28 w-[24rem] flex-col items-center justify-center bg-white shadow-lg"> -->
		<!-- <img {src} alt="uph-white" class="w-42 h-10" /> -->
		<!-- <span class="mt-1 w-56 border-t-2 border-[#5c5d58]"></span>
			<span class="text-3xl font-bold text-[#1d2362]">Campus Solution</span> -->
		<!-- </div> -->
		<div class="flex flex-col text-center font-medium text-white drop-shadow-2xl">
			<span class="text-4xl">Welcome to </span>
			<span class="text-[54px] font-bold">Student Service Center UPH Medan</span>
		</div>
		<span class="w-[800px] text-center text-lg text-white">
			Student Service Center (SSC) UPH Medan adalah pusat layanan bagi mahasiswa yang menyediakan
			layanan akademik, administrasi, dan keuangan. Kami berkomitmen untuk memberikan layanan
			terbaik bagi mahasiswa UPH Medan.
		</span>
		<Button
			class="mt-12 flex items-center gap-2 rounded bg-white p-4 text-primary hover:bg-primary hover:text-white"
			onclick={() => goto('/menu-services')}
		>
			<span class="text-lg font-medium">Telusuri</span>
			<ChevronRight class="size-4" />
		</Button>
	</div>
	<p class="w-full text-right text-white">
		Copyright © 2025 Yayasan Universitas Pelita Harapan. All rights reserved. Terms of use. privacy
		statement.
	</p>
</div>

<style>
	.background {
		position: relative;
		background-image: url('$lib/assets/campus-medan.jpg');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.background::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.75);
		z-index: 1;
	}

	.background > * {
		position: relative;
		z-index: 2;
	}
</style>
