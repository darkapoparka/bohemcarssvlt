<script lang="ts">
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroCompareVehicle } from '$lib/auxero/compare';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy, Locale } from '$lib/i18n/messages';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import AuxeroCompareTable from './AuxeroCompareTable.svelte';

	let {
		afterCompareHtml = '',
		beforeCompareHtml = '',
		dashboardShell = false,
		locale,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml = '',
		vehicles
	}: {
		afterCompareHtml?: string;
		beforeCompareHtml?: string;
		dashboardShell?: boolean;
		locale: Locale;
		pageDocument: AuxeroPageDocument;
		shellCopy?: HomePageCopy;
		shellFooter?: HomeFiveFooterData;
		shellHeader?: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml?: string;
		vehicles: AuxeroCompareVehicle[];
	} = $props();
</script>

{#if dashboardShell}
	<AuxeroDashboardSlotShell
		{pageDocument}
		beforeHtml={beforeCompareHtml}
		afterHtml={afterCompareHtml}
		title="My Compare"
	>
		<div class="dashboard-box bohemcars-dashboard-compare bg-white">
			<div class="bohemcars-dashboard-compare-scroll overflow-x-auto">
				<AuxeroCompareTable {locale} {vehicles} />
			</div>
		</div>
	</AuxeroDashboardSlotShell>
{:else if shellCopy && shellFooter && shellHeader}
	<AuxeroPublicShell
		copy={shellCopy}
		footer={shellFooter}
		header={shellHeader}
		modals={shellModals}
		{pageDocument}
		runtimeHtml={shellRuntimeHtml}
		title={locale === 'bg' ? 'Сравни автомобили — Bohemcars' : 'Compare Vehicles — Bohemcars'}
	>
		<section class="bohemcars-compare-page pb-100">
			<div class="tf-spacing-style3"></div>
			<div class="container">
				<div class="title-section mb-40 flex justify-center text-center">
					<div>
						<h1 class="h2 mb-12">
							{locale === 'bg' ? 'Сравни автомобили от Bohemcars' : 'Compare Bohemcars vehicles'}
						</h1>
						<p class="text-secondary">
							{locale === 'bg'
								? 'Прегледай цена, пробег, история, оборудване и наличност в една Auxero таблица.'
								: 'Review price, mileage, history, equipment, and availability in one Auxero table.'}
						</p>
					</div>
				</div>
				<div class="card-details">
					<AuxeroCompareTable {locale} {vehicles} />
				</div>
			</div>
		</section>
	</AuxeroPublicShell>
{/if}

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
