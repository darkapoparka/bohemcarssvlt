<script lang="ts">
	import HomeFiveVehicleCard from './HomeFiveVehicleCard.svelte';
	import HomeSectionCta from './HomeSectionCta.svelte';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';

	let { copy, vehicles }: { copy: HomePageCopy; vehicles: HomeFiveVehicleCardData[] } = $props();
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
					{#each copy.budgetTabs as tab (tab.label)}
						<li class={tab.active ? 'active car-box' : 'car-box'}>{tab.label}</li>
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
		background: #ffffff;
		border-color: #d9d9d9;
		color: #1c1c1c;
	}

	section :global(.menu-tab-style2 .car-box:hover),
	section :global(.menu-tab-style2 .car-box.active) {
		border-color: #d6dbd1 !important;
		background-color: #eef0ec !important;
		color: #1c1c1c !important;
	}

	@media (max-width: 767px) {
		.bohemcars-budget-section {
			background: #ffffff;
			padding-top: 28px;
			padding-bottom: 34px;
		}

		.bohemcars-home-section-surface {
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
			margin-inline: -16px;
			padding-inline: 16px;
			scrollbar-width: none;
		}

		.bohemcars-budget-tabs :global(.menu-tab-style2) {
			justify-content: flex-start;
			width: auto;
			min-width: max-content;
		}

		.bohemcars-budget-section :global(.menu-tab-style2 .car-box) {
			min-height: 38px;
			border: 0 !important;
			border-radius: 8px !important;
			background: #eef1ed !important;
			padding: 0 13px !important;
			font-size: 12px;
			font-weight: 800;
			line-height: 38px;
			white-space: nowrap;
		}

		.bohemcars-budget-section :global(.menu-tab-style2 .car-box.active),
		.bohemcars-budget-section :global(.menu-tab-style2 .car-box:hover) {
			background: #e4eadf !important;
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
