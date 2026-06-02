<script lang="ts">
	import { resolve } from '$app/paths';
	import HomeFiveVehicleCard from './HomeFiveVehicleCard.svelte';
	import HomeSectionCta from './HomeSectionCta.svelte';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';

	let { copy, vehicles }: { copy: HomePageCopy; vehicles: HomeFiveVehicleCardData[] } = $props();

	const budgetTabHref = (index: number) =>
		(
			[
				'/inventory',
				'/inventory?minPrice=20000&maxPrice=50000',
				'/inventory?minPrice=50000&maxPrice=70000',
				'/inventory?minPrice=70000&maxPrice=100000',
				'/inventory?minPrice=100000'
			] as const
		)[index] ?? '/inventory';
</script>

<section class="bohemcars-budget-section flat-tabs py-100">
	<div class="container">
		<div class="bohemcars-home-section-surface">
			<div class="title-section wow fadeInUp mb-40">
				<h2>{copy.budgetTitle}</h2>
				<HomeSectionCta href="/inventory" label={copy.commonCta} />
			</div>
			<div
				class="bohemcars-budget-tabs wow fadeIn mb-40 flex items-center justify-center gap-8 overflow-x-auto"
				data-wow-delay="0.1s"
			>
				<ul class="menu-tab menu-tab-style2 margin-auto gap-10">
					{#each copy.budgetTabs as tab, index (tab.label)}
						<li class={tab.active ? 'active car-box' : 'car-box'}>
							<a href={resolve(budgetTabHref(index))}>{tab.label}</a>
						</li>
					{/each}
				</ul>
			</div>
			<div class="wow fadeIn" data-wow-delay="0.2s">
				<div class="content-tab">
					<div class="content-inner active">
						<div
							class="bohemcars-budget-vehicle-grid lg-grid-cols-2 sm-grid-cols-1 grid grid-cols-4 gap-30"
						>
							{#each vehicles as vehicle (vehicle.slug)}
								<HomeFiveVehicleCard {vehicle} copy={copy.vehicleCard} style2 />
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.bohemcars-budget-section {
		background: #ffffff;
		color: #1c1c1c;
		padding-top: 84px;
		padding-bottom: 88px;
	}

	.bohemcars-home-section-surface {
		background: transparent;
		border: 0;
		border-radius: 0;
		padding: 0;
	}

	.bohemcars-budget-section :global(h2),
	.bohemcars-budget-section :global(.card-box__title),
	.bohemcars-budget-section :global(.card-box__price) {
		color: #1c1c1c;
	}

	.bohemcars-budget-section :global(.menu-tab-style2 .car-box) {
		background: #f4f6f1;
		border-color: #dfe5d8;
		color: #1c1c1c;
	}

	.bohemcars-budget-section :global(.menu-tab-style2 .car-box a) {
		display: inline-flex;
		min-height: inherit;
		align-items: center;
		color: inherit;
		text-decoration: none;
	}

	section :global(.menu-tab-style2 .car-box:hover),
	section :global(.menu-tab-style2 .car-box.active) {
		border-color: #cde85f !important;
		background-color: #d7f75b !important;
		color: #1c1c1c !important;
	}

	@media (min-width: 768px) {
		.bohemcars-home-section-surface {
			background: #fbfcf8;
			border: 1px solid #e2e8dc;
			border-radius: 14px;
			padding: 26px 16px 16px;
		}

		.bohemcars-budget-section :global(.title-section) {
			align-items: center;
			margin-bottom: 18px !important;
			padding-inline: 6px;
		}

		.bohemcars-budget-section :global(.title-section h2) {
			color: #16210f;
		}

		.bohemcars-budget-tabs {
			justify-content: flex-start;
			margin: 0 -16px 22px !important;
			border: solid #dde4d4;
			border-width: 1px 0;
			border-radius: 0;
			background: #ffffff;
			padding: 14px 16px;
			overflow-x: auto !important;
			scrollbar-width: none;
		}

		.bohemcars-budget-tabs::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-budget-tabs :global(.menu-tab-style2) {
			display: flex;
			flex: 0 1 auto;
			flex-wrap: wrap;
			justify-content: flex-start;
			width: auto !important;
			max-width: 100%;
			min-width: 0 !important;
			margin: 0 !important;
		}
	}

	@media (max-width: 767px) {
		.bohemcars-budget-section {
			background: #ffffff;
			padding-top: 28px;
			padding-bottom: 34px;
		}

		.bohemcars-home-section-surface {
			background: transparent;
			border: 0;
			border-radius: 0;
			padding: 0;
		}

		.bohemcars-budget-section :global(.title-section) {
			align-items: center;
			gap: 14px;
			margin-bottom: 16px !important;
		}

		.bohemcars-budget-section :global(.title-section h2) {
			font-size: 24px;
			font-weight: 700;
			line-height: 30px;
		}

		.bohemcars-budget-section :global(.bohemcars-section-cta) {
			display: none !important;
		}

		.bohemcars-budget-tabs {
			justify-content: flex-start;
			margin-bottom: 16px !important;
			margin-inline: 0;
			border: 0;
			border-radius: 0;
			background: transparent;
			padding-inline: 0;
			scrollbar-width: none;
		}

		.bohemcars-budget-tabs :global(.menu-tab-style2) {
			flex-wrap: nowrap;
			justify-content: flex-start;
			width: auto;
			min-width: max-content;
		}

		.bohemcars-budget-section :global(.menu-tab-style2 .car-box) {
			min-height: 40px;
			border: 1px solid #e2e8dc !important;
			border-radius: 10px !important;
			background: #f3f6f1 !important;
			padding: 0 13px !important;
			font-size: 13px;
			font-weight: 800;
			line-height: 38px;
			white-space: nowrap;
		}

		.bohemcars-budget-section :global(.menu-tab-style2 .car-box.active),
		.bohemcars-budget-section :global(.menu-tab-style2 .car-box:hover) {
			border-color: #cde85f !important;
			background: #d7f75b !important;
		}

		.bohemcars-budget-tabs::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-budget-vehicle-grid {
			display: flex !important;
			grid-template-columns: none !important;
			gap: 14px;
			margin-inline: -16px;
			overflow-x: auto;
			padding: 0 16px 8px;
			scroll-padding-inline: 16px;
			scroll-snap-type: x proximity;
			scrollbar-width: none;
		}

		.bohemcars-budget-vehicle-grid::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-budget-vehicle-grid :global(.card-box-style-1) {
			flex: 0 0 min(82vw, 320px);
			scroll-snap-align: start;
		}
	}
</style>
