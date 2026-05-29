<script lang="ts">
	import type { AuxeroCompareVehicle } from '$lib/auxero/compare';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { Locale } from '$lib/i18n/messages';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AuxeroCompareTable from './AuxeroCompareTable.svelte';

	let {
		afterCompareHtml,
		beforeCompareHtml,
		dashboardShell = false,
		locale,
		pageDocument,
		vehicles
	}: {
		afterCompareHtml: string;
		beforeCompareHtml: string;
		dashboardShell?: boolean;
		locale: Locale;
		pageDocument: AuxeroPageDocument;
		vehicles: AuxeroCompareVehicle[];
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeCompareHtml} afterHtml={afterCompareHtml}>
	{#if dashboardShell}
		<div class="dashboard-content--inner">
			<p class="h3 mb-30">My Compare</p>
			<div class="dashboard-box bohemcars-dashboard-compare bg-white">
				<div class="bohemcars-dashboard-compare-scroll overflow-x-auto">
					<AuxeroCompareTable {locale} {vehicles} />
				</div>
			</div>
		</div>
	{:else}
		<AuxeroCompareTable {locale} {vehicles} />
	{/if}
</AuxeroPageShell>

<style>
	:global(.bohemcars-dashboard-compare-scroll) {
		overflow-x: auto;
	}

	:global(.bohemcars-dashboard-compare .bohemcars-compare-table) {
		min-width: 900px;
		width: max-content;
	}

	:global(.bohemcars-dashboard-compare .bohemcars-compare-table td:first-child) {
		min-width: 220px;
	}

	:global(.bohemcars-dashboard-compare .bohemcars-compare-table td:not(:first-child)) {
		min-width: 270px;
	}

	:global(.bohemcars-dashboard-compare .bohemcars-compare-table td:first-child img) {
		flex: 0 0 24px;
		height: 24px;
		object-fit: contain;
		width: 24px;
	}

	@media (max-width: 767px) {
		:global(.bohemcars-dashboard-compare .bohemcars-compare-table) {
			min-width: 560px;
		}

		:global(.bohemcars-dashboard-compare .bohemcars-compare-table td:first-child) {
			min-width: 120px;
		}

		:global(.bohemcars-dashboard-compare .bohemcars-compare-table td:not(:first-child)) {
			min-width: 220px;
		}
	}
</style>
