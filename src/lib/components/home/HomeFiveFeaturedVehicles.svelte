<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import HomeFiveVehicleCard from './HomeFiveVehicleCard.svelte';

	let { vehicles }: { vehicles: HomeFiveVehicleCardData[] } = $props();

	const vehiclePills = [
		{ active: true, href: '/inventory?bodyType=SUV', label: 'SUV' },
		{ active: false, href: '/inventory?bodyType=Sedan', label: 'Sedan' },
		{ active: false, href: '/inventory?bodyType=Coupe', label: 'Coupe' },
		{ active: false, href: '/inventory?bodyType=Luxury', label: 'Luxury' }
	] as const;
</script>

{#if vehicles.length}
	<section class="bohemcars-featured-vehicles background-light py-100" data-bohemcars-home-vehicles>
		<div class="container">
			<div class="title-section wow fadeInUp mb-40" data-wow-delay="0.1s">
				<h2>Bohemcars Vehicles</h2>
				<a
					href={resolve('/inventory?view=4')}
					class="btn btn-line-style-2 effect-line-primary btn-large hover-fill-white"
				>
					View All
					<svg
						width="17"
						height="17"
						viewBox="0 0 17 17"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
							fill="#1C1C1C"
						/>
					</svg>
				</a>
			</div>
			<div class="bohemcars-vehicle-pills mb-40 flex items-center justify-center overflow-x-auto">
				<ul class="menu-tab menu-tab-style2 margin-auto gap-10">
					{#each vehiclePills as pill (pill.label)}
						<li class={`bohemcars-vehicle-pill car-box ${pill.active ? 'active' : ''}`}>
							<a href={resolve(pill.href)}>
								{@render vehicleIcon()}
								{pill.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<div
				class="swiper-container swiper-card-wrapper swiper-card-5 wow fadeIn"
				data-wow-delay="0.1s"
			>
				<div class="swiper-wrapper">
					{#each vehicles as vehicle (vehicle.slug)}
						<div class="swiper-slide">
							<HomeFiveVehicleCard {vehicle} />
						</div>
					{/each}
				</div>
				<div class="xl-show hidden">
					<div
						class="swiper-pagination pagination-dark pagination-style pagination-swiper-card-5 mt-35"
					></div>
				</div>
			</div>
		</div>
	</section>
{/if}

{#snippet vehicleIcon()}
	<svg width="41" height="18" viewBox="0 0 41 18" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M8.886 17.277c1.782 0 3.226-1.444 3.226-3.226s-1.444-3.226-3.226-3.226-3.226 1.444-3.226 3.226 1.444 3.226 3.226 3.226Z"
			stroke="currentColor"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M31.468 17.277c1.782 0 3.226-1.444 3.226-3.226s-1.444-3.226-3.226-3.226-3.226 1.444-3.226 3.226 1.444 3.226 3.226 3.226Z"
			stroke="currentColor"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M12.113 14.049h16.129"
			stroke="currentColor"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M34.694 14.048H40.5V9.532c-2.968-2.064-6.451-3.226-10.064-3.226h-.904l-3.742-4.774C25.274.887 24.5.5 23.726.5H10.694c-.258 0-.646.129-.904.258L5.661 4.371h-2.58c-.775 0-1.291.516-1.291 1.29v3.871L.5 10.823v1.935l5.161 1.29"
			stroke="currentColor"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M29.531 6.306h-17.42l-2.58-1.29v-1.29L13.402.5M17.922.5v5.806"
			stroke="currentColor"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<style>
	.bohemcars-vehicle-pills {
		scrollbar-width: none;
	}

	.bohemcars-vehicle-pills::-webkit-scrollbar {
		display: none;
	}

	.bohemcars-vehicle-pills :global(.menu-tab-style2) {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: nowrap;
		width: max-content;
		max-width: 100%;
	}

	.bohemcars-vehicle-pill {
		height: 40px;
		border-color: rgb(28 28 28 / 0.12);
		background: rgb(255 255 255 / 0.58);
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.64);
		color: #1c1c1c;
		overflow: hidden;
		padding: 0;
	}

	.bohemcars-vehicle-pill:hover,
	.bohemcars-vehicle-pill.active {
		border-color: #d6dbd1;
		background: #eef0ec;
		color: #1c1c1c;
	}

	.bohemcars-vehicle-pill a {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		height: 100%;
		padding: 4px 14px;
		white-space: nowrap;
	}

	.bohemcars-vehicle-pill svg {
		flex: 0 0 auto;
	}

	@media (max-width: 575px) {
		.bohemcars-vehicle-pills {
			justify-content: flex-start;
			margin-inline: -24px;
			padding-inline: 24px;
		}

		.bohemcars-vehicle-pills :global(.menu-tab-style2) {
			justify-content: flex-start;
			max-width: none;
		}
	}
</style>
