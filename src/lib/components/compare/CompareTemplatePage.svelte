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
	:global(body.auxero-template-compare-html section.pb-100 h1),
	:global(body.auxero-template-compare-html section.pb-100 h2),
	:global(body.auxero-template-compare-html section.pb-100 h2 + p) {
		color: #1c1c1c !important;
	}

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
		:global(body.auxero-template-compare-html #wrapper),
		:global(body.auxero-template-compare-html section.pb-100) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		:global(body.auxero-template-compare-html section.pb-100) {
			padding-top: 20px !important;
			padding-bottom: 92px !important;
		}

		:global(body.auxero-template-compare-html section.pb-100 .tf-spacing-style3) {
			display: none !important;
		}

		:global(body.auxero-template-compare-html section.pb-100 > .container) {
			width: 100% !important;
			max-width: none !important;
			padding-right: 14px !important;
			padding-left: 14px !important;
		}

		:global(body.auxero-template-compare-html section.pb-100 h2) {
			margin-bottom: 8px !important;
			color: #111111 !important;
			font-size: 28px !important;
			font-weight: 850 !important;
			line-height: 33px !important;
			text-align: left !important;
		}

		:global(body.auxero-template-compare-html section.pb-100 h2 + p) {
			margin-bottom: 18px !important;
			text-align: left !important;
			font-size: 15px !important;
			line-height: 22px !important;
		}

		:global(body.auxero-template-compare-html .card-details) {
			overflow: hidden !important;
			border: 1px solid var(--bc-border) !important;
			border-radius: 8px !important;
			background: var(--bc-surface) !important;
			padding: 8px !important;
		}

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
