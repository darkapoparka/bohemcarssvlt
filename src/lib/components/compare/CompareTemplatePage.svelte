<script lang="ts">
	import { resolve } from '$app/paths';
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
				<div class="bohemcars-compare-hero mb-40">
					<div class="bohemcars-compare-hero__copy">
						<p class="bohemcars-compare-hero__eyebrow">
							{locale === 'bg' ? 'Сравнение' : 'Compare'}
						</p>
						<h1 class="h2">
							{locale === 'bg' ? 'Сравни автомобили от Bohemcars' : 'Compare Bohemcars vehicles'}
						</h1>
						<p>
							{locale === 'bg'
								? 'Прегледай цена, пробег, история, оборудване и наличност в една ясна таблица.'
								: 'Review price, mileage, history, equipment, and availability in one clear table.'}
						</p>
						<a
							href={resolve('/inventory')}
							class="btn btn-primary-3 btn-large font-weight-600 bohemcars-compare-hero__cta"
						>
							<span>{locale === 'bg' ? 'Добави автомобили' : 'Add vehicles'}</span>
							<span aria-hidden="true">→</span>
						</a>
					</div>
					<div class="bohemcars-compare-hero__visual" aria-hidden="true">
						<img
							class="bohemcars-compare-hero__car bohemcars-compare-hero__car--left"
							src="/assets/bohemcars/megamenu/inventory-audi-sq5-cutout.webp"
							alt=""
							loading="lazy"
						/>
						<img
							class="bohemcars-compare-hero__car bohemcars-compare-hero__car--right"
							src="/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.webp"
							alt=""
							loading="lazy"
						/>
						<span class="bohemcars-compare-hero__vs">VS</span>
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
	:global(body.auxero-template-compare-html section.pb-100 .title-section h1),
	:global(body.auxero-template-compare-html section.pb-100 .title-section h2),
	:global(body.auxero-template-compare-html section.pb-100 .title-section h1 + p),
	:global(body.auxero-template-compare-html section.pb-100 .title-section h2 + p) {
		color: #1c1c1c !important;
	}

	:global(.bohemcars-dashboard-compare-scroll) {
		overflow-x: auto;
	}

	.bohemcars-compare-hero {
		position: relative;
		display: grid;
		min-height: 250px;
		grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
		align-items: center;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: linear-gradient(135deg, #14210f 0%, #1f3318 58%, #0f190c 100%);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
		padding: 32px 36px;
	}

	.bohemcars-compare-hero__copy {
		position: relative;
		z-index: 2;
		max-width: 540px;
	}

	.bohemcars-compare-hero__eyebrow {
		margin: 0 0 8px;
		color: #d9f275 !important;
		font-size: 13px;
		font-weight: 800;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-compare-hero h1 {
		margin: 0 0 12px;
		color: #ffffff !important;
	}

	.bohemcars-compare-hero__copy p:not(.bohemcars-compare-hero__eyebrow) {
		margin: 0;
		color: rgba(255, 255, 255, 0.78) !important;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
	}

	.bohemcars-compare-hero__cta {
		width: fit-content !important;
		min-width: 210px;
		margin-top: 22px;
		gap: 8px;
		border-color: #98bc2a !important;
		background: #98bc2a !important;
		color: #14210f !important;
	}

	.bohemcars-compare-hero__cta:hover,
	.bohemcars-compare-hero__cta:focus-visible {
		border-color: #ffffff !important;
		background: #ffffff !important;
		color: #14210f !important;
		transform: none !important;
	}

	.bohemcars-compare-hero__cta::before,
	.bohemcars-compare-hero__cta::after {
		display: none !important;
	}

	.bohemcars-compare-hero__visual {
		position: relative;
		min-height: 190px;
	}

	.bohemcars-compare-hero__car {
		position: absolute;
		bottom: -16px;
		display: block;
		height: auto;
		max-width: none;
		filter: saturate(0.96) contrast(1.02);
	}

	.bohemcars-compare-hero__car--left {
		left: -18px;
		width: min(52vw, 460px);
	}

	.bohemcars-compare-hero__car--right {
		right: -42px;
		width: min(50vw, 440px);
	}

	.bohemcars-compare-hero__vs {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 2;
		display: inline-flex;
		width: 54px;
		height: 54px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: #d9f275;
		color: #14210f;
		font-size: 15px;
		font-weight: 800;
		line-height: 1;
		transform: translate(-50%, -50%);
	}

	:global(body.auxero-template-compare-html .bohemcars-compare-hero h1),
	:global(body.auxero-template-compare-html .bohemcars-compare-hero p) {
		color: inherit !important;
	}

	:global(body.auxero-template-compare-html .bohemcars-compare-hero h1) {
		color: #ffffff !important;
	}

	:global(body.auxero-template-compare-html .bohemcars-compare-hero p) {
		color: rgba(255, 255, 255, 0.78) !important;
	}

	:global(
		body.auxero-template-compare-html .bohemcars-compare-hero .bohemcars-compare-hero__eyebrow
	) {
		color: #d9f275 !important;
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

		:global(body.auxero-template-compare-html .title-section) {
			justify-content: flex-start !important;
			margin-bottom: 10px !important;
			text-align: left !important;
		}

		.bohemcars-compare-hero {
			min-height: 0;
			grid-template-columns: 1fr;
			margin-bottom: 10px !important;
			border: 0;
			background: transparent;
			box-shadow: none;
			padding: 0;
		}

		.bohemcars-compare-hero__visual {
			display: none;
		}

		.bohemcars-compare-hero__cta {
			display: none !important;
		}

		:global(body.auxero-template-compare-html section.pb-100 .title-section h1),
		:global(body.auxero-template-compare-html section.pb-100 .title-section h2) {
			margin-bottom: 0 !important;
			color: #111111 !important;
			font-size: 24px !important;
			font-weight: 700 !important;
			line-height: 28px !important;
			text-align: left !important;
		}

		:global(body.auxero-template-compare-html section.pb-100 .title-section h1 + p),
		:global(body.auxero-template-compare-html section.pb-100 .title-section h2 + p) {
			display: none !important;
		}

		:global(body.auxero-template-compare-html .bohemcars-compare-hero h1) {
			margin-bottom: 0 !important;
			color: #111111 !important;
			font-size: 24px !important;
			font-weight: 700 !important;
			line-height: 28px !important;
			text-align: left !important;
		}

		:global(body.auxero-template-compare-html .bohemcars-compare-hero h1 + p) {
			display: none !important;
		}

		:global(
			body.auxero-template-compare-html .bohemcars-compare-hero .bohemcars-compare-hero__eyebrow
		) {
			display: none !important;
		}

		:global(body.auxero-template-compare-html .card-details) {
			overflow: hidden !important;
			border: 1px solid #dfe5d5 !important;
			border-radius: 10px !important;
			background: #f6f8f0 !important;
			padding: 8px !important;
			box-shadow: none !important;
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
