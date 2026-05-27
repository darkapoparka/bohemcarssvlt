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
			<div
				class="bohemcars-featured-vehicles__title wow fadeInUp mb-40 flex items-center justify-center"
				data-wow-delay="0.1s"
			>
				<h2>Bohemcars Vehicles</h2>
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
	.bohemcars-featured-vehicles__title h2 {
		text-transform: none;
	}

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
