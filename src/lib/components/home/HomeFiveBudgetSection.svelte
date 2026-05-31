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
						<div class="lg-grid-cols-2 sm-grid-cols-1 grid grid-cols-4 gap-30">
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

	@media (max-width: 575px) {
		.bohemcars-home-section-surface {
			padding: 0;
		}

		.bohemcars-budget-tabs {
			justify-content: flex-start;
			margin-inline: -18px;
			padding-inline: 18px;
			scrollbar-width: none;
		}

		.bohemcars-budget-tabs::-webkit-scrollbar {
			display: none;
		}
	}
</style>
