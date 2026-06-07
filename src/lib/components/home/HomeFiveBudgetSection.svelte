<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import HomeFiveVehicleCard from './HomeFiveVehicleCard.svelte';

	let {
		copy,
		vehicles = []
	}: {
		copy: HomePageCopy;
		vehicles?: HomeFiveVehicleCardData[];
	} = $props();

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
		<div class="bohemcars-budget-shortcuts wow fadeInUp" data-wow-delay="0.1s">
			<div class="title-section bohemcars-budget-heading">
				<h2>{copy.budgetTitle}</h2>
			</div>
			<div class="bohemcars-budget-tabs flex items-center gap-8 overflow-x-auto">
				<ul class="menu-tab menu-tab-style2 gap-10">
					{#each copy.budgetTabs as tab, index (tab.label)}
						<li class={tab.active ? 'active car-box' : 'car-box'}>
							<a href={resolve(budgetTabHref(index))}>{tab.label}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
		{#if vehicles.length}
			<div class="bohemcars-budget-grid lg-grid-cols-2 sm-grid-cols-1 grid grid-cols-4 gap-30">
				{#each vehicles as vehicle (vehicle.slug)}
					<HomeFiveVehicleCard {vehicle} copy={copy.vehicleCard} style2 />
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.bohemcars-budget-section {
		background: var(--bc-bg);
		color: #1c1c1c;
		padding-top: 64px;
		padding-bottom: 74px;
	}

	.bohemcars-budget-shortcuts {
		display: grid;
		grid-template-columns: minmax(230px, 0.32fr) minmax(0, 1fr);
		align-items: center;
		gap: 28px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-soft);
		padding: 26px 28px;
		box-shadow: none;
	}

	.bohemcars-budget-grid {
		margin-top: 30px;
	}

	.bohemcars-budget-heading {
		display: block !important;
		margin: 0 !important;
		text-align: left;
	}

	.bohemcars-budget-heading h2 {
		margin: 0;
		color: #1c1c1c;
		font-size: 34px;
		line-height: 42px;
	}

	.bohemcars-budget-tabs {
		justify-content: flex-end;
		width: 100%;
		margin: 0 !important;
		overflow-x: auto !important;
		scrollbar-width: none;
	}

	.bohemcars-budget-tabs::-webkit-scrollbar {
		display: none;
	}

	.bohemcars-budget-tabs :global(.menu-tab-style2) {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		width: 100% !important;
		min-width: 0 !important;
		margin: 0 !important;
		gap: 10px;
	}

	.bohemcars-budget-section :global(.menu-tab-style2 .car-box) {
		display: flex;
		min-height: 54px;
		align-items: stretch;
		justify-content: center;
		border: 1px solid var(--bc-border) !important;
		border-radius: 8px !important;
		background: var(--bc-surface) !important;
		color: #1c1c1c;
		padding: 0 !important;
		text-align: center;
	}

	.bohemcars-budget-section :global(.menu-tab-style2 .car-box a) {
		display: inline-flex;
		min-height: inherit;
		width: 100%;
		align-items: center;
		justify-content: center;
		color: inherit;
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
		padding: 8px 12px;
		text-decoration: none;
	}

	.bohemcars-budget-section :global(.menu-tab-style2 .car-box:hover),
	.bohemcars-budget-section :global(.menu-tab-style2 .car-box.active) {
		border-color: #cde85f !important;
		background: #d7f75b !important;
		color: #1c1c1c !important;
	}

	@media (max-width: 1199px) {
		.bohemcars-budget-shortcuts {
			grid-template-columns: 1fr;
			gap: 18px;
		}

		.bohemcars-budget-tabs {
			justify-content: flex-start;
		}
	}

	@media (max-width: 767px) {
		.bohemcars-budget-section {
			padding-top: 28px;
			padding-bottom: 34px;
		}

		.bohemcars-budget-shortcuts {
			display: block;
			border: 0;
			border-radius: 0;
			background: transparent;
			padding: 0;
		}

		.bohemcars-budget-grid {
			margin-top: 16px;
		}

		.bohemcars-budget-heading {
			margin-bottom: 16px !important;
		}

		.bohemcars-budget-heading h2 {
			font-size: 24px;
			font-weight: 700;
			line-height: 30px;
		}

		.bohemcars-budget-tabs {
			margin-inline: -16px !important;
			padding-inline: 16px;
		}

		.bohemcars-budget-tabs :global(.menu-tab-style2) {
			display: flex;
			width: auto !important;
			min-width: max-content !important;
		}

		.bohemcars-budget-section :global(.menu-tab-style2 .car-box) {
			min-height: 42px;
			min-width: 142px;
		}

		.bohemcars-budget-section :global(.menu-tab-style2 .car-box a) {
			font-size: 13px;
			font-weight: 700;
			line-height: 18px;
			padding: 7px 12px;
		}
	}
</style>
